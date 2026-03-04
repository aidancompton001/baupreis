import { requireOrg } from "@/lib/auth";
import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const org = await requireOrg();

    const result = await pool.query(
      `SELECT id, org_id, report_type, period_start, period_end,
              content_html, content_json, created_at
       FROM reports
       WHERE org_id = $1
       ORDER BY created_at DESC
       LIMIT 50`,
      [org.id]
    );

    return NextResponse.json(result.rows);
  } catch (error: unknown) {
    if (error instanceof Error && ["No organization found", "Trial expired", "Subscription cancelled"].includes(error.message)) {
      return NextResponse.json({ error: error instanceof Error ? error.message : "Interner Serverfehler" }, { status: 403 });
    }
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 });
  }
}
