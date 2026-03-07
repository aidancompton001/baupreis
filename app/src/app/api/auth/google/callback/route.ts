import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { createSessionToken, SESSION_COOKIE } from "@/lib/session";
import { randomUUID } from "crypto";

interface GoogleTokenResponse {
  access_token: string;
  id_token: string;
  token_type: string;
}

interface GoogleUserInfo {
  sub: string;
  email: string;
  name?: string;
  picture?: string;
  email_verified?: boolean;
}

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const stateParam = req.nextUrl.searchParams.get("state");
  const error = req.nextUrl.searchParams.get("error");
  const origin = req.nextUrl.origin;

  if (error) {
    return NextResponse.redirect(`${origin}/sign-in?error=google_denied`);
  }

  if (!code || !stateParam) {
    return NextResponse.redirect(`${origin}/sign-in?error=google_missing_code`);
  }

  // Verify state
  const storedState = req.cookies.get("google_oauth_state")?.value;
  try {
    const statePayload = JSON.parse(
      Buffer.from(stateParam, "base64url").toString()
    );
    if (!storedState || statePayload.s !== storedState) {
      return NextResponse.redirect(`${origin}/sign-in?error=google_state_mismatch`);
    }
  } catch {
    return NextResponse.redirect(`${origin}/sign-in?error=google_state_invalid`);
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return NextResponse.redirect(`${origin}/sign-in?error=google_not_configured`);
  }

  const redirectUri = `${origin}/api/auth/google/callback`;

  // Exchange code for tokens
  let tokenData: GoogleTokenResponse;
  try {
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });
    if (!tokenRes.ok) {
      console.error("Google token exchange failed:", await tokenRes.text());
      return NextResponse.redirect(`${origin}/sign-in?error=google_token_failed`);
    }
    tokenData = await tokenRes.json();
  } catch (err) {
    console.error("Google token fetch error:", err);
    return NextResponse.redirect(`${origin}/sign-in?error=google_token_error`);
  }

  // Get user info
  let userInfo: GoogleUserInfo;
  try {
    const userRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    if (!userRes.ok) {
      return NextResponse.redirect(`${origin}/sign-in?error=google_userinfo_failed`);
    }
    userInfo = await userRes.json();
  } catch (err) {
    console.error("Google userinfo error:", err);
    return NextResponse.redirect(`${origin}/sign-in?error=google_userinfo_error`);
  }

  const email = userInfo.email?.toLowerCase();
  if (!email) {
    return NextResponse.redirect(`${origin}/sign-in?error=google_no_email`);
  }

  // Check if user exists
  const existing = await pool.query(
    `SELECT u.clerk_user_id, u.org_id, u.name
     FROM users u
     JOIN organizations o ON u.org_id = o.id
     WHERE LOWER(u.email) = $1 AND u.is_active = true AND o.is_active = true`,
    [email]
  );

  let userId: string;
  let orgId: string;
  let redirect = "/dashboard";

  if (existing.rows[0]) {
    // Existing user — log in
    userId = existing.rows[0].clerk_user_id;
    orgId = existing.rows[0].org_id;
  } else {
    // New user — register with Trial
    userId = `google_${userInfo.sub}`;
    const slug = `org-${randomUUID().slice(0, 8)}`;
    const name = userInfo.name || email.split("@")[0];
    const orgName = name;

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const orgResult = await client.query(
        `INSERT INTO organizations (name, slug, plan, trial_ends_at,
          max_materials, max_users, max_alerts,
          features_telegram, features_forecast, features_api, features_pdf_reports)
         VALUES ($1, $2, 'trial', NOW() + INTERVAL '7 days',
          99, 1, 999, true, true, false, false)
         RETURNING id`,
        [orgName, slug]
      );
      orgId = orgResult.rows[0].id;

      await client.query(
        `INSERT INTO users (org_id, clerk_user_id, email, name, role)
         VALUES ($1, $2, $3, $4, 'owner')`,
        [orgId, userId, email, name]
      );

      await client.query(
        `INSERT INTO org_materials (org_id, material_id)
         SELECT $1, id FROM materials WHERE is_active = true`,
        [orgId]
      );

      await client.query("COMMIT");
      redirect = "/onboarding";
    } catch (e) {
      await client.query("ROLLBACK");
      console.error("Google registration error:", e);
      return NextResponse.redirect(`${origin}/sign-in?error=google_register_failed`);
    } finally {
      client.release();
    }
  }

  const token = createSessionToken(userId, orgId);
  const response = NextResponse.redirect(`${origin}${redirect}`);
  response.cookies.set(SESSION_COOKIE, token, {
    path: "/",
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 30 * 24 * 60 * 60,
  });
  response.cookies.delete("google_oauth_state");
  return response;
}
