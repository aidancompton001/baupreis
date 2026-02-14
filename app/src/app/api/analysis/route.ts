import { requireOrg, canAccess } from "@/lib/auth";
import pool from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const org = await requireOrg();
    const material = req.nextUrl.searchParams.get("material");

    const params: any[] = [];
    let paramIdx = 1;

    let materialCondition = "";
    if (material) {
      materialCondition = `AND m.code = $${paramIdx}`;
      params.push(material);
      paramIdx++;
    }

    // Basis/Trial: only show analysis for org's selected materials
    let orgFilter = "";
    if (org.plan === "basis" || org.plan === "trial") {
      orgFilter = `AND m.id IN (SELECT material_id FROM org_materials WHERE org_id = $${paramIdx})`;
      params.push(org.id);
      paramIdx++;
    }

    let query: string;
    if (material) {
      query = `
        SELECT a.*, m.name_de, m.code, m.unit
        FROM analysis a
        JOIN materials m ON a.material_id = m.id
        WHERE 1=1 ${materialCondition} ${orgFilter}
        ORDER BY a.timestamp DESC
        LIMIT 1
      `;
    } else {
      query = `
        SELECT DISTINCT ON (a.material_id) a.*, m.name_de, m.code, m.unit
        FROM analysis a
        JOIN materials m ON a.material_id = m.id
        WHERE 1=1 ${materialCondition} ${orgFilter}
        ORDER BY a.material_id, a.timestamp DESC
      `;
    }

    const result = await pool.query(query, params);

    const hasForecast = canAccess(org, "forecast");
    const rows = result.rows.map((row: any) => ({
      ...row,
      forecast_json: hasForecast ? row.forecast_json : null,
    }));

    return NextResponse.json(rows);
  } catch (error: any) {
    if (error.message === "No organization found" || error.message === "Trial expired" || error.message === "Subscription cancelled") {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 });
  }
}
