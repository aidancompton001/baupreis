import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import pool from "@/lib/db";
import { getSession } from "@/lib/session";

export async function POST(req: NextRequest) {
  try {
    const session = getSession();
    if (!session) {
      return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
    }

    const result = await pool.query(
      `SELECT o.stripe_customer_id
       FROM organizations o
       WHERE o.id = $1`,
      [session.oid]
    );

    const customerId = result.rows[0]?.stripe_customer_id;
    if (!customerId) {
      return NextResponse.json(
        { error: "Kein aktives Abonnement vorhanden" },
        { status: 400 }
      );
    }

    const origin = req.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "";

    const portalSession = await getStripe().billingPortal.sessions.create({
      customer: customerId,
      return_url: `${origin}/einstellungen/abo`,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (error: unknown) {
    console.error("[Billing Portal] Error:", error instanceof Error ? error.message : String(error));
    return NextResponse.json(
      { error: "Interner Serverfehler" },
      { status: 500 }
    );
  }
}
