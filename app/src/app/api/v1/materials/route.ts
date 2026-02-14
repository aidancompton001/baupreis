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
    const category = searchParams.get("category");

    const conditions = ["m.is_active = true"];
    const params: any[] = [];
    let paramIdx = 1;

    if (category) {
      conditions.push(`m.category = $${paramIdx}`);
      params.push(category);
      paramIdx++;
    }

    const result = await pool.query(
      `SELECT m.code, m.name_de, m.category, m.unit,
              m.lme_symbol, m.destatis_code
       FROM materials m
       WHERE ${conditions.join(" AND ")}
       ORDER BY m.category, m.name_de`,
      params
    );

    return NextResponse.json({
      data: result.rows,
      meta: { count: result.rows.length, category: category || "all" },
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
