import { requireOrg, canAccess } from "@/lib/auth";
import pool from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const org = await requireOrg();

    if (!canAccess(org, "telegram")) {
      return NextResponse.json(
        { error: "Telegram ist nicht in Ihrem Plan enthalten." },
        { status: 403 }
      );
    }

    const { code } = await req.json();

    // Verify connection code and update org with telegram chat_id
    // Code verification would be handled by the n8n Telegram bot workflow
    const result = await pool.query(
      `SELECT chat_id FROM telegram_pending_connections
       WHERE code = $1 AND expires_at > NOW()`,
      [code]
    );

    if (!result.rows[0]) {
      return NextResponse.json(
        { error: "Ungültiger oder abgelaufener Code." },
        { status: 400 }
      );
    }

    await pool.query(
      "UPDATE organizations SET telegram_chat_id = $1, updated_at = NOW() WHERE id = $2",
      [result.rows[0].chat_id, org.id]
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message === "No organization found" || error.message === "Trial expired" || error.message === "Subscription cancelled") {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 });
  }
}
