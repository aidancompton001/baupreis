import { requireOrg, canAccess } from "@/lib/auth";
import pool from "@/lib/db";
import { generateReportPdf } from "@/lib/pdf";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const org = await requireOrg();

    if (!canAccess(org, "pdf_reports")) {
      return NextResponse.json(
        { error: "PDF-Berichte sind nur im Team-Plan verfügbar." },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const reportId = searchParams.get("id");

    if (!reportId) {
      return NextResponse.json({ error: "Report-ID fehlt." }, { status: 400 });
    }

    const result = await pool.query(
      `SELECT id, report_type, period_start, period_end,
              content_json, created_at
       FROM reports
       WHERE id = $1 AND org_id = $2`,
      [reportId, org.id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Bericht nicht gefunden." },
        { status: 404 }
      );
    }

    const report = result.rows[0];
    const pdfBuffer = await generateReportPdf(report);

    const typeLabel =
      report.report_type === "daily"
        ? "Tagesbericht"
        : report.report_type === "weekly"
          ? "Wochenbericht"
          : "Monatsbericht";

    const periodStart = new Date(report.period_start)
      .toISOString()
      .slice(0, 10);
    const filename = `BauPreis_${typeLabel}_${periodStart}.pdf`;

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
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
