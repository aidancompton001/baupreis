import Stripe from "stripe";

let _stripe: Stripe | null = null;

/** Lazy-init Stripe to avoid crash at build time when env vars are missing */
export function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
      apiVersion: "2026-01-28.clover",
      typescript: true,
    });
  }
  return _stripe;
}

export { Stripe };

// Map Stripe Price IDs → plan names
const PRICE_TO_PLAN: Record<string, string> = {
  [process.env.NEXT_PUBLIC_STRIPE_PRICE_BASIS_MONTHLY || ""]: "basis",
  [process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY || ""]: "pro",
  [process.env.NEXT_PUBLIC_STRIPE_PRICE_TEAM_MONTHLY || ""]: "team",
  [process.env.NEXT_PUBLIC_STRIPE_PRICE_BASIS_YEARLY || ""]: "basis",
  [process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_YEARLY || ""]: "pro",
  [process.env.NEXT_PUBLIC_STRIPE_PRICE_TEAM_YEARLY || ""]: "team",
};

export function getPlanFromPriceId(priceId: string): string {
  return PRICE_TO_PLAN[priceId] || "basis";
}

/** Cancel a Stripe subscription */
export async function cancelSubscription(
  subscriptionId: string,
  immediately = false
): Promise<void> {
  const s = getStripe();
  if (immediately) {
    await s.subscriptions.cancel(subscriptionId);
  } else {
    await s.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    });
  }
}

/** Verify Stripe webhook signature and return the event */
export function constructWebhookEvent(
  rawBody: string,
  signature: string,
  secret: string
): Stripe.Event {
  return getStripe().webhooks.constructEvent(rawBody, signature, secret);
}
