import pool from "./db";
import { getSession } from "./session";

function getSessionUserId(): string | null {
  const session = getSession();
  return session ? session.uid : null;
}

export async function getOrg() {
  const session = getSession();
  if (!session) return null;

  const result = await pool.query(
    `SELECT o.* FROM organizations o
     WHERE o.id = $1 AND o.is_active = true`,
    [session.oid]
  );
  return result.rows[0] || null;
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

/** Get the current user row (with role) from session. */
export async function getUser() {
  const userId = getSessionUserId();
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
