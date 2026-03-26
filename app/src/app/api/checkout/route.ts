import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getSession } from "@/lib/session";

export async function POST(req: NextRequest) {
  try {
    const session = getSession();
    if (!session) {
      return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
    }

    const body = await req.json();
    const { priceId, orgId, email } = body;

    if (!priceId || !orgId) {
      return NextResponse.json(
        { error: "Preis-ID und Org-ID erforderlich" },
        { status: 400 }
      );
    }

    const origin = req.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "";

    const sessionParams: Record<string, unknown> = {
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/einstellungen/abo?success=1`,
      cancel_url: `${origin}/einstellungen/abo`,
      metadata: { orgId },
      subscription_data: { metadata: { orgId } },
    };

    if (email) {
      sessionParams.customer_email = email;
    }

    const checkoutSession = await getStripe().checkout.sessions.create(sessionParams);

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error: unknown) {
    console.error("[Checkout] Error:", error instanceof Error ? error.message : String(error));
    return NextResponse.json(
      { error: "Fehler beim Erstellen der Checkout-Sitzung" },
      { status: 500 }
    );
  }
}
