import { NextRequest, NextResponse } from "next/server";
import { createSubscription } from "@/lib/paypal";

const DEV_USER_ID = "dev_local_user";

function isClerkConfigured(): boolean {
  const key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || "";
  return key.startsWith("pk_live_") || key.startsWith("pk_test_");
}

async function getOrgForUser(userId: string) {
  const pool = (await import("@/lib/db")).default;
  const result = await pool.query(
    `SELECT u.email, o.id as org_id
     FROM users u JOIN organizations o ON u.org_id = o.id
     WHERE u.clerk_user_id = $1`,
    [userId]
  );
  return result.rows[0] || null;
}

export async function POST(req: NextRequest) {
  try {
    let userId: string | null = null;

    if (isClerkConfigured()) {
      const { auth } = require("@clerk/nextjs/server");
      const session = auth();
      userId = session?.userId || null;
    } else {
      userId = DEV_USER_ID;
    }

    if (!userId) {
      return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
    }

    const { plan, period } = await req.json();
    if (!plan || !period) {
      return NextResponse.json(
        { error: "plan and period required" },
        { status: 400 }
      );
    }

    const envKey = `PAYPAL_PLAN_${plan.toUpperCase()}_${period.toUpperCase()}`;
    const planId = process.env[envKey];
    if (!planId) {
      return NextResponse.json({ error: "Plan nicht gefunden" }, { status: 404 });
    }

    const user = await getOrgForUser(userId);
    if (!user) {
      return NextResponse.json(
        { error: "Benutzer nicht gefunden" },
        { status: 404 }
      );
    }

    console.log(
      "[PayPal] Creating subscription via REST API:",
      { plan, period, planId, orgId: user.org_id }
    );

    const result = await createSubscription(
      planId,
      user.org_id,
      user.email || ""
    );

    console.log("[PayPal] Subscription created:", result.subscriptionId);

    return NextResponse.json({
      subscriptionId: result.subscriptionId,
      approveUrl: result.approveUrl,
    });
  } catch (error: any) {
    console.error("[PayPal] create-subscription error:", error);
    return NextResponse.json(
      { error: error.message || "Fehler beim Erstellen des Abonnements" },
      { status: 500 }
    );
  }
}
