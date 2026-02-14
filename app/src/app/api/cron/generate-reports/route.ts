import { requireCronAuth } from "@/lib/cron-auth";
import pool from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/cron/generate-reports
 * Crontab: daily at 06:00
 *
 * Generates daily/weekly/monthly reports for all active organizations.
 * - daily: always
 * - weekly: if today is Monday
 * - monthly: if today is 1st of month
 *
 * content_json contains structured data (not HTML) for rendering.
 * Idempotency: checks for existing report with same org+type+period_start.
 */
export async function POST(req: NextRequest) {
  try {
    requireCronAuth(req);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let reportsGenerated = 0;
  let skipped = 0;
  const errors: string[] = [];

  try {
    const now = new Date();
    const today = now.toISOString().slice(0, 10);
    const dayOfWeek = now.getDay(); // 0=Sun, 1=Mon
    const dayOfMonth = now.getDate();

    // Determine which report types to generate
    const reportTypes: Array<{
      type: string;
      period_start: string;
      period_end: string;
    }> = [];

    // Daily — always
    reportTypes.push({
      type: "daily",
      period_start: today,
      period_end: today,
    });

    // Weekly — on Monday
    if (dayOfWeek === 1) {
      const weekStart = new Date(now);
      weekStart.setDate(weekStart.getDate() - 7);
      reportTypes.push({
        type: "weekly",
        period_start: weekStart.toISOString().slice(0, 10),
        period_end: today,
      });
    }

    // Monthly — on 1st of month
    if (dayOfMonth === 1) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
      reportTypes.push({
        type: "monthly",
        period_start: monthStart.toISOString().slice(0, 10),
        period_end: monthEnd.toISOString().slice(0, 10),
      });
    }

    // Fetch all active orgs
    const orgsResult = await pool.query(
      `SELECT id, plan FROM organizations
       WHERE is_active = true AND plan != 'cancelled'`
    );

    for (const org of orgsResult.rows) {
      for (const rt of reportTypes) {
        // Idempotency: skip if report already exists for this period
        const existing = await pool.query(
          `SELECT 1 FROM reports
           WHERE org_id = $1 AND report_type = $2 AND period_start = $3
           LIMIT 1`,
          [org.id, rt.type, rt.period_start]
        );
        if (existing.rows.length > 0) {
          skipped++;
          continue;
        }

        try {
          // Fetch latest prices for org's materials
          const pricesQuery =
            org.plan === "basis" || org.plan === "trial"
              ? `SELECT DISTINCT ON (m.code)
                   m.name_de, m.code, m.unit, p.price_eur, p.timestamp
                 FROM prices p
                 JOIN materials m ON p.material_id = m.id
                 JOIN org_materials om ON om.material_id = m.id AND om.org_id = $1
                 ORDER BY m.code, p.timestamp DESC`
              : `SELECT DISTINCT ON (m.code)
                   m.name_de, m.code, m.unit, p.price_eur, p.timestamp
                 FROM prices p
                 JOIN materials m ON p.material_id = m.id
                 WHERE m.is_active = true
                 ORDER BY m.code, p.timestamp DESC`;

          const pricesResult = await pool.query(
            pricesQuery,
            org.plan === "basis" || org.plan === "trial" ? [org.id] : []
          );

          // Fetch latest analysis for each material
          const analysisResult = await pool.query(
            `SELECT DISTINCT ON (m.code)
               m.code, a.trend, a.change_pct_7d, a.change_pct_30d,
               a.recommendation, a.explanation_de
             FROM analysis a
             JOIN materials m ON a.material_id = m.id
             WHERE m.is_active = true
             ORDER BY m.code, a.timestamp DESC`
          );

          const analysisMap = new Map<string, any>();
          for (const row of analysisResult.rows) {
            analysisMap.set(row.code, row);
          }

          // Build content_json
          const materials = pricesResult.rows.map((row: any) => {
            const analysis = analysisMap.get(row.code);
            return {
              name_de: row.name_de,
              code: row.code,
              unit: row.unit,
              price_eur: parseFloat(row.price_eur),
              timestamp: row.timestamp,
              trend: analysis?.trend || null,
              change_pct_7d: analysis?.change_pct_7d
                ? parseFloat(analysis.change_pct_7d)
                : null,
              change_pct_30d: analysis?.change_pct_30d
                ? parseFloat(analysis.change_pct_30d)
                : null,
              recommendation: analysis?.recommendation || null,
              explanation_de: analysis?.explanation_de || null,
            };
          });

          const contentJson = {
            report_type: rt.type,
            period: { start: rt.period_start, end: rt.period_end },
            generated_at: now.toISOString(),
            materials,
          };

          await pool.query(
            `INSERT INTO reports (org_id, report_type, period_start, period_end, content_json)
             VALUES ($1, $2, $3, $4, $5)`,
            [org.id, rt.type, rt.period_start, rt.period_end, JSON.stringify(contentJson)]
          );

          reportsGenerated++;
        } catch (err: any) {
          errors.push(`Report ${rt.type} for org ${org.id}: ${err.message}`);
        }
      }
    }

    return NextResponse.json({
      ok: true,
      reports: reportsGenerated,
      skipped,
      types: reportTypes.map((r) => r.type),
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        ok: false,
        error: error.message || "Report generation failed",
        reports: reportsGenerated,
        errors,
      },
      { status: 500 }
    );
  }
}
