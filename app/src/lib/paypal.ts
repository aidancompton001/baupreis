const PAYPAL_BASE =
  process.env.PAYPAL_MODE === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

// OAuth2 access token (cached for 8 hours)
let cachedToken: { token: string; expiresAt: number } | null = null;

export async function getAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.token;
  }

  const clientId = process.env.PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_CLIENT_SECRET;
  if (!clientId || !secret) {
    throw new Error("PAYPAL_CLIENT_ID or PAYPAL_CLIENT_SECRET not set");
  }

  const res = await fetch(`${PAYPAL_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${secret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!res.ok) {
    throw new Error(`PayPal auth failed: ${res.status}`);
  }

  const data = await res.json();
  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + (data.expires_in - 60) * 1000,
  };
  return data.access_token;
}

/** Create subscription via REST API (server-side, redirect flow) */
export async function createSubscription(
  planId: string,
  orgId: string,
  email: string
): Promise<{ subscriptionId: string; approveUrl: string }> {
  const token = await getAccessToken();

  const res = await fetch(`${PAYPAL_BASE}/v1/billing/subscriptions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify({
      plan_id: planId,
      subscriber: { email_address: email },
      custom_id: orgId,
      application_context: {
        brand_name: "BauPreis AI",
        locale: "de-DE",
        user_action: "SUBSCRIBE_NOW",
        return_url: `${process.env.NEXT_PUBLIC_APP_URL}/einstellungen/abo?success=1`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/einstellungen/abo`,
      },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`PayPal create subscription failed: ${res.status} ${err}`);
  }

  const data = await res.json();
  const approveLink = data.links?.find(
    (l: { rel: string; href: string }) => l.rel === "approve"
  );

  return {
    subscriptionId: data.id,
    approveUrl: approveLink?.href || "",
  };
}

// Get subscription details
export async function getSubscriptionDetails(subscriptionId: string) {
  const token = await getAccessToken();

  const res = await fetch(
    `${PAYPAL_BASE}/v1/billing/subscriptions/${subscriptionId}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  if (!res.ok) {
    throw new Error(`PayPal get subscription failed: ${res.status}`);
  }

  return res.json();
}

// Cancel subscription
export async function cancelSubscription(
  subscriptionId: string,
  reason: string
) {
  const token = await getAccessToken();

  const res = await fetch(
    `${PAYPAL_BASE}/v1/billing/subscriptions/${subscriptionId}/cancel`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ reason }),
    }
  );

  if (!res.ok) {
    throw new Error(`PayPal cancel subscription failed: ${res.status}`);
  }
}

// Verify webhook signature
export async function verifyWebhookSignature(
  headers: Record<string, string>,
  body: string
): Promise<boolean> {
  const webhookId = process.env.PAYPAL_WEBHOOK_ID;
  if (!webhookId) return false;

  const token = await getAccessToken();

  const res = await fetch(
    `${PAYPAL_BASE}/v1/notifications/verify-webhook-signature`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        auth_algo: headers["paypal-auth-algo"],
        cert_url: headers["paypal-cert-url"],
        transmission_id: headers["paypal-transmission-id"],
        transmission_sig: headers["paypal-transmission-sig"],
        transmission_time: headers["paypal-transmission-time"],
        webhook_id: webhookId,
        webhook_event: JSON.parse(body),
      }),
    }
  );

  if (!res.ok) return false;
  const data = await res.json();
  return data.verification_status === "SUCCESS";
}

// Map PayPal Plan ID → plan name
export function getPlanFromPlanId(planId: string): string {
  const map: Record<string, string> = {};
  if (process.env.PAYPAL_PLAN_BASIS_MONTHLY)
    map[process.env.PAYPAL_PLAN_BASIS_MONTHLY] = "basis";
  if (process.env.PAYPAL_PLAN_PRO_MONTHLY)
    map[process.env.PAYPAL_PLAN_PRO_MONTHLY] = "pro";
  if (process.env.PAYPAL_PLAN_TEAM_MONTHLY)
    map[process.env.PAYPAL_PLAN_TEAM_MONTHLY] = "team";
  if (process.env.PAYPAL_PLAN_BASIS_YEARLY)
    map[process.env.PAYPAL_PLAN_BASIS_YEARLY] = "basis";
  if (process.env.PAYPAL_PLAN_PRO_YEARLY)
    map[process.env.PAYPAL_PLAN_PRO_YEARLY] = "pro";
  if (process.env.PAYPAL_PLAN_TEAM_YEARLY)
    map[process.env.PAYPAL_PLAN_TEAM_YEARLY] = "team";
  return map[planId] || "basis";
}
