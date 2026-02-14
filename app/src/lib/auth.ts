import pool from "./db";

const DEV_USER_ID = "dev_local_user";
const DEV_SLUG = "dev-local";

function isClerkConfigured(): boolean {
  const key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || "";
  return key.startsWith("pk_live_") || key.startsWith("pk_test_");
}

function getClerkUserId(): string | null {
  if (!isClerkConfigured()) {
    return DEV_USER_ID;
  }
  const { auth } = require("@clerk/nextjs/server");
  const { userId } = auth();
  return userId;
}

export async function getOrg() {
  const userId = getClerkUserId();
  if (!userId) return null;

  const result = await pool.query(
    `SELECT o.* FROM organizations o
     JOIN users u ON u.org_id = o.id
     WHERE u.clerk_user_id = $1 AND o.is_active = true`,
    [userId]
  );

  if (result.rows[0]) return result.rows[0];

  // Dev mode: auto-create org + user
  if (!isClerkConfigured()) {
    return await devAutoCreateOrg();
  }

  return null;
}

/** In dev mode, create org + user + org_materials automatically. */
async function devAutoCreateOrg() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Create org with Pro plan (all main features visible for demo)
    const orgResult = await client.query(
      `INSERT INTO organizations (name, slug, plan, max_materials, max_users, max_alerts,
        features_telegram, features_forecast, features_api, features_pdf_reports)
       VALUES ($1, $2, 'pro', 99, 1, 999, true, true, false, false)
       RETURNING *`,
      ["Dev User GmbH", DEV_SLUG]
    );
    const org = orgResult.rows[0];

    // Create user
    await client.query(
      `INSERT INTO users (org_id, clerk_user_id, email, name, role)
       VALUES ($1, $2, $3, $4, 'owner')`,
      [org.id, DEV_USER_ID, "dev@localhost", "Dev User"]
    );

    // Add all 16 materials to org
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
