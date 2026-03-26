import { requireOrg } from "@/lib/auth";
import pool from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

/** GET — BauPreis Index history. */
export async function GET(req: NextRequest) {
  try {
    await requireOrg();

    const { searchParams } = new URL(req.url);
    const days = Math.min(parseInt(searchParams.get("days") || "30"), 365);

    const result = await pool.query(
      `SELECT date, index_value, change_pct_1d, change_pct_7d, change_pct_30d,
              components_json
       FROM baupreis_index
       WHERE date > CURRENT_DATE - ($1 || ' days')::INTERVAL
       ORDER BY date DESC`,
      [days]
    );

    const rows = result.rows.map((row: Record<string, unknown>) => ({
      ...row,
      index_value: row.index_value != null ? Number(row.index_value) : null,
      change_pct_1d: row.change_pct_1d != null ? Number(row.change_pct_1d) : null,
      change_pct_7d: row.change_pct_7d != null ? Number(row.change_pct_7d) : null,
      change_pct_30d: row.change_pct_30d != null ? Number(row.change_pct_30d) : null,
    }));

    return NextResponse.json(rows);
  } catch (error: unknown) {
    if (error instanceof Error && ["No organization found", "Trial expired", "Subscription cancelled"].includes(error.message)) {
      return NextResponse.json({ error: error instanceof Error ? error.message : "Interner Serverfehler" }, { status: 403 });
    }
    return NextResponse.json(
      { error: "Interner Serverfehler" },
      { status: 500 }
    );
  }
}
