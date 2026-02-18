import { NextRequest, NextResponse } from "next/server";
import { getSubscriptionDetails, getPlanFromPlanId } from "@/lib/paypal";
import { applyPlanToOrg } from "@/lib/plans";
import pool from "@/lib/db";

const DEV_USER_ID = "dev_local_user";

function isClerkConfigured(): boolean {
  const key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || "";
  return key.startsWith("pk_live_") || key.startsWith("pk_test_");
}

function getClerkUserId(): string | null {
  if (!isClerkConfigured()) return DEV_USER_ID;
  const { auth } = require("@clerk/nextjs/server");
  const { userId } = auth();
  return userId;
}

export async function POST(req: NextRequest) {
  try {
    const userId = getClerkUserId();
    if (!userId) {
      return NextResponse.json(
        { error: "Nicht autorisiert" },
        { status: 401 }
      );
    }

    const { subscriptionId } = await req.json();
    if (!subscriptionId) {
      return NextResponse.json(
        { error: "subscriptionId required" },
        { status: 400 }
      );
    }

    // Get the user's org
    const userResult = await pool.query(
      `SELECT u.*, o.id as org_id, o.paypal_subscription_id
       FROM users u JOIN organizations o ON u.org_id = o.id
       WHERE u.clerk_user_id = $1`,
      [userId]
    );

    if (!userResult.rows[0]) {
      return NextResponse.json(
        { error: "Benutzer nicht gefunden" },
        { status: 404 }
      );
    }

    const user = userResult.rows[0];

    // Idempotency: already activated with this subscription
    if (user.paypal_subscription_id === subscriptionId) {
      return NextResponse.json({ success: true, plan: user.plan });
    }

    // Verify subscription with PayPal
    const subscription = await getSubscriptionDetails(subscriptionId);

    if (!["ACTIVE", "APPROVED"].includes(subscription.status)) {
      return NextResponse.json(
        { error: "Abonnement ist nicht aktiv" },
        { status: 400 }
      );
    }

    const planId = subscription.plan_id;
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
        subscription.subscriber?.payer_id || "",
        subscriptionId,
        planId,
        limits.max_materials,
        limits.max_users,
        limits.max_alerts,
        limits.features_telegram,
        limits.features_forecast,
        limits.features_api,
        limits.features_pdf_reports,
        user.org_id,
      ]
    );

    return NextResponse.json({ success: true, plan: limits.plan });
  } catch (error: any) {
    console.error("PayPal activate error:", error);
    return NextResponse.json(
      { error: "Aktivierung fehlgeschlagen" },
      { status: 500 }
    );
  }
}
