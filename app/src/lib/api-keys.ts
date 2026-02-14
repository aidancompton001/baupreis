import crypto from "crypto";
import pool from "./db";

const PREFIX = "bp_live_";

/** Generate a new API key. Returns { raw, hash, prefix }. */
export function generateApiKey(): {
  raw: string;
  hash: string;
  prefix: string;
} {
  const bytes = crypto.randomBytes(32);
  const raw = PREFIX + bytes.toString("hex");
  const hash = hashApiKey(raw);
  const prefix = raw.slice(0, PREFIX.length + 8) + "...";
  return { raw, hash, prefix };
}

/** SHA-256 hash of a raw API key. */
export function hashApiKey(rawKey: string): string {
  return crypto.createHash("sha256").update(rawKey).digest("hex");
}

/**
 * Verify an API key from Authorization header.
 * Returns the organization row if valid, null otherwise.
 */
export async function verifyApiKey(
  authHeader: string | null
): Promise<any | null> {
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;

  const rawKey = authHeader.slice(7);
  if (!rawKey.startsWith(PREFIX)) return null;

  const hash = hashApiKey(rawKey);

  const result = await pool.query(
    `SELECT o.* FROM api_keys ak
     JOIN organizations o ON ak.org_id = o.id
     WHERE ak.key_hash = $1
       AND ak.is_active = true
       AND o.is_active = true
       AND (ak.expires_at IS NULL OR ak.expires_at > NOW())`,
    [hash]
  );

  if (result.rows.length === 0) return null;

  // Update last_used_at
  await pool.query(
    `UPDATE api_keys SET last_used_at = NOW() WHERE key_hash = $1`,
    [hash]
  );

  return result.rows[0];
}
