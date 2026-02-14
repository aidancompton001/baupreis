import { requireOrg } from "@/lib/auth";
import pool from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const org = await requireOrg();

    const rules = await pool.query(
      `SELECT ar.*, m.name_de, m.code
       FROM alert_rules ar
       LEFT JOIN materials m ON ar.material_id = m.id
       WHERE ar.org_id = $1
       ORDER BY ar.created_at DESC`,
      [org.id]
    );

    const sent = await pool.query(
      `SELECT as2.*, m.name_de, m.code
       FROM alerts_sent as2
       LEFT JOIN materials m ON as2.material_id = m.id
       WHERE as2.org_id = $1
       ORDER BY as2.sent_at DESC
       LIMIT 50`,
      [org.id]
    );

    return NextResponse.json({ rules: rules.rows, sent: sent.rows });
  } catch (error: any) {
    if (error.message === "No organization found" || error.message === "Trial expired" || error.message === "Subscription cancelled") {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 });
  }
}

const VALID_RULE_TYPES = ["price_change", "price_above", "price_below", "daily_summary"];
const VALID_CHANNELS = ["email", "telegram", "both", "whatsapp", "all"];
const VALID_PRIORITIES = ["low", "medium", "high"];
const VALID_TIME_WINDOWS = ["1h", "6h", "24h", "7d", "30d"];

export async function POST(req: NextRequest) {
  try {
    const org = await requireOrg();
    const body = await req.json();

    // Input validation
    if (!body.rule_type || !VALID_RULE_TYPES.includes(body.rule_type)) {
      return NextResponse.json(
        { error: "Ungültiger Regeltyp. Erlaubt: " + VALID_RULE_TYPES.join(", ") },
        { status: 400 }
      );
    }
    if (!body.channel || !VALID_CHANNELS.includes(body.channel)) {
      return NextResponse.json(
        { error: "Ungültiger Kanal. Erlaubt: " + VALID_CHANNELS.join(", ") },
        { status: 400 }
      );
    }
    if (body.priority && !VALID_PRIORITIES.includes(body.priority)) {
      return NextResponse.json(
        { error: "Ungültige Priorität. Erlaubt: " + VALID_PRIORITIES.join(", ") },
        { status: 400 }
      );
    }
    if (body.time_window && !VALID_TIME_WINDOWS.includes(body.time_window)) {
      return NextResponse.json(
        { error: "Ungültiges Zeitfenster." },
        { status: 400 }
      );
    }
    const thresholdPct = parseFloat(body.threshold_pct);
    if (isNaN(thresholdPct) || thresholdPct <= 0 || thresholdPct > 100) {
      return NextResponse.json(
        { error: "Schwellenwert muss zwischen 0 und 100 liegen." },
        { status: 400 }
      );
    }

    // Validate material_id belongs to org's allowed materials (Basis/Trial)
    if (body.material_id) {
      if (org.plan === "basis" || org.plan === "trial") {
        const matCheck = await pool.query(
          "SELECT 1 FROM org_materials WHERE org_id = $1 AND material_id = $2",
          [org.id, body.material_id]
        );
        if (matCheck.rows.length === 0) {
          return NextResponse.json(
            { error: "Material nicht in Ihrem Plan enthalten." },
            { status: 403 }
          );
        }
      } else {
        const matExists = await pool.query(
          "SELECT 1 FROM materials WHERE id = $1",
          [body.material_id]
        );
        if (matExists.rows.length === 0) {
          return NextResponse.json(
            { error: "Material nicht gefunden." },
            { status: 400 }
          );
        }
      }
    }

    // Check alert limit
    const countResult = await pool.query(
      "SELECT COUNT(*) FROM alert_rules WHERE org_id = $1 AND is_active = true",
      [org.id]
    );
    if (parseInt(countResult.rows[0].count) >= org.max_alerts) {
      return NextResponse.json(
        { error: "Alarm-Limit erreicht. Bitte upgraden Sie Ihren Plan." },
        { status: 403 }
      );
    }

    await pool.query(
      `INSERT INTO alert_rules (org_id, material_id, rule_type, threshold_pct, time_window, channel, priority)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        org.id,
        body.material_id || null,
        body.rule_type,
        thresholdPct,
        body.time_window || null,
        body.channel,
        body.priority || "medium",
      ]
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message === "No organization found" || error.message === "Trial expired" || error.message === "Subscription cancelled") {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const org = await requireOrg();
    const ruleId = req.nextUrl.searchParams.get("id");

    if (!ruleId) {
      return NextResponse.json({ error: "Alarm-ID erforderlich" }, { status: 400 });
    }

    await pool.query(
      "DELETE FROM alert_rules WHERE id = $1 AND org_id = $2",
      [ruleId, org.id]
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message === "No organization found" || error.message === "Trial expired" || error.message === "Subscription cancelled") {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 });
  }
}
