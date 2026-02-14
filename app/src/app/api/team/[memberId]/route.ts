import { requireOrgWithRole } from "@/lib/auth";
import pool from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

/** PATCH — update member role. Owner/admin only. */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { memberId: string } }
) {
  try {
    const { org, user } = await requireOrgWithRole(["owner", "admin"]);
    const { memberId } = params;

    const body = await req.json();
    const newRole = body.role;

    if (!["admin", "member"].includes(newRole)) {
      return NextResponse.json(
        { error: "Ungültige Rolle. Erlaubt: admin, member." },
        { status: 400 }
      );
    }

    // Cannot change own role
    if (memberId === user.id) {
      return NextResponse.json(
        { error: "Sie können Ihre eigene Rolle nicht ändern." },
        { status: 400 }
      );
    }

    // Cannot change owner role
    const target = await pool.query(
      `SELECT role FROM users WHERE id = $1 AND org_id = $2`,
      [memberId, org.id]
    );
    if (target.rows.length === 0) {
      return NextResponse.json(
        { error: "Mitglied nicht gefunden." },
        { status: 404 }
      );
    }
    if (target.rows[0].role === "owner") {
      return NextResponse.json(
        { error: "Die Owner-Rolle kann nicht geändert werden." },
        { status: 400 }
      );
    }

    await pool.query(
      `UPDATE users SET role = $1 WHERE id = $2 AND org_id = $3`,
      [newRole, memberId, org.id]
    );

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    if (error.message === "Insufficient permissions") {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    return NextResponse.json(
      { error: "Interner Serverfehler" },
      { status: 500 }
    );
  }
}

/** DELETE — remove member from team. Owner/admin only. */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { memberId: string } }
) {
  try {
    const { org, user } = await requireOrgWithRole(["owner", "admin"]);
    const { memberId } = params;

    // Cannot remove self
    if (memberId === user.id) {
      return NextResponse.json(
        { error: "Sie können sich nicht selbst entfernen." },
        { status: 400 }
      );
    }

    // Cannot remove owner
    const target = await pool.query(
      `SELECT role FROM users WHERE id = $1 AND org_id = $2`,
      [memberId, org.id]
    );
    if (target.rows.length === 0) {
      return NextResponse.json(
        { error: "Mitglied nicht gefunden." },
        { status: 404 }
      );
    }
    if (target.rows[0].role === "owner") {
      return NextResponse.json(
        { error: "Der Owner kann nicht entfernt werden." },
        { status: 400 }
      );
    }

    await pool.query(
      `UPDATE users SET is_active = false WHERE id = $1 AND org_id = $2`,
      [memberId, org.id]
    );

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    if (error.message === "Insufficient permissions") {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    return NextResponse.json(
      { error: "Interner Serverfehler" },
      { status: 500 }
    );
  }
}
