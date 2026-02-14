import { requireCronAuth } from "@/lib/cron-auth";
import { sendEmail } from "@/lib/notifications";
import pool from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/cron/health
 * Crontab: every 5 minutes
 * Checks: DB connectivity, metals.dev API, data freshness.
 * Sends alert email if any check fails.
 */
export async function POST(req: NextRequest) {
  try {
    requireCronAuth(req);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const checks: Record<string, boolean> = {
    db: false,
    metals_api: false,
    fresh_data: false,
  };
  const errors: string[] = [];

  // Check 1: PostgreSQL connectivity
  try {
    await pool.query("SELECT 1");
    checks.db = true;
  } catch (err: any) {
    errors.push(`DB: ${err.message}`);
  }

  // Check 2: metals.dev API reachability
  try {
    const apiKey = process.env.METALS_DEV_API_KEY;
    if (apiKey) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);
      const res = await fetch(
        `https://api.metals.dev/v1/latest?api_key=${apiKey}&currency=EUR&unit=mt`,
        { signal: controller.signal }
      );
      clearTimeout(timeout);
      checks.metals_api = res.ok;
      if (!res.ok) errors.push(`metals.dev: HTTP ${res.status}`);
    } else {
      // Not configured — skip, don't fail
      checks.metals_api = true;
    }
  } catch (err: any) {
    errors.push(`metals.dev: ${err.message}`);
  }

  // Check 3: Data freshness — latest price should be within 24 hours
  try {
    const result = await pool.query(
      "SELECT MAX(timestamp) as latest FROM prices"
    );
    const latest = result.rows[0]?.latest;
    if (latest) {
      const age = Date.now() - new Date(latest).getTime();
      const maxAge = 24 * 60 * 60 * 1000; // 24 hours
      checks.fresh_data = age < maxAge;
      if (!checks.fresh_data) {
        const hoursAgo = Math.round(age / 3600000);
        errors.push(`Data freshness: latest price is ${hoursAgo}h old`);
      }
    } else {
      // No prices at all — first run, not a failure
      checks.fresh_data = true;
    }
  } catch (err: any) {
    errors.push(`Freshness check: ${err.message}`);
  }

  const allOk = Object.values(checks).every(Boolean);

  // Send alert email if any check failed
  if (!allOk) {
    const adminEmail = process.env.EMAIL_FROM?.match(/<(.+)>/)?.[1] || process.env.ACME_EMAIL;
    if (adminEmail) {
      await sendEmail(
        adminEmail,
        "⚠️ BauPreis Health Alert",
        `<h2>Health Check Failed</h2>
        <p>Time: ${new Date().toISOString()}</p>
        <ul>${errors.map((e) => `<li>${e}</li>`).join("")}</ul>
        <p>Checks: ${JSON.stringify(checks)}</p>`
      );
    }
  }

  return NextResponse.json({ ok: allOk, checks, errors });
}
