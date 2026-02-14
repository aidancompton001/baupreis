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
  } catch (error: any) {
    if (error.message === "No organization found" || error.message === "Trial expired" || error.message === "Subscription cancelled") {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 });
  }
}
