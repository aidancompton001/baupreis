import { requireOrg } from "@/lib/auth";
import pool from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/notifications
 * Returns last 20 notifications for the org, newest first.
 */
export async function GET() {
  try {
    const org = await requireOrg();

    const result = await pool.query(
      `SELECT id, org_id, type, title, message, link, read_at, created_at
       FROM notifications
       WHERE org_id = $1
       ORDER BY created_at DESC
       LIMIT 20`,
      [org.id]
    );

    return NextResponse.json(result.rows);
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "No organization found") {
      return NextResponse.json([], { status: 401 });
    }
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 });
  }
}

/**
 * POST /api/notifications
 * Mark notifications as read.
 * Body: { id: "uuid" } — mark single
 * Body: { all: true } — mark all as read
 */
export async function POST(req: NextRequest) {
  try {
    const org = await requireOrg();
    const body = await req.json();

    if (body.all === true) {
      const result = await pool.query(
        "UPDATE notifications SET read_at = NOW() WHERE org_id = $1 AND read_at IS NULL",
        [org.id]
      );
      return NextResponse.json({ ok: true, marked: result.rowCount });
    }

    if (body.id) {
      const result = await pool.query(
        "UPDATE notifications SET read_at = NOW() WHERE id = $1 AND org_id = $2 AND read_at IS NULL",
        [body.id, org.id]
      );
      return NextResponse.json({ ok: true, marked: result.rowCount });
    }

    return NextResponse.json({ error: "id or all required" }, { status: 400 });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "No organization found") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 });
  }
}
