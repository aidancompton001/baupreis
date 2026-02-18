import crypto from "crypto";

// Map Paddle Price IDs → plan names
const PRICE_TO_PLAN: Record<string, string> = {
  // Monthly
  [process.env.NEXT_PUBLIC_PADDLE_PRICE_BASIS_MONTHLY || ""]: "basis",
  [process.env.NEXT_PUBLIC_PADDLE_PRICE_PRO_MONTHLY || ""]: "pro",
  [process.env.NEXT_PUBLIC_PADDLE_PRICE_TEAM_MONTHLY || ""]: "team",
  // Yearly
  [process.env.NEXT_PUBLIC_PADDLE_PRICE_BASIS_YEARLY || ""]: "basis",
  [process.env.NEXT_PUBLIC_PADDLE_PRICE_PRO_YEARLY || ""]: "pro",
  [process.env.NEXT_PUBLIC_PADDLE_PRICE_TEAM_YEARLY || ""]: "team",
};

export function getPlanFromPriceId(priceId: string): string {
  return PRICE_TO_PLAN[priceId] || "basis";
}

/** Cancel a Paddle subscription via REST API */
export async function cancelSubscription(
  subscriptionId: string,
  effectiveFrom: "immediately" | "next_billing_period" = "next_billing_period"
): Promise<void> {
  const apiKey = process.env.PADDLE_API_KEY;
  if (!apiKey) throw new Error("PADDLE_API_KEY not set");

  const base =
    process.env.NEXT_PUBLIC_PADDLE_ENV === "sandbox"
      ? "https://sandbox-api.paddle.com"
      : "https://api.paddle.com";

  const res = await fetch(`${base}/subscriptions/${subscriptionId}/cancel`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ effective_from: effectiveFrom }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Paddle cancel failed: ${res.status} ${err}`);
  }
}

/** Verify Paddle webhook signature (HMAC-SHA256) */
export function verifyWebhookSignature(
  rawBody: string,
  signature: string,
  secret: string
): boolean {
  // Format: ts=xxx;h1=xxx
  const parts: Record<string, string> = {};
  for (const part of signature.split(";")) {
    const [key, val] = part.split("=");
    if (key && val) parts[key] = val;
  }

  const ts = parts["ts"];
  const h1 = parts["h1"];
  if (!ts || !h1) return false;

  const payload = `${ts}:${rawBody}`;
  const computed = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");

  return crypto.timingSafeEqual(Buffer.from(h1), Buffer.from(computed));
}
