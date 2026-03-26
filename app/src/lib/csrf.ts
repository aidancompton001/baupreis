import crypto from "crypto";

const CSRF_SECRET =
  process.env.CSRF_SECRET || process.env.SESSION_SECRET || "baupreis-csrf-default";
const TOKEN_TTL = 3600_000; // 1 hour

export function generateCsrfToken(sessionId: string, now = Date.now()): string {
  const timestamp = now.toString(36);
  const payload = `${sessionId}:${timestamp}`;
  const hmac = crypto
    .createHmac("sha256", CSRF_SECRET)
    .update(payload)
    .digest("hex")
    .slice(0, 16);
  return `${timestamp}.${hmac}`;
}

export function validateCsrfToken(token: string, sessionId: string): boolean {
  if (!token || !sessionId) return false;
  const [timestamp, hmac] = token.split(".");
  if (!timestamp || !hmac) return false;

  const ts = parseInt(timestamp, 36);
  if (isNaN(ts) || Date.now() - ts > TOKEN_TTL) return false;

  const expected = generateCsrfToken(sessionId, ts);
  const [, expectedHmac] = expected.split(".");
  if (!expectedHmac || expectedHmac.length !== hmac.length) return false;

  return crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(expectedHmac));
}
