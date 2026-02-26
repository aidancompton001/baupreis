import { NextResponse } from "next/server";
import pool from "@/lib/db";

/**
 * GET /api/health — Public health check endpoint.
 * Returns 200 if app + database are reachable, 503 otherwise.
 * No authentication required — used by monitoring/uptime services.
 */
export async function GET() {
  const checks: Record<string, boolean> = {};

  try {
    await pool.query("SELECT 1");
    checks.database = true;
  } catch {
    checks.database = false;
  }

  checks.app = true;

  const healthy = Object.values(checks).every(Boolean);

  return NextResponse.json(
    { status: healthy ? "ok" : "degraded", checks },
    { status: healthy ? 200 : 503 }
  );
}
