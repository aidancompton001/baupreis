import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import pool from "@/lib/db";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "";
const WEBHOOK_SECRET = process.env.TELEGRAM_WEBHOOK_SECRET || "";

/**
 * POST /api/webhook/telegram
 *
 * Receives updates from Telegram Bot API.
 * Verified via X-Telegram-Bot-Api-Secret-Token header (timing-safe).
 *
 * Handles:
 *   /start CODE  — complete deep-link connection
 *   /start       — welcome message with instructions
 *   anything     — generic info reply
 */
export async function POST(req: NextRequest) {
  // 1. Verify secret token
  const received = req.headers.get("x-telegram-bot-api-secret-token") || "";
  if (!verifySecret(received)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const update = await req.json();
    const message = update.message;
    if (!message?.text || !message?.chat?.id) {
      return NextResponse.json({ ok: true });
    }

    const chatId = String(message.chat.id);
    const text = message.text.trim();

    // 2. Handle /start [CODE]
    if (text.startsWith("/start")) {
      const parts = text.split(/\s+/);
      const code = parts[1];

      if (!code) {
        await reply(
          chatId,
          "👋 <b>Willkommen bei BauPreis AI!</b>\n\n" +
            "Um Preisalarme zu erhalten, verbinden Sie diesen Bot " +
            "mit Ihrem BauPreis-Konto:\n\n" +
            "➜ <b>Einstellungen → Telegram</b> in der BauPreis App\n" +
            "➜ Klicken Sie auf «In Telegram öffnen»"
        );
        return NextResponse.json({ ok: true });
      }

      // Look up pending connection
      const result = await pool.query(
        `SELECT org_id FROM telegram_pending_connections
         WHERE code = $1 AND expires_at > NOW()`,
        [code]
      );

      if (!result.rows[0]) {
        await reply(
          chatId,
          "❌ Ungültiger oder abgelaufener Code.\n\n" +
            "Bitte starten Sie den Verbindungsprozess erneut " +
            "in der BauPreis App."
        );
        return NextResponse.json({ ok: true });
      }

      const orgId = result.rows[0].org_id;

      // Update org with telegram_chat_id
      await pool.query(
        "UPDATE organizations SET telegram_chat_id = $1, updated_at = NOW() WHERE id = $2",
        [chatId, orgId]
      );

      // Delete used code (+ any expired codes)
      await pool.query(
        "DELETE FROM telegram_pending_connections WHERE code = $1 OR expires_at <= NOW()",
        [code]
      );

      await reply(
        chatId,
        "✅ <b>Erfolgreich verbunden!</b>\n\n" +
          "Sie erhalten ab jetzt Preisalarme direkt hier in Telegram.\n\n" +
          "Verwalten Sie Ihre Alarme unter baupreis.ais152.com"
      );
      return NextResponse.json({ ok: true });
    }

    // 3. Any other message
    await reply(
      chatId,
      "ℹ️ Dieser Bot sendet Ihnen automatische Preisalarme " +
        "von BauPreis AI.\n\nVerwalten Sie Ihre Einstellungen unter " +
        "baupreis.ais152.com"
    );

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("Telegram webhook error:", error.message);
    // Always return 200 to prevent Telegram retries
    return NextResponse.json({ ok: true });
  }
}

/** Timing-safe comparison of webhook secret. */
function verifySecret(received: string): boolean {
  if (!WEBHOOK_SECRET || !received) return false;
  if (received.length !== WEBHOOK_SECRET.length) return false;
  try {
    return timingSafeEqual(
      Buffer.from(received),
      Buffer.from(WEBHOOK_SECRET)
    );
  } catch {
    return false;
  }
}

/** Send a message back to the user via Telegram Bot API. */
async function reply(chatId: string, text: string): Promise<void> {
  if (!BOT_TOKEN) return;
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: "HTML",
    }),
  }).catch(() => {});
}
