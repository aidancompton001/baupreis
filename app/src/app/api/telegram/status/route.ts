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
