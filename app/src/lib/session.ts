import { cookies } from "next/headers";
import * as crypto from "crypto";

const SESSION_COOKIE = "baupreis_session";
function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET || process.env.CRON_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET or CRON_SECRET environment variable is required");
  }
  return secret;
}

/**
 * Create a signed session token: base64(payload).base64(hmac)
 * Payload: { uid, oid, exp } — user id, org id, expiry timestamp
 */
export function createSessionToken(userId: string, orgId: string): string {
  const payload = JSON.stringify({
    uid: userId,
    oid: orgId,
    exp: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
  });
  const payloadB64 = Buffer.from(payload).toString("base64url");
  const hmac = crypto
    .createHmac("sha256", getSessionSecret())
    .update(payloadB64)
    .digest("base64url");
  return `${payloadB64}.${hmac}`;
}

/**
 * Verify a session token. Returns { uid, oid } or null.
 */
export function verifySessionToken(
  token: string
): { uid: string; oid: string } | null {
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [payloadB64, sig] = parts;

  const expected = crypto
    .createHmac("sha256", getSessionSecret())
    .update(payloadB64)
    .digest("base64url");

  if (sig !== expected) return null;

  try {
    const payload = JSON.parse(
      Buffer.from(payloadB64, "base64url").toString()
    );
    if (payload.exp && payload.exp < Date.now()) return null;
    if (!payload.uid || !payload.oid) return null;
    return { uid: payload.uid, oid: payload.oid };
  } catch {
    return null;
  }
}

/**
 * Read session from cookies (server components / route handlers).
 */
export function getSession(): { uid: string; oid: string } | null {
  const cookieStore = cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

/**
 * Read session token from a raw cookie header (for middleware / edge).
 */
export function getSessionFromCookieHeader(
  cookieHeader: string | null
): { uid: string; oid: string } | null {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(
    new RegExp(`(?:^|;\\s*)${SESSION_COOKIE}=([^;]+)`)
  );
  if (!match) return null;
  return verifySessionToken(match[1]);
}

export { SESSION_COOKIE };
