import { createSubscription, cancelSubscription } from "@/lib/paypal";
import pool from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

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

export async function GET() {
  try {
    const userId = getClerkUserId();
    if (!userId) {
      return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
    }

    const result = await pool.query(
      `SELECT o.id, o.name, o.plan, o.max_materials, o.max_users, o.max_alerts,
              o.features_telegram, o.features_forecast, o.features_api, o.features_pdf_reports,
              o.telegram_chat_id, o.whatsapp_phone,
              o.paypal_subscription_id, o.paypal_payer_id,
              o.trial_ends_at, o.is_active, o.created_at
       FROM organizations o
       JOIN users u ON u.org_id = o.id
       WHERE u.clerk_user_id = $1`,
      [userId]
    );

    if (!result.rows[0]) {
      return NextResponse.json({ error: "Organisation nicht gefunden" }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error: any) {
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = getClerkUserId();
    if (!userId) {
      return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
    }

    const body = await req.json();

    const userResult = await pool.query(
      `SELECT u.*, o.id as org_id, o.paypal_subscription_id
       FROM users u JOIN organizations o ON u.org_id = o.id
       WHERE u.clerk_user_id = $1`,
      [userId]
    );

    if (!userResult.rows[0]) {
      return NextResponse.json({ error: "Benutzer nicht gefunden" }, { status: 404 });
    }

    const user = userResult.rows[0];

    // Handle subscription management — redirect to PayPal account
    if (body.action === "manage_billing") {
      if (!user.paypal_subscription_id) {
        return NextResponse.json(
          { error: "Kein aktives Abonnement vorhanden" },
          { status: 400 }
        );
      }
      const portalUrl =
        process.env.PAYPAL_MODE === "live"
          ? "https://www.paypal.com/myaccount/autopay"
          : "https://www.sandbox.paypal.com/myaccount/autopay";
      return NextResponse.json({ portalUrl });
    }

    // Handle subscription cancellation
    if (body.action === "cancel_subscription") {
      if (!user.paypal_subscription_id) {
        return NextResponse.json(
          { error: "Kein aktives Abonnement vorhanden" },
          { status: 400 }
        );
      }
      await cancelSubscription(user.paypal_subscription_id, "Cancelled by user");
      return NextResponse.json({ success: true });
    }

    // Handle new subscription checkout
    const { plan, billingPeriod } = body;

    if (!plan || !billingPeriod) {
      return NextResponse.json(
        { error: "Plan und Abrechnungszeitraum erforderlich" },
        { status: 400 }
      );
    }

    const planEnvKey = `PAYPAL_PLAN_${plan.toUpperCase()}_${billingPeriod.toUpperCase()}`;
    const planId = process.env[planEnvKey];

    if (!planId) {
      return NextResponse.json(
        { error: "Ungültige Plan-Konfiguration" },
        { status: 400 }
      );
    }

    const { approveUrl } = await createSubscription(
      planId,
      user.org_id,
      user.email
    );

    return NextResponse.json({ approveUrl });
  } catch (error: any) {
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const userId = getClerkUserId();
    if (!userId) {
      return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
    }

    const body = await req.json();
    const { name } = body;

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json({ error: "Name ist erforderlich" }, { status: 400 });
    }

    await pool.query(
      `UPDATE organizations SET name = $1, updated_at = NOW()
       WHERE id = (SELECT org_id FROM users WHERE clerk_user_id = $2)`,
      [name.trim(), userId]
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 });
  }
}
