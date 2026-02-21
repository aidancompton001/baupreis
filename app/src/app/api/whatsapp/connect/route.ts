import { requireOrg, canAccess } from "@/lib/auth";
import pool from "@/lib/db";
import { sendWhatsAppTemplate } from "@/lib/whatsapp";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST — WhatsApp connection flow.
 * Step 1: { action: "send_code", phone: "+49..." } → sends verification code
 * Step 2: { action: "verify", code: "123456" } → verifies and saves phone
 */
export async function POST(req: NextRequest) {
  try {
    const org = await requireOrg();

    if (!canAccess(org, "telegram")) {
      return NextResponse.json(
        { error: "WhatsApp ist ab dem Pro-Plan verfügbar.", errorKey: "api.error.whatsapp.notInPlan" },
        { status: 403 }
      );
    }

    const body = await req.json();

    if (body.action === "send_code") {
      const phone = typeof body.phone === "string" ? body.phone.trim() : "";

      // Basic phone validation (international format)
      if (!phone || !/^\+\d{10,15}$/.test(phone)) {
        return NextResponse.json(
          { error: "Ungültige Telefonnummer. Format: +49...", errorKey: "api.error.whatsapp.invalidPhone" },
          { status: 400 }
        );
      }

      // Generate 6-digit code
      const code = String(Math.floor(100000 + Math.random() * 900000));

      // Clear old pending verifications for this org
      await pool.query(
        `DELETE FROM whatsapp_pending_verifications WHERE org_id = $1`,
        [org.id]
      );

      // Store pending verification
      await pool.query(
        `INSERT INTO whatsapp_pending_verifications (org_id, phone, code)
         VALUES ($1, $2, $3)`,
        [org.id, phone, code]
      );

      // Send code via WhatsApp template
      const result = await sendWhatsAppTemplate(phone, "baupreis_verify", [
        code,
      ]);

      if (!result.ok) {
        // If WhatsApp API is not configured, still return success for development
        // The code is stored and can be verified manually
        console.error("WhatsApp send failed:", result.error);
      }

      return NextResponse.json({ ok: true, sent: result.ok });
    }

    if (body.action === "verify") {
      const code = typeof body.code === "string" ? body.code.trim() : "";

      if (!code || !/^\d{6}$/.test(code)) {
        return NextResponse.json(
          { error: "Ungültiger Code. Bitte 6-stelligen Code eingeben.", errorKey: "api.error.whatsapp.invalidCode" },
          { status: 400 }
        );
      }

      const pending = await pool.query(
        `SELECT phone FROM whatsapp_pending_verifications
         WHERE org_id = $1 AND code = $2 AND expires_at > NOW()`,
        [org.id, code]
      );

      if (pending.rows.length === 0) {
        return NextResponse.json(
          { error: "Code ungültig oder abgelaufen.", errorKey: "api.error.whatsapp.codeExpired" },
          { status: 400 }
        );
      }

      const phone = pending.rows[0].phone;

      // Save phone to organization
      await pool.query(
        `UPDATE organizations SET whatsapp_phone = $1 WHERE id = $2`,
        [phone, org.id]
      );

      // Cleanup
      await pool.query(
        `DELETE FROM whatsapp_pending_verifications WHERE org_id = $1`,
        [org.id]
      );

      return NextResponse.json({ ok: true, phone });
    }

    // Disconnect
    if (body.action === "disconnect") {
      await pool.query(
        `UPDATE organizations SET whatsapp_phone = NULL WHERE id = $1`,
        [org.id]
      );
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: "Ungültige Aktion.", errorKey: "api.error.whatsapp.invalidAction" }, { status: 400 });
  } catch (error: any) {
    if (
      [
        "No organization found",
        "Trial expired",
        "Subscription cancelled",
      ].includes(error.message)
    ) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    return NextResponse.json(
      { error: "Interner Serverfehler", errorKey: "api.error.internalServerError" },
      { status: 500 }
    );
  }
}
