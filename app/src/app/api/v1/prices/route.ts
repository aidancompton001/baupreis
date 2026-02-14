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
    const days = Math.min(parseInt(searchParams.get("days") || "30"), 365);
    const limit = Math.min(parseInt(searchParams.get("limit") || "100"), 1000);

    const conditions = ["p.timestamp > NOW() - ($1 || ' days')::INTERVAL"];
    const params: any[] = [days];
    let paramIdx = 2;

    if (material) {
      conditions.push(`m.code = $${paramIdx}`);
      params.push(material);
      paramIdx++;
    }

    params.push(limit);

    const result = await pool.query(
      `SELECT m.code, m.name_de, m.category, m.unit,
              p.price_eur, p.price_usd, p.source, p.timestamp
       FROM prices p
       JOIN materials m ON p.material_id = m.id
       WHERE ${conditions.join(" AND ")}
       ORDER BY p.timestamp DESC
       LIMIT $${paramIdx}`,
      params
    );

    return NextResponse.json({
      data: result.rows,
      meta: { count: result.rows.length, days, material: material || "all" },
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
