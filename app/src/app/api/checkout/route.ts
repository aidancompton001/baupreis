import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

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

    const body = await req.json();
    const { priceId, orgId, email } = body;

    if (!priceId || !orgId) {
      return NextResponse.json(
        { error: "Preis-ID und Org-ID erforderlich" },
        { status: 400 }
      );
    }

    const origin = req.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "";

    const sessionParams: any = {
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

    const session = await getStripe().checkout.sessions.create(sessionParams);

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("[Checkout] Error:", error.message);
    return NextResponse.json(
      { error: "Fehler beim Erstellen der Checkout-Sitzung" },
      { status: 500 }
    );
  }
}
