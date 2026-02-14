import { NextRequest, NextResponse } from "next/server";
import { stripe, getPlanFromPriceId } from "@/lib/stripe";
import { applyPlanToOrg } from "@/lib/plans";
import pool from "@/lib/db";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const orgId = session.metadata?.orgId;
      const subscription = await stripe.subscriptions.retrieve(
        session.subscription as string
      );
      const priceId = subscription.items.data[0].price.id;
      const plan = getPlanFromPriceId(priceId);
      const limits = applyPlanToOrg(plan);

      await pool.query(
        `UPDATE organizations SET
           plan = $1, stripe_customer_id = $2, stripe_subscription_id = $3,
           stripe_price_id = $4, max_materials = $5, max_users = $6,
           max_alerts = $7, features_telegram = $8, features_forecast = $9,
           features_api = $10, features_pdf_reports = $11, updated_at = NOW()
         WHERE id = $12`,
        [
          limits.plan,
          session.customer,
          session.subscription,
          priceId,
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

    case "customer.subscription.updated": {
      const sub = event.data.object;
      const orgId = sub.metadata?.orgId;
      if (sub.status === "active") {
        const priceId = sub.items.data[0].price.id;
        const plan = getPlanFromPriceId(priceId);
        const limits = applyPlanToOrg(plan);
        await pool.query(
          `UPDATE organizations SET plan=$1, stripe_price_id=$2, max_materials=$3,
           max_users=$4, max_alerts=$5, features_telegram=$6, features_forecast=$7,
           features_api=$8, features_pdf_reports=$9, updated_at=NOW() WHERE id=$10`,
          [
            limits.plan,
            priceId,
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
      }
      break;
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object;
      await pool.query(
        `UPDATE organizations SET plan='cancelled', updated_at=NOW()
         WHERE stripe_subscription_id = $1`,
        [sub.id]
      );
      break;
    }

    case "invoice.payment_failed": {
      // TODO: send email notification about failed payment
      break;
    }
  }

  return NextResponse.json({ received: true });
}
