import { requireOrg } from "@/lib/auth";
import pool from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const org = await requireOrg();
    const reportId = req.nextUrl.searchParams.get("id");

    if (!reportId) {
      return NextResponse.json(
        { error: "Parameter 'id' fehlt" },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `SELECT r.*, m.name_de, m.code, m.unit
       FROM reports r
       LEFT JOIN LATERAL (
         SELECT name_de, code, unit FROM materials LIMIT 0
       ) m ON true
       WHERE r.id = $1 AND r.org_id = $2`,
      [reportId, org.id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Bericht nicht gefunden" },
        { status: 404 }
      );
    }

    const report = result.rows[0];
    const content = report.content_json;

    // Build CSV from report content_json
    const BOM = "\uFEFF";
    let csv = BOM;

    const reportType =
      report.report_type === "daily"
        ? "Tagesbericht"
        : report.report_type === "weekly"
          ? "Wochenbericht"
          : "Monatsbericht";

    const startDate = new Date(report.period_start).toLocaleDateString("de-DE");
    const endDate = new Date(report.period_end).toLocaleDateString("de-DE");

    csv += `${reportType};${startDate} - ${endDate}\n\n`;

    if (content && typeof content === "object") {
      if (Array.isArray(content.materials)) {
        csv += "Material;Preis (EUR);Änderung (%);Trend;Empfehlung\n";
        for (const mat of content.materials) {
          const name = (mat.name_de || mat.name || "").replace(/;/g, ",");
          const price = mat.price_eur
            ? parseFloat(mat.price_eur).toLocaleString("de-DE", {
                minimumFractionDigits: 2,
              })
            : "";
          const change = mat.change_pct
            ? parseFloat(mat.change_pct).toLocaleString("de-DE", {
                minimumFractionDigits: 2,
              })
            : "";
          const trend = mat.trend || "";
          const rec = mat.recommendation || "";
          csv += `${name};${price};${change};${trend};${rec}\n`;
        }
      } else {
        // Fallback: export raw JSON keys as CSV
        csv += "Schlüssel;Wert\n";
        for (const [key, value] of Object.entries(content)) {
          const val =
            typeof value === "object" ? JSON.stringify(value) : String(value);
          csv += `${key};${val.replace(/;/g, ",")}\n`;
        }
      }
    }

    const filename = `baupreis_${report.report_type}_${startDate.replace(/\./g, "-")}.csv`;

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
