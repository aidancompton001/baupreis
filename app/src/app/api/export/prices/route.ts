import { requireOrg } from "@/lib/auth";
import pool from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

function formatDeDate(date: Date): string {
  const d = date.getDate().toString().padStart(2, "0");
  const m = (date.getMonth() + 1).toString().padStart(2, "0");
  const y = date.getFullYear();
  return `${d}.${m}.${y}`;
}

function formatDeNumber(n: number): string {
  return n.toLocaleString("de-DE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export async function GET(req: NextRequest) {
  try {
    const org = await requireOrg();
    const material = req.nextUrl.searchParams.get("material");
    const daysRaw = parseInt(req.nextUrl.searchParams.get("days") || "30");
    const days =
      Number.isFinite(daysRaw) && daysRaw > 0 && daysRaw <= 365 ? daysRaw : 30;

    const params: any[] = [];
    let paramIdx = 1;

    let materialCondition = "1=1";
    if (material) {
      materialCondition = `m.code = $${paramIdx}`;
      params.push(material);
      paramIdx++;
    }

    let orgFilter = "";
    if (org.plan === "basis" || org.plan === "trial") {
      orgFilter = `AND m.id IN (SELECT material_id FROM org_materials WHERE org_id = $${paramIdx})`;
      params.push(org.id);
      paramIdx++;
    }

    params.push(days);

    const query = `
      SELECT p.timestamp, p.price_eur, p.source, m.name_de, m.unit, m.code
      FROM prices p
      JOIN materials m ON p.material_id = m.id
      WHERE ${materialCondition} ${orgFilter}
        AND p.timestamp > NOW() - make_interval(days => $${paramIdx}::int)
      ORDER BY p.timestamp DESC
    `;

    const result = await pool.query(query, params);

    // Build CSV with German formatting: semicolon delimiter, UTF-8 BOM
    const BOM = "\uFEFF";
    const header = "Datum;Material;Code;Preis (EUR);Einheit;Quelle";
    const rows = result.rows.map((row: any) => {
      const date = formatDeDate(new Date(row.timestamp));
      const name = row.name_de.replace(/;/g, ",");
      const price = formatDeNumber(parseFloat(row.price_eur));
      const unit = row.unit.replace(/;/g, ",");
      const source = (row.source || "").replace(/;/g, ",");
      return `${date};${name};${row.code};${price};${unit};${source}`;
    });

    const csv = BOM + header + "\n" + rows.join("\n");

    const filename = material
      ? `baupreis_${material}_${days}t.csv`
      : `baupreis_alle_${days}t.csv`;

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
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
