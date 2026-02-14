/**
 * Unified notification layer for email and Telegram.
 * WhatsApp is handled by lib/whatsapp.ts (already exists).
 */

interface NotificationResult {
  ok: boolean;
  error?: string;
}

/**
 * Send an email via Resend API.
 * https://resend.com/docs/api-reference/emails/send-email
 */
export async function sendEmail(
  to: string,
  subject: string,
  html: string
): Promise<NotificationResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM || "BauPreis AI <noreply@baupreis.ai>";

  if (!apiKey) {
    return { ok: false, error: "RESEND_API_KEY not configured" };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to: [to], subject, html }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return {
        ok: false,
        error: err.message || `Resend API error: ${res.status}`,
      };
    }

    return { ok: true };
  } catch (err: any) {
    return { ok: false, error: err.message || "Network error sending email" };
  }
}

/**
 * Send a Telegram message via Bot API.
 * https://core.telegram.org/bots/api#sendmessage
 */
export async function sendTelegram(
  chatId: string,
  text: string
): Promise<NotificationResult> {
  const token = process.env.TELEGRAM_BOT_TOKEN;

  if (!token) {
    return { ok: false, error: "TELEGRAM_BOT_TOKEN not configured" };
  }

  try {
    const res = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: "HTML",
        }),
      }
    );

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return {
        ok: false,
        error:
          err.description || `Telegram API error: ${res.status}`,
      };
    }

    return { ok: true };
  } catch (err: any) {
    return {
      ok: false,
      error: err.message || "Network error sending Telegram",
    };
  }
}
