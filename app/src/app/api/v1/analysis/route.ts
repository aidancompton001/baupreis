import { requireOrgFromApiKey } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";
import pool from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const org = await requireOrgFromApiKey(req.headers.get("authorization"));

    if (!checkRateLimit(`api:${org.id}`, 100, 60_000)) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Max 100 requests per minute." },
        { status: 429 }
      );
    }

    const { searchParams } = new URL(req.url);
    const material = searchParams.get("material");

    const conditions = ["1=1"];
    const params: any[] = [];
    let paramIdx = 1;

    if (material) {
      conditions.push(`m.code = $${paramIdx}`);
      params.push(material);
      paramIdx++;
    }

    const result = await pool.query(
      `SELECT DISTINCT ON (m.code)
         m.code, m.name_de, m.category, m.unit,
         a.trend, a.change_pct_7d, a.change_pct_30d,
         a.recommendation, a.confidence, a.explanation_de,
         a.forecast_json, a.timestamp
       FROM analysis a
       JOIN materials m ON a.material_id = m.id
       WHERE ${conditions.join(" AND ")}
       ORDER BY m.code, a.timestamp DESC`,
      params
    );

    return NextResponse.json({
      data: result.rows,
      meta: { count: result.rows.length, material: material || "all" },
    });
  } catch (error: any) {
    if (error.message === "Invalid API key") {
      return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
    }
    if (error.message === "API access not included in plan") {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
