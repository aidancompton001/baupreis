import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { createSessionToken, SESSION_COOKIE } from "@/lib/session";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (!checkRateLimit(`auth:login:${ip}`, 10, 60_000)) {
      return NextResponse.json(
        { error: "Zu viele Anmeldeversuche. Bitte warten Sie eine Minute." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const email = (body.email || "").trim().toLowerCase();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Bitte geben Sie eine gültige E-Mail-Adresse ein." },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `SELECT u.clerk_user_id, u.org_id, u.name, o.name as org_name
       FROM users u
       JOIN organizations o ON u.org_id = o.id
       WHERE LOWER(u.email) = $1 AND u.is_active = true AND o.is_active = true`,
      [email]
    );

    if (!result.rows[0]) {
      return NextResponse.json(
        { error: "Kein Konto mit dieser E-Mail-Adresse gefunden. Bitte registrieren Sie sich zuerst." },
        { status: 404 }
      );
    }

    const user = result.rows[0];
    const token = createSessionToken(user.clerk_user_id, user.org_id);

    const response = NextResponse.json({
      ok: true,
      redirect: "/dashboard",
      message: `Willkommen zurück, ${user.name || ""}!`,
    });
    response.cookies.set(SESSION_COOKIE, token, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60,
    });
    return response;
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json(
      { error: "Anmeldung fehlgeschlagen. Bitte versuchen Sie es erneut." },
      { status: 500 }
    );
  }
}
