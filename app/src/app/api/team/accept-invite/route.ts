import pool from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

const DEV_USER_ID = "dev_local_user";

function isClerkConfigured(): boolean {
  const key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || "";
  return key.startsWith("pk_live_") || key.startsWith("pk_test_");
}

function getClerkUserId(): string | null {
  if (!isClerkConfigured()) return DEV_USER_ID;
  const { auth } = require("@clerk/nextjs/server");
  const { userId } = auth();
  return userId;
}

/**
 * POST — accept a team invite.
 * Flow: User signs up → Clerk webhook creates auto-org → user calls this endpoint
 * → user is moved to invite org, auto-org is deactivated.
 */
export async function POST(req: NextRequest) {
  try {
    const userId = getClerkUserId();
    if (!userId) {
      return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 });
    }

    const body = await req.json();
    const token = typeof body.token === "string" ? body.token.trim() : "";

    if (!token) {
      return NextResponse.json(
        { error: "Einladungs-Token fehlt." },
        { status: 400 }
      );
    }

    // Find pending invite
    const inviteResult = await pool.query(
      `SELECT i.*, o.name as org_name
       FROM invites i
       JOIN organizations o ON i.org_id = o.id
       WHERE i.token = $1 AND i.status = 'pending' AND i.expires_at > NOW()`,
      [token]
    );

    if (inviteResult.rows.length === 0) {
      return NextResponse.json(
        { error: "Einladung ungültig oder abgelaufen." },
        { status: 400 }
      );
    }

    const invite = inviteResult.rows[0];

    // Find current user
    const userResult = await pool.query(
      `SELECT u.*, o.id as auto_org_id
       FROM users u
       JOIN organizations o ON u.org_id = o.id
       WHERE u.clerk_user_id = $1 AND u.is_active = true`,
      [userId]
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { error: "Benutzer nicht gefunden." },
        { status: 400 }
      );
    }

    const user = userResult.rows[0];
    const autoOrgId = user.auto_org_id;

    // Move user to invite's org
    await pool.query(
      `UPDATE users SET org_id = $1, role = $2 WHERE id = $3`,
      [invite.org_id, invite.role, user.id]
    );

    // Mark invite as accepted
    await pool.query(
      `UPDATE invites SET status = 'accepted' WHERE id = $1`,
      [invite.id]
    );

    // Deactivate the auto-created org (only if no other users remain)
    if (autoOrgId !== invite.org_id) {
      const otherUsers = await pool.query(
        `SELECT COUNT(*) FROM users WHERE org_id = $1 AND is_active = true`,
        [autoOrgId]
      );
      if (parseInt(otherUsers.rows[0].count) === 0) {
        await pool.query(
          `UPDATE organizations SET is_active = false WHERE id = $1`,
          [autoOrgId]
        );
      }
    }

    return NextResponse.json({
      ok: true,
      org_name: invite.org_name,
    });
  } catch {
    return NextResponse.json(
      { error: "Interner Serverfehler" },
      { status: 500 }
    );
  }
}
