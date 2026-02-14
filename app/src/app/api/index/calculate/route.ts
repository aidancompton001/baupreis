import { calculateBaupreisIndex } from "@/lib/baupreis-index";
import pool from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST — trigger BauPreis Index calculation.
 * Called by system crontab. Protected by shared secret.
 */
export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const secret = process.env.INDEX_CALCULATION_SECRET;

    if (!secret || authHeader !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const date =
      typeof body.date === "string"
        ? body.date
        : new Date().toISOString().slice(0, 10);

    const result = await calculateBaupreisIndex(date);

    // Upsert into baupreis_index
    await pool.query(
      `INSERT INTO baupreis_index (date, index_value, change_pct_1d, change_pct_7d, change_pct_30d, components_json)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (date) DO UPDATE SET
         index_value = $2,
         change_pct_1d = $3,
         change_pct_7d = $4,
         change_pct_30d = $5,
         components_json = $6`,
      [
        date,
        result.index_value,
        result.change_pct_1d,
        result.change_pct_7d,
        result.change_pct_30d,
        JSON.stringify(result.components_json),
      ]
    );

    return NextResponse.json({
      ok: true,
      date,
      index_value: result.index_value,
      change_pct_30d: result.change_pct_30d,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Calculation failed" },
      { status: 500 }
    );
  }
}
