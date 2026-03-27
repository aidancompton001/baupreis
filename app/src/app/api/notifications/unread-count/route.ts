import { getOrg } from "@/lib/auth";
import pool from "@/lib/db";
import { NextResponse } from "next/server";

/**
 * GET /api/notifications/unread-count
 * Lightweight endpoint for polling (60s interval).
 * Returns { count: N } with Cache-Control for reduced DB load.
 */
export async function GET() {
  try {
    const org = await getOrg();
    if (!org) {
      return NextResponse.json({ count: 0 });
    }

    const result = await pool.query(
      "SELECT COUNT(*)::int AS count FROM notifications WHERE org_id = $1 AND read_at IS NULL",
      [org.id]
    );

    const response = NextResponse.json({ count: result.rows[0]?.count ?? 0 });
    response.headers.set("Cache-Control", "private, max-age=30");
    return response;
  } catch {
    return NextResponse.json({ count: 0 });
  }
}
