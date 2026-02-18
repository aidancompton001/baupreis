import { requireOrg } from "@/lib/auth";
import { NextResponse } from "next/server";

/**
 * GET /api/telegram/status
 * Returns current Telegram connection status for the org.
 * Used by the frontend to poll after deep-link click.
 */
export async function GET() {
  try {
    const org = await requireOrg();

    return NextResponse.json({
      connected: !!org.telegram_chat_id,
      chatId: org.telegram_chat_id || null,
    });
  } catch (error: any) {
    if (
      error.message === "No organization found" ||
      error.message === "Trial expired" ||
      error.message === "Subscription cancelled"
    ) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    return NextResponse.json(
      { error: "Interner Serverfehler" },
      { status: 500 }
    );
  }
}
