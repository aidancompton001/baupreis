import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
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
      return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
    }

    const result = await pool.query(
      `SELECT o.stripe_customer_id
       FROM organizations o
       JOIN users u ON u.org_id = o.id
       WHERE u.clerk_user_id = $1`,
      [userId]
    );

    const customerId = result.rows[0]?.stripe_customer_id;
    if (!customerId) {
      return NextResponse.json(
        { error: "Kein aktives Abonnement vorhanden" },
        { status: 400 }
      );
    }

    const origin = req.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "";

    const session = await getStripe().billingPortal.sessions.create({
      customer: customerId,
      return_url: `${origin}/einstellungen/abo`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("[Billing Portal] Error:", error.message);
    return NextResponse.json(
      { error: "Interner Serverfehler" },
      { status: 500 }
    );
  }
}
