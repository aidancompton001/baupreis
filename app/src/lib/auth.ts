import pool from "./db";
import { getSession } from "./session";

export function isClerkConfigured(): boolean {
  const key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || "";
  return key.startsWith("pk_live_") || key.startsWith("pk_test_");
}

function getClerkUserId(): string | null {
  // 1. Try local session cookie first (email-based auth)
  const session = getSession();
  if (session) return session.uid;

  // 2. Try Clerk if configured
  if (isClerkConfigured()) {
    const { auth } = require("@clerk/nextjs/server");
    const { userId } = auth();
    return userId;
  }

  // 3. No auth — return null (will redirect to sign-in)
  return null;
}

export async function getOrg() {
  // Try local session first — it has org_id directly
  const session = getSession();
  if (session) {
    const result = await pool.query(
      `SELECT o.* FROM organizations o
       WHERE o.id = $1 AND o.is_active = true`,
      [session.oid]
    );
    if (result.rows[0]) return result.rows[0];
  }

  const userId = getClerkUserId();
  if (!userId) return null;

  const result = await pool.query(
    `SELECT o.* FROM organizations o
     JOIN users u ON u.org_id = o.id
     WHERE u.clerk_user_id = $1 AND o.is_active = true`,
    [userId]
  );

  if (result.rows[0]) return result.rows[0];

  // Clerk mode: auto-create org for authenticated user (no webhook needed)
  if (isClerkConfigured()) {
    return await autoCreateOrgForClerkUser(userId);
  }

  return null;
}

/** Auto-create org for a Clerk-authenticated user on first access. */
async function autoCreateOrgForClerkUser(clerkUserId: string) {
  let email = "user@baupreis.ai";
  let name = "BauPreis User";

  // Try to get user info from Clerk Backend API
  try {
    const { clerkClient } = require("@clerk/nextjs/server");
    const client = clerkClient();
    const user = await client.users.getUser(clerkUserId);
    if (user) {
      email = user.emailAddresses?.[0]?.emailAddress || email;
      name = [user.firstName, user.lastName].filter(Boolean).join(" ") || name;
    }
  } catch {
    // Clerk API might fail, use defaults
  }

  const slug = "org-" + clerkUserId.slice(-8);
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Race condition guard
    const check = await client.query(
      `SELECT o.* FROM organizations o JOIN users u ON u.org_id = o.id
       WHERE u.clerk_user_id = $1 AND o.is_active = true`,
      [clerkUserId]
    );
    if (check.rows[0]) {
      await client.query("COMMIT");
      return check.rows[0];
    }

    // Create org with Trial plan (7 days, full access)
    const orgResult = await client.query(
      `INSERT INTO organizations (name, slug, plan, trial_ends_at,
        max_materials, max_users, max_alerts,
        features_telegram, features_forecast, features_api, features_pdf_reports)
       VALUES ($1, $2, 'trial', NOW() + INTERVAL '7 days',
        99, 5, 999, true, true, true, true)
       RETURNING *`,
      [name, slug]
    );
    const org = orgResult.rows[0];

    // Create user
    await client.query(
      `INSERT INTO users (org_id, clerk_user_id, email, name, role)
       VALUES ($1, $2, $3, $4, 'owner')`,
      [org.id, clerkUserId, email, name]
    );

    // Add all materials (Trial = full access)
    await client.query(
      `INSERT INTO org_materials (org_id, material_id)
       SELECT $1, id FROM materials WHERE is_active = true`,
      [org.id]
    );

    await client.query("COMMIT");
    return org;
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
}

export async function requireOrg() {
  const org = await getOrg();
  if (!org) throw new Error("No organization found");

  if (org.plan === "trial" && new Date(org.trial_ends_at) < new Date()) {
    throw new Error("Trial expired");
  }
  if (org.plan === "cancelled") {
    throw new Error("Subscription cancelled");
  }

  return org;
}

export function canAccess(org: any, feature: string): boolean {
  const featureMap: Record<string, string> = {
    telegram: "features_telegram",
    forecast: "features_forecast",
    api: "features_api",
    pdf_reports: "features_pdf_reports",
  };
  return org[featureMap[feature]] === true;
}

/** Authenticate via Bearer API key (for /api/v1/* endpoints). */
export async function requireOrgFromApiKey(
  authHeader: string | null
): Promise<any> {
  const { verifyApiKey } = await import("./api-keys");
  const org = await verifyApiKey(authHeader);
  if (!org) throw new Error("Invalid API key");
  if (!canAccess(org, "api")) throw new Error("API access not included in plan");
  return org;
}

/** Get the current user row (with role) from Clerk session. */
export async function getUser() {
  const userId = getClerkUserId();
  if (!userId) return null;

  const result = await pool.query(
    `SELECT u.*, o.name as org_name FROM users u
     JOIN organizations o ON u.org_id = o.id
     WHERE u.clerk_user_id = $1 AND u.is_active = true`,
    [userId]
  );

  return result.rows[0] || null;
}

/** Require org + verify user has one of the allowed roles. */
export async function requireOrgWithRole(allowedRoles: string[]) {
  const org = await requireOrg();
  const user = await getUser();
  if (!user || !allowedRoles.includes(user.role)) {
    throw new Error("Insufficient permissions");
  }
  return { org, user };
}
