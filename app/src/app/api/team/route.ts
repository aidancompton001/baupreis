import { requireOrgWithRole } from "@/lib/auth";
import pool from "@/lib/db";
import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";

/** GET — list team members + pending invites. */
export async function GET() {
  try {
    const { org } = await requireOrgWithRole(["owner", "admin", "member"]);

    const members = await pool.query(
      `SELECT id, email, name, role, is_active, created_at
       FROM users
       WHERE org_id = $1
       ORDER BY created_at ASC`,
      [org.id]
    );

    const invites = await pool.query(
      `SELECT id, email, role, status, expires_at, created_at
       FROM invites
       WHERE org_id = $1 AND status = 'pending' AND expires_at > NOW()
       ORDER BY created_at DESC`,
      [org.id]
    );

    return NextResponse.json({
      members: members.rows,
      invites: invites.rows,
      max_users: org.max_users,
    });
  } catch (error: any) {
    if (error.message === "Insufficient permissions") {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    if (["No organization found", "Trial expired", "Subscription cancelled"].includes(error.message)) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 });
  }
}

/** POST — create an invite. Only owner/admin. */
export async function POST(req: NextRequest) {
  try {
    const { org } = await requireOrgWithRole(["owner", "admin"]);

    const body = await req.json();
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const role = body.role === "admin" ? "admin" : "member";

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Gültige E-Mail-Adresse erforderlich." },
        { status: 400 }
      );
    }

    // Check max_users limit (members + pending invites)
    const countResult = await pool.query(
      `SELECT
        (SELECT COUNT(*) FROM users WHERE org_id = $1 AND is_active = true) +
        (SELECT COUNT(*) FROM invites WHERE org_id = $1 AND status = 'pending' AND expires_at > NOW())
        AS total`,
      [org.id]
    );
    if (parseInt(countResult.rows[0].total) >= org.max_users) {
      return NextResponse.json(
        { error: `Maximale Teamgröße erreicht (${org.max_users} Nutzer).` },
        { status: 400 }
      );
    }

    // Check if email already exists in org
    const existingUser = await pool.query(
      `SELECT id FROM users WHERE org_id = $1 AND email = $2 AND is_active = true`,
      [org.id, email]
    );
    if (existingUser.rows.length > 0) {
      return NextResponse.json(
        { error: "Diese E-Mail ist bereits Mitglied." },
        { status: 400 }
      );
    }

    // Check for existing pending invite
    const existingInvite = await pool.query(
      `SELECT id FROM invites WHERE org_id = $1 AND email = $2 AND status = 'pending' AND expires_at > NOW()`,
      [org.id, email]
    );
    if (existingInvite.rows.length > 0) {
      return NextResponse.json(
        { error: "Eine Einladung für diese E-Mail existiert bereits." },
        { status: 400 }
      );
    }

    const token = crypto.randomBytes(32).toString("hex");

    await pool.query(
      `INSERT INTO invites (org_id, email, role, token, invited_by)
       VALUES ($1, $2, $3, $4, (SELECT id FROM users WHERE org_id = $1 AND is_active = true LIMIT 1))`,
      [org.id, email, role, token]
    );

    // In production, send email with invite link. For now, return token.
    const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL || ""}/sign-up?invite=${token}`;

    return NextResponse.json({ ok: true, inviteUrl }, { status: 201 });
  } catch (error: any) {
    if (error.message === "Insufficient permissions") {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    if (["No organization found", "Trial expired", "Subscription cancelled"].includes(error.message)) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 });
  }
}
