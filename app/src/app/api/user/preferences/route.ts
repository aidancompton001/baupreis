import { getUser, requireOrg } from "@/lib/auth";
import pool from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// GET: read user preferences
export async function GET() {
  try {
    await requireOrg();
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Benutzer nicht gefunden" }, { status: 403 });
    }

    return NextResponse.json({
      preferences: user.preferences || {},
    });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "No organization found") {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 });
  }
}

// PATCH: update user preferences (merge)
export async function PATCH(req: NextRequest) {
  try {
    await requireOrg();
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Benutzer nicht gefunden" }, { status: 403 });
    }

    const updates = await req.json();
    if (typeof updates !== "object" || updates === null || Array.isArray(updates)) {
      return NextResponse.json({ error: "Ungültiges Format" }, { status: 400 });
    }

    // Merge with existing preferences
    const result = await pool.query(
      `UPDATE users SET preferences = COALESCE(preferences, '{}'::jsonb) || $1::jsonb
       WHERE id = $2
       RETURNING preferences`,
      [JSON.stringify(updates), user.id]
    );

    return NextResponse.json({
      preferences: result.rows[0]?.preferences || {},
    });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "No organization found") {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 });
  }
}
