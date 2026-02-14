import Stripe from "stripe";

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not set");
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY);
}

export const stripe = new Proxy({} as Stripe, {
  get(_, prop) {
    return (getStripe() as any)[prop];
  },
});

export async function createCheckoutSession(
  orgId: string,
  priceId: string,
  email: string
) {
  return stripe.checkout.sessions.create({
    customer_email: email,
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/preise`,
    metadata: { orgId },
    subscription_data: { metadata: { orgId } },
    allow_promotion_codes: true,
  });
}

export async function createBillingPortalSession(customerId: string) {
  return stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/einstellungen/abo`,
  });
}

export function getPlanFromPriceId(priceId: string): string {
  const map: Record<string, string> = {
    [process.env.STRIPE_PRICE_BASIS_MONTHLY!]: "basis",
    [process.env.STRIPE_PRICE_PRO_MONTHLY!]: "pro",
    [process.env.STRIPE_PRICE_TEAM_MONTHLY!]: "team",
    [process.env.STRIPE_PRICE_BASIS_YEARLY!]: "basis",
    [process.env.STRIPE_PRICE_PRO_YEARLY!]: "pro",
    [process.env.STRIPE_PRICE_TEAM_YEARLY!]: "team",
  };
  return map[priceId] || "basis";
}
