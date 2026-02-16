import { NextRequest, NextResponse } from "next/server";
import { verifyWebhookSignature, getPlanFromPlanId } from "@/lib/paypal";
import { applyPlanToOrg } from "@/lib/plans";
import pool from "@/lib/db";

export async function POST(req: NextRequest) {
  const body = await req.text();

  // Verify PayPal webhook signature
  const headers: Record<string, string> = {};
  for (const key of [
    "paypal-auth-algo",
    "paypal-cert-url",
    "paypal-transmission-id",
    "paypal-transmission-sig",
    "paypal-transmission-time",
  ]) {
    headers[key] = req.headers.get(key) || "";
  }

  const isValid = await verifyWebhookSignature(headers, body);
  if (!isValid) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(body);
  const eventType = event.event_type as string;
  const resource = event.resource;

  switch (eventType) {
    // Subscription activated (first payment successful)
    case "BILLING.SUBSCRIPTION.ACTIVATED": {
      const orgId = resource.custom_id;
      const planId = resource.plan_id;
      const subscriptionId = resource.id;
      const payerId = resource.subscriber?.payer_id || "";

      if (!orgId || !planId) break;

      const plan = getPlanFromPlanId(planId);
      const limits = applyPlanToOrg(plan);

      await pool.query(
        `UPDATE organizations SET
           plan = $1, paypal_payer_id = $2, paypal_subscription_id = $3,
           paypal_plan_id = $4, max_materials = $5, max_users = $6,
           max_alerts = $7, features_telegram = $8, features_forecast = $9,
           features_api = $10, features_pdf_reports = $11, updated_at = NOW()
         WHERE id = $12`,
        [
          limits.plan,
          payerId,
          subscriptionId,
          planId,
          limits.max_materials,
          limits.max_users,
          limits.max_alerts,
          limits.features_telegram,
          limits.features_forecast,
          limits.features_api,
          limits.features_pdf_reports,
          orgId,
        ]
      );
      break;
    }

    // Subscription cancelled
    case "BILLING.SUBSCRIPTION.CANCELLED": {
      const subscriptionId = resource.id;
      await pool.query(
        `UPDATE organizations SET plan = 'cancelled', updated_at = NOW()
         WHERE paypal_subscription_id = $1`,
        [subscriptionId]
      );
      break;
    }

    // Subscription suspended (payment failed)
    case "BILLING.SUBSCRIPTION.SUSPENDED": {
      const subscriptionId = resource.id;
      await pool.query(
        `UPDATE organizations SET plan = 'suspended', updated_at = NOW()
         WHERE paypal_subscription_id = $1`,
        [subscriptionId]
      );
      break;
    }

    // Subscription re-activated after suspension
    case "BILLING.SUBSCRIPTION.RE-ACTIVATED": {
      const subscriptionId = resource.id;
      const planId = resource.plan_id;
      if (!planId) break;

      const plan = getPlanFromPlanId(planId);
      const limits = applyPlanToOrg(plan);

      await pool.query(
        `UPDATE organizations SET
           plan = $1, max_materials = $2, max_users = $3, max_alerts = $4,
           features_telegram = $5, features_forecast = $6,
           features_api = $7, features_pdf_reports = $8, updated_at = NOW()
         WHERE paypal_subscription_id = $9`,
        [
          limits.plan,
          limits.max_materials,
          limits.max_users,
          limits.max_alerts,
          limits.features_telegram,
          limits.features_forecast,
          limits.features_api,
          limits.features_pdf_reports,
          subscriptionId,
        ]
      );
      break;
    }

    // Successful recurring payment
    case "PAYMENT.SALE.COMPLETED": {
      // Payment received — no action needed, subscription stays active
      break;
    }
  }

  return NextResponse.json({ received: true });
}
