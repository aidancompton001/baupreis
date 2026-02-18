import { requireCronAuth } from "@/lib/cron-auth";
import { sendEmail, sendTelegram } from "@/lib/notifications";
import { sendWhatsAppText } from "@/lib/whatsapp";
import pool from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/cron/send-alerts
 * Crontab: every 1 hour
 *
 * Checks all active alert rules against current prices.
 * Rule types: price_change, price_above, price_below, daily_summary.
 * Channels: email, telegram, whatsapp, both (email+telegram), all.
 *
 * Idempotency: checks alerts_sent — no duplicate within 1 hour per rule.
 */
export async function POST(req: NextRequest) {
  try {
    requireCronAuth(req);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let checked = 0;
  let sent = 0;
  const errors: string[] = [];

  try {
    // 1. Fetch all active rules with org + material + owner info
    const rulesResult = await pool.query(
      `SELECT ar.id as rule_id, ar.org_id, ar.material_id,
              ar.rule_type, ar.threshold_pct, ar.time_window, ar.channel,
              m.code, m.name_de, m.unit,
              o.telegram_chat_id, o.whatsapp_phone,
              u.email as owner_email
       FROM alert_rules ar
       JOIN materials m ON ar.material_id = m.id
       JOIN organizations o ON ar.org_id = o.id
       JOIN users u ON u.org_id = o.id AND u.role = 'owner'
       WHERE ar.is_active = true AND o.is_active = true
         AND (o.plan != 'trial' OR o.trial_ends_at > NOW())`
    );

    for (const rule of rulesResult.rows) {
      checked++;

      // 2. Check idempotency: was this rule already triggered within 1 hour?
      const recentAlert = await pool.query(
        `SELECT 1 FROM alerts_sent
         WHERE rule_id = $1 AND sent_at > NOW() - INTERVAL '1 hour'
         LIMIT 1`,
        [rule.rule_id]
      );
      if (recentAlert.rows.length > 0) continue;

      // 3. Get current price
      const currentPriceResult = await pool.query(
        `SELECT price_eur, timestamp FROM prices
         WHERE material_id = $1
         ORDER BY timestamp DESC LIMIT 1`,
        [rule.material_id]
      );
      if (currentPriceResult.rows.length === 0) continue;

      const currentPrice = parseFloat(currentPriceResult.rows[0].price_eur);
      const currentTimestamp = currentPriceResult.rows[0].timestamp;

      // 4. Check if rule condition is met
      let triggered = false;
      let changePct = 0;
      let messageText = "";

      switch (rule.rule_type) {
        case "price_change": {
          // Get price from time_window ago
          const windowMap: Record<string, string> = {
            "1h": "1 hour",
            "6h": "6 hours",
            "12h": "12 hours",
            "24h": "24 hours",
            "7d": "7 days",
          };
          const interval = windowMap[rule.time_window] || "24 hours";
          const previousResult = await pool.query(
            `SELECT price_eur FROM prices
             WHERE material_id = $1
               AND timestamp < NOW() - $2::interval
             ORDER BY timestamp DESC LIMIT 1`,
            [rule.material_id, interval]
          );
          if (previousResult.rows.length > 0) {
            const previousPrice = parseFloat(previousResult.rows[0].price_eur);
            changePct =
              previousPrice > 0
                ? ((currentPrice - previousPrice) / previousPrice) * 100
                : 0;

            if (Math.abs(changePct) >= parseFloat(rule.threshold_pct)) {
              triggered = true;
              const direction = changePct > 0 ? "gestiegen" : "gefallen";
              messageText =
                `⚠️ <b>Preisalarm: ${rule.name_de}</b>\n` +
                `Preis ${direction} um ${Math.abs(changePct).toFixed(1)}% ` +
                `in ${rule.time_window}\n` +
                `Aktuell: €${currentPrice.toLocaleString("de-DE", { minimumFractionDigits: 2 })} ${rule.unit}`;
            }
          }
          break;
        }

        case "price_above": {
          const threshold = parseFloat(rule.threshold_pct); // reusing field as threshold value
          if (currentPrice > threshold) {
            triggered = true;
            messageText =
              `⚠️ <b>Preisalarm: ${rule.name_de}</b>\n` +
              `Preis über Schwellenwert: €${currentPrice.toLocaleString("de-DE", { minimumFractionDigits: 2 })} > €${threshold.toLocaleString("de-DE", { minimumFractionDigits: 2 })} ${rule.unit}`;
          }
          break;
        }

        case "price_below": {
          const threshold = parseFloat(rule.threshold_pct);
          if (currentPrice < threshold) {
            triggered = true;
            messageText =
              `✅ <b>Preisalarm: ${rule.name_de}</b>\n` +
              `Preis unter Schwellenwert: €${currentPrice.toLocaleString("de-DE", { minimumFractionDigits: 2 })} < €${threshold.toLocaleString("de-DE", { minimumFractionDigits: 2 })} ${rule.unit}`;
          }
          break;
        }

        case "daily_summary": {
          // Check if we already sent a daily summary today
          const todaySummary = await pool.query(
            `SELECT 1 FROM alerts_sent
             WHERE rule_id = $1 AND sent_at::date = CURRENT_DATE
             LIMIT 1`,
            [rule.rule_id]
          );
          if (todaySummary.rows.length === 0) {
            triggered = true;
            const date = new Date(currentTimestamp).toLocaleDateString("de-DE");
            messageText =
              `📊 <b>Täglicher Bericht: ${rule.name_de}</b>\n` +
              `Aktueller Preis: €${currentPrice.toLocaleString("de-DE", { minimumFractionDigits: 2 })} ${rule.unit}\n` +
              `Stand: ${date}`;
          }
          break;
        }
      }

      if (!triggered) continue;

      // 5. Send notification via configured channel(s)
      const channels = resolveChannels(rule.channel);
      let deliveryStatus = "sent";

      for (const ch of channels) {
        try {
          let result: { ok: boolean; error?: string } = { ok: false, error: "Unknown channel" };

          if (ch === "email" && rule.owner_email) {
            const plainText = messageText.replace(/<[^>]*>/g, "");
            result = await sendEmail(
              rule.owner_email,
              `BauPreis Alarm: ${rule.name_de}`,
              messageText.replace(/\n/g, "<br>")
            );
          } else if (ch === "telegram" && rule.telegram_chat_id) {
            result = await sendTelegram(rule.telegram_chat_id, messageText);
          } else if (ch === "whatsapp" && rule.whatsapp_phone) {
            const plainText = messageText.replace(/<[^>]*>/g, "");
            result = await sendWhatsAppText(rule.whatsapp_phone, plainText);
          }

          if (!result.ok) {
            errors.push(`${ch} for rule ${rule.rule_id}: ${result.error}`);
            deliveryStatus = "partial";
          }
        } catch (err: any) {
          errors.push(`${ch} for rule ${rule.rule_id}: ${err.message}`);
          deliveryStatus = "failed";
        }
      }

      // 6. Record sent alert
      await pool.query(
        `INSERT INTO alerts_sent (org_id, rule_id, material_id, message_text, channel, delivery_status)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          rule.org_id,
          rule.rule_id,
          rule.material_id,
          messageText.replace(/<[^>]*>/g, ""), // store plain text
          rule.channel,
          deliveryStatus,
        ]
      );
      sent++;
    }

    return NextResponse.json({
      ok: true,
      checked,
      sent,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: error.message || "Alert processing failed", checked, sent, errors },
      { status: 500 }
    );
  }
}

/** Expand channel value to array of individual channels. */
function resolveChannels(channel: string): string[] {
  switch (channel) {
    case "both":
      return ["email", "telegram"];
    case "all":
      return ["email", "telegram", "whatsapp"];
    default:
      return [channel];
  }
}
