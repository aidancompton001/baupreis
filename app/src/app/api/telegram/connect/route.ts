import { requireOrg, canAccess } from "@/lib/auth";
import pool from "@/lib/db";
import { randomBytes } from "crypto";
import { NextRequest, NextResponse } from "next/server";

const BOT_USERNAME = "baupreis_ai_bot";

/**
 * POST /api/telegram/connect
 * Generate a deep-link code and return the Telegram URL.
 * Code expires in 5 minutes (DB default).
 */
export async function POST(req: NextRequest) {
  try {
    const org = await requireOrg();

    if (!canAccess(org, "telegram")) {
      return NextResponse.json(
        { error: "Telegram ist nicht in Ihrem Plan enthalten." },
        { status: 403 }
      );
    }

    // Generate random 8-char hex code
    const code = randomBytes(4).toString("hex").toUpperCase();

    // Clean up any old codes for this org
    await pool.query(
      "DELETE FROM telegram_pending_connections WHERE org_id = $1",
      [org.id]
    );

    // Insert new pending connection (5 min TTL via DB default)
    await pool.query(
      `INSERT INTO telegram_pending_connections (code, org_id)
       VALUES ($1, $2)`,
      [code, org.id]
    );

    const deepLink = `https://t.me/${BOT_USERNAME}?start=${code}`;

    return NextResponse.json({ deepLink, code });
  } catch (error: unknown) {
    if (error instanceof Error && ["No organization found", "Trial expired", "Subscription cancelled"].includes(error.message)) {
      return NextResponse.json({ error: error instanceof Error ? error.message : "Interner Serverfehler" }, { status: 403 });
    }
    return NextResponse.json(
      { error: "Interner Serverfehler" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/telegram/connect
 * Disconnect Telegram — clear telegram_chat_id from org.
 */
export async function DELETE(req: NextRequest) {
  try {
    const org = await requireOrg();

    await pool.query(
      "UPDATE organizations SET telegram_chat_id = NULL, updated_at = NOW() WHERE id = $1",
      [org.id]
    );

    // Clean up any pending codes too
    await pool.query(
      "DELETE FROM telegram_pending_connections WHERE org_id = $1",
      [org.id]
    );

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    if (error instanceof Error && ["No organization found", "Trial expired", "Subscription cancelled"].includes(error.message)) {
      return NextResponse.json({ error: error instanceof Error ? error.message : "Interner Serverfehler" }, { status: 403 });
    }
    return NextResponse.json(
      { error: "Interner Serverfehler" },
      { status: 500 }
    );
  }
}
