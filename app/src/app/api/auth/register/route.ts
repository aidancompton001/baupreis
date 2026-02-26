import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { createSessionToken, SESSION_COOKIE } from "@/lib/session";
import { randomUUID } from "crypto";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (!checkRateLimit(`auth:register:${ip}`, 5, 60_000)) {
      return NextResponse.json(
        { error: "Zu viele Registrierungsversuche. Bitte warten Sie eine Minute." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const email = (body.email || "").trim().toLowerCase();
    const name = (body.name || "").trim();
    const company = (body.company || "").trim();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Bitte geben Sie eine gültige E-Mail-Adresse ein." },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existing = await pool.query(
      `SELECT u.*, o.id as org_id FROM users u
       JOIN organizations o ON u.org_id = o.id
       WHERE LOWER(u.email) = $1 AND u.is_active = true AND o.is_active = true`,
      [email]
    );

    if (existing.rows[0]) {
      // User exists — log them in
      const user = existing.rows[0];
      const token = createSessionToken(user.clerk_user_id, user.org_id);
      const response = NextResponse.json({
        ok: true,
        redirect: "/dashboard",
        message: "Willkommen zurück!",
      });
      response.cookies.set(SESSION_COOKIE, token, {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 30 * 24 * 60 * 60, // 30 days
      });
      return response;
    }

    // New registration
    const userId = `local_${randomUUID()}`;
    const slug = `org-${randomUUID().slice(0, 8)}`;
    const orgName = company || name || "Mein Unternehmen";

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // Create org with Trial plan (7 days, Pro-level access)
      const orgResult = await client.query(
        `INSERT INTO organizations (name, slug, plan, trial_ends_at,
          max_materials, max_users, max_alerts,
          features_telegram, features_forecast, features_api, features_pdf_reports)
         VALUES ($1, $2, 'trial', NOW() + INTERVAL '7 days',
          99, 1, 999, true, true, false, false)
         RETURNING *`,
        [orgName, slug]
      );
      const org = orgResult.rows[0];

      // Create user
      await client.query(
        `INSERT INTO users (org_id, clerk_user_id, email, name, role)
         VALUES ($1, $2, $3, $4, 'owner')`,
        [org.id, userId, email, name || email.split("@")[0]]
      );

      // Add all materials (Trial = full access)
      await client.query(
        `INSERT INTO org_materials (org_id, material_id)
         SELECT $1, id FROM materials WHERE is_active = true`,
        [org.id]
      );

      await client.query("COMMIT");

      const token = createSessionToken(userId, org.id);
      const response = NextResponse.json({
        ok: true,
        redirect: "/onboarding",
        message: "Konto erstellt! Willkommen bei BauPreis AI.",
      });
      response.cookies.set(SESSION_COOKIE, token, {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 30 * 24 * 60 * 60,
      });
      return response;
    } catch (e) {
      await client.query("ROLLBACK");
      throw e;
    } finally {
      client.release();
    }
  } catch (err: any) {
    console.error("Registration error:", err);
    // Unique constraint on email/slug
    if (err.code === "23505") {
      return NextResponse.json(
        { error: "Diese E-Mail-Adresse wird bereits verwendet." },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Registrierung fehlgeschlagen. Bitte versuchen Sie es erneut." },
      { status: 500 }
    );
  }
}
