import { requireCronAuth } from "@/lib/cron-auth";
import pool from "@/lib/db";
import { PLAN_LIMITS } from "@/lib/plans";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/cron/downgrade-trials
 * Crontab: every hour
 *
 * Downgrades expired trial organizations to Basis-level limits.
 * - Sets plan to "basis", applies Basis feature flags & limits
 * - Trims org_materials to first 5 (keeps user selection order)
 * - Deactivates excess alert_rules (keeps 3 most recent)
 * - Idempotent: WHERE plan='trial' ensures no double-processing
 */
export async function POST(req: NextRequest) {
  try {
    requireCronAuth(req);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const errors: string[] = [];
  let downgraded = 0;

  try {
    const expired = await pool.query(
      `SELECT id FROM organizations
       WHERE plan = 'trial' AND trial_ends_at < NOW() AND is_active = true`
    );

    if (expired.rows.length === 0) {
      return NextResponse.json({ ok: true, downgraded: 0, message: "No expired trials" });
    }

    const basis = PLAN_LIMITS.basis;

    for (const row of expired.rows) {
      const orgId = row.id;
      const client = await pool.connect();

      try {
        await client.query("BEGIN");

        // a) Downgrade plan + limits (WHERE plan='trial' for idempotency)
        const updateResult = await client.query(
          `UPDATE organizations SET
            plan = 'basis',
            max_materials = $1, max_users = $2, max_alerts = $3,
            features_telegram = $4, features_forecast = $5,
            features_api = $6, features_pdf_reports = $7,
            updated_at = NOW()
           WHERE id = $8 AND plan = 'trial'`,
          [
            basis.materials, basis.users, basis.alerts,
            basis.telegram, basis.forecast, basis.api, basis.pdf,
            orgId,
          ]
        );

        if (updateResult.rowCount === 0) {
          await client.query("ROLLBACK");
          continue;
        }

        // b) Trim org_materials to 5 (keep earliest)
        await client.query(
          `WITH keep AS (
            SELECT id FROM org_materials WHERE org_id = $1 ORDER BY id LIMIT 5
          )
          DELETE FROM org_materials WHERE org_id = $1 AND id NOT IN (SELECT id FROM keep)`,
          [orgId]
        );

        // c) Deactivate excess alert rules (keep 3 most recent)
        await client.query(
          `WITH keep AS (
            SELECT id FROM alert_rules
            WHERE org_id = $1 AND is_active = true
            ORDER BY created_at DESC LIMIT 3
          )
          UPDATE alert_rules SET is_active = false
          WHERE org_id = $1 AND is_active = true AND id NOT IN (SELECT id FROM keep)`,
          [orgId]
        );

        await client.query("COMMIT");
        downgraded++;
      } catch (err: any) {
        await client.query("ROLLBACK");
        errors.push(`Org ${orgId}: ${err.message}`);
      } finally {
        client.release();
      }
    }

    return NextResponse.json({
      ok: true,
      downgraded,
      total_expired: expired.rows.length,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: error.message || "Downgrade failed", downgraded, errors },
      { status: 500 }
    );
  }
}
