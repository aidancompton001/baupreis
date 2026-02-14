import { NextRequest } from "next/server";

/**
 * Authenticate cron job requests via Bearer token.
 * All /api/cron/* routes must call this before processing.
 * Throws if token is missing or invalid.
 */
export function requireCronAuth(req: NextRequest): void {
  const authHeader = req.headers.get("authorization");
  const secret = process.env.CRON_SECRET;

  if (!secret || authHeader !== `Bearer ${secret}`) {
    throw new Error("Unauthorized");
  }
}
