import { requireOrg } from "@/lib/auth";
import pool from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const org = await requireOrg();
    const dateStr = req.nextUrl.searchParams.get("date");
    const materialsStr = req.nextUrl.searchParams.get("materials");

    if (!dateStr) {
      return NextResponse.json(
        { error: "Parameter 'date' fehlt (YYYY-MM-DD)" },
        { status: 400 }
      );
    }

    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dateStr)) {
      return NextResponse.json(
        { error: "Ungültiges Datumsformat. Erwartet: YYYY-MM-DD" },
        { status: 400 }
      );
    }

    const targetDate = new Date(dateStr);
    if (isNaN(targetDate.getTime())) {
      return NextResponse.json(
        { error: "Ungültiges Datum" },
        { status: 400 }
      );
    }

    const params: any[] = [dateStr];
    let paramIdx = 2;

    let materialFilter = "";
    if (materialsStr) {
      const codes = materialsStr
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean);
      if (codes.length > 0) {
        const placeholders = codes.map((_, i) => `$${paramIdx + i}`);
        materialFilter = `AND m.code IN (${placeholders.join(",")})`;
        params.push(...codes);
        paramIdx += codes.length;
      }
    }

    let orgFilter = "";
    if (org.plan === "basis" || org.plan === "trial") {
      orgFilter = `AND m.id IN (SELECT material_id FROM org_materials WHERE org_id = $${paramIdx})`;
      params.push(org.id);
      paramIdx++;
    }

    // Find closest price within ±7 days of the target date
    const query = `
      SELECT DISTINCT ON (m.code)
        m.code, m.name_de, m.unit,
        p.price_eur, p.timestamp,
        ABS(EXTRACT(EPOCH FROM (p.timestamp - $1::timestamptz))) as distance_seconds
      FROM prices p
      JOIN materials m ON p.material_id = m.id
      WHERE p.timestamp BETWEEN ($1::date - INTERVAL '7 days') AND ($1::date + INTERVAL '7 days')
        ${materialFilter}
        ${orgFilter}
      ORDER BY m.code, distance_seconds ASC
    `;

    const result = await pool.query(query, params);

    return NextResponse.json(result.rows);
  } catch (error: any) {
    if (
      error.message === "No organization found" ||
      error.message === "Trial expired" ||
      error.message === "Subscription cancelled"
    ) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    return NextResponse.json(
      { error: "Interner Serverfehler" },
      { status: 500 }
    );
  }
}
