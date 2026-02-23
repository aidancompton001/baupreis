import { sendEmail } from "@/lib/notifications";
import { NextRequest, NextResponse } from "next/server";

const CONTACT_EMAIL = "pashchenkoh@gmail.com";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";

    if (!name) {
      return NextResponse.json(
        { error: "Name ist erforderlich.", errorKey: "contact.error.nameRequired" },
        { status: 400 }
      );
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Ungültige E-Mail-Adresse.", errorKey: "contact.error.invalidEmail" },
        { status: 400 }
      );
    }
    if (!message) {
      return NextResponse.json(
        { error: "Nachricht ist erforderlich.", errorKey: "contact.error.messageRequired" },
        { status: 400 }
      );
    }
    if (message.length > 5000) {
      return NextResponse.json(
        { error: "Nachricht ist zu lang (max. 5000 Zeichen).", errorKey: "contact.error.messageTooLong" },
        { status: 400 }
      );
    }

    const html = `
      <h2>Neue Kontaktanfrage — BauPreis AI</h2>
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>E-Mail:</strong> ${escapeHtml(email)}</p>
      <hr />
      <p>${escapeHtml(message).replace(/\n/g, "<br />")}</p>
    `;

    const result = await sendEmail(
      CONTACT_EMAIL,
      `Kontaktanfrage von ${name}`,
      html
    );

    if (!result.ok) {
      console.error("Contact email send failed:", result.error);
      return NextResponse.json(
        { error: "E-Mail konnte nicht gesendet werden.", errorKey: "contact.error.sendFailed" },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Interner Serverfehler", errorKey: "api.error.internalServerError" },
      { status: 500 }
    );
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
