import { NextRequest, NextResponse } from "next/server";
import { constructWebhookEvent, getPlanFromPriceId } from "@/lib/stripe";
import { applyPlanToOrg } from "@/lib/plans";
import pool from "@/lib/db";

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("stripe-signature") || "";
  const secret = process.env.STRIPE_WEBHOOK_SECRET || "";

  let event;
  try {
    event = constructWebhookEvent(rawBody, signature, secret);
  } catch (err: any) {
    console.error("[Stripe Webhook] Signature verification failed:", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  console.log("[Stripe Webhook]", event.type, event.id);

  switch (event.type) {
    // Checkout completed — new subscription
    case "checkout.session.completed": {
      const session = event.data.object as any;
      const orgId = session.metadata?.orgId;
      const subscriptionId = session.subscription;
      const customerId = session.customer;

      if (!orgId || !subscriptionId) {
        console.error("[Stripe Webhook] Missing orgId or subscriptionId", { orgId, subscriptionId });
        break;
      }

      // Retrieve subscription to get the price ID
      const { getStripe } = await import("@/lib/stripe");
      const subscription = await getStripe().subscriptions.retrieve(subscriptionId as string);
      const priceId = subscription.items.data[0]?.price?.id;

      if (!priceId) {
        console.error("[Stripe Webhook] No price ID in subscription");
        break;
      }

      const plan = getPlanFromPriceId(priceId);
      const limits = applyPlanToOrg(plan);

      await pool.query(
        `UPDATE organizations SET
           plan = $1, stripe_customer_id = $2, stripe_subscription_id = $3,
           stripe_price_id = $4, stripe_status = $5,
           max_materials = $6, max_users = $7, max_alerts = $8,
           features_telegram = $9, features_forecast = $10,
           features_api = $11, features_pdf_reports = $12, updated_at = NOW()
         WHERE id = $13`,
        [
          limits.plan,
          customerId,
          subscriptionId,
          priceId,
          subscription.status,
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
      console.log("[Stripe Webhook] Org updated:", orgId, "plan:", plan);
      break;
    }

    // Subscription updated — plan change, renewal
    case "customer.subscription.updated": {
      const subscription = event.data.object as any;
      const subscriptionId = subscription.id;
      const status = subscription.status;
      const priceId = subscription.items?.data?.[0]?.price?.id;

      if (!priceId) break;

      const plan = getPlanFromPriceId(priceId);
      const limits = applyPlanToOrg(plan);

      if (status === "active" || status === "trialing") {
        await pool.query(
          `UPDATE organizations SET
             plan = $1, stripe_price_id = $2, stripe_status = $3,
             max_materials = $4, max_users = $5, max_alerts = $6,
             features_telegram = $7, features_forecast = $8,
             features_api = $9, features_pdf_reports = $10, updated_at = NOW()
           WHERE stripe_subscription_id = $11`,
          [
            limits.plan,
            priceId,
            status,
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
        console.log("[Stripe Webhook] Subscription updated:", subscriptionId, "plan:", plan);
      } else if (status === "past_due") {
        await pool.query(
          `UPDATE organizations SET plan = 'suspended', stripe_status = 'past_due', updated_at = NOW()
           WHERE stripe_subscription_id = $1`,
          [subscriptionId]
        );
        console.log("[Stripe Webhook] Subscription past_due:", subscriptionId);
      }
      break;
    }

    // Subscription canceled
    case "customer.subscription.deleted": {
      const subscription = event.data.object as any;
      await pool.query(
        `UPDATE organizations SET plan = 'cancelled', stripe_status = 'canceled', updated_at = NOW()
         WHERE stripe_subscription_id = $1`,
        [subscription.id]
      );
      console.log("[Stripe Webhook] Subscription canceled:", subscription.id);
      break;
    }

    // Payment failed
    case "invoice.payment_failed": {
      const invoice = event.data.object as any;
      const subscriptionId = invoice.subscription;
      if (subscriptionId) {
        await pool.query(
          `UPDATE organizations SET plan = 'suspended', stripe_status = 'past_due', updated_at = NOW()
           WHERE stripe_subscription_id = $1`,
          [subscriptionId]
        );
        console.log("[Stripe Webhook] Payment failed:", subscriptionId);
      }
      break;
    }

    default:
      console.log("[Stripe Webhook] Unhandled event:", event.type);
  }

  return NextResponse.json({ received: true });
}
