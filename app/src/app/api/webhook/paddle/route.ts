import { NextRequest, NextResponse } from "next/server";
import { verifyWebhookSignature, getPlanFromPriceId } from "@/lib/paddle";
import { applyPlanToOrg } from "@/lib/plans";
import pool from "@/lib/db";

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("paddle-signature") || "";
  const secret = process.env.PADDLE_WEBHOOK_SECRET || "";

  if (secret && !verifyWebhookSignature(rawBody, signature, secret)) {
    console.error("[Paddle Webhook] Invalid signature");
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(rawBody);
  const eventType = event.event_type as string;
  const data = event.data;

  console.log("[Paddle Webhook]", eventType, data?.id);

  switch (eventType) {
    // Subscription created or activated — apply plan
    case "subscription.created":
    case "subscription.activated":
    case "subscription.updated": {
      const subscriptionId = data.id;
      const customerId = data.customer_id;
      const status = data.status; // active, trialing, past_due, canceled, paused
      const orgId = data.custom_data?.orgId;
      const priceId = data.items?.[0]?.price?.id;

      if (!orgId || !priceId) {
        console.error("[Paddle Webhook] Missing orgId or priceId", { orgId, priceId });
        break;
      }

      const plan = getPlanFromPriceId(priceId);
      const limits = applyPlanToOrg(plan);

      if (status === "active" || status === "trialing") {
        await pool.query(
          `UPDATE organizations SET
             plan = $1, paddle_customer_id = $2, paddle_subscription_id = $3,
             paddle_price_id = $4, paddle_status = $5,
             max_materials = $6, max_users = $7, max_alerts = $8,
             features_telegram = $9, features_forecast = $10,
             features_api = $11, features_pdf_reports = $12, updated_at = NOW()
           WHERE id = $13`,
          [
            limits.plan,
            customerId,
            subscriptionId,
            priceId,
            status,
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
        console.log("[Paddle Webhook] Org updated:", orgId, "plan:", plan);
      }
      break;
    }

    // Subscription canceled
    case "subscription.canceled": {
      const subscriptionId = data.id;
      await pool.query(
        `UPDATE organizations SET plan = 'cancelled', paddle_status = 'canceled', updated_at = NOW()
         WHERE paddle_subscription_id = $1`,
        [subscriptionId]
      );
      console.log("[Paddle Webhook] Subscription canceled:", subscriptionId);
      break;
    }

    // Payment failed — mark as past_due
    case "subscription.past_due": {
      const subscriptionId = data.id;
      await pool.query(
        `UPDATE organizations SET plan = 'suspended', paddle_status = 'past_due', updated_at = NOW()
         WHERE paddle_subscription_id = $1`,
        [subscriptionId]
      );
      console.log("[Paddle Webhook] Subscription past_due:", subscriptionId);
      break;
    }

    // Transaction completed (payment received) — no action needed
    case "transaction.completed": {
      console.log("[Paddle Webhook] Transaction completed:", data.id);
      break;
    }

    default:
      console.log("[Paddle Webhook] Unhandled event:", eventType);
  }

  return NextResponse.json({ received: true });
}
