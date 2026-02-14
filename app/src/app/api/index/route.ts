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

    return NextResponse.json(result.rows);
  } catch (error: any) {
    if (
      [
        "No organization found",
        "Trial expired",
        "Subscription cancelled",
      ].includes(error.message)
    ) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    return NextResponse.json(
      { error: "Interner Serverfehler" },
      { status: 500 }
    );
  }
}
