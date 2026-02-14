const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
const API_URL = `https://graph.facebook.com/v21.0/${PHONE_NUMBER_ID}/messages`;

interface WhatsAppResult {
  ok: boolean;
  error?: string;
}

/** Send a WhatsApp template message (for verification codes). */
export async function sendWhatsAppTemplate(
  to: string,
  templateName: string,
  parameters: string[]
): Promise<WhatsAppResult> {
  if (!PHONE_NUMBER_ID || !ACCESS_TOKEN) {
    return { ok: false, error: "WhatsApp not configured" };
  }

  const body = {
    messaging_product: "whatsapp",
    to,
    type: "template",
    template: {
      name: templateName,
      language: { code: "de" },
      components: [
        {
          type: "body",
          parameters: parameters.map((p) => ({ type: "text", text: p })),
        },
      ],
    },
  };

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { ok: false, error: err.error?.message || "WhatsApp API error" };
    }

    return { ok: true };
  } catch (err: any) {
    return { ok: false, error: err.message || "Network error" };
  }
}

/** Send a plain text WhatsApp message (for alerts). */
export async function sendWhatsAppText(
  to: string,
  text: string
): Promise<WhatsAppResult> {
  if (!PHONE_NUMBER_ID || !ACCESS_TOKEN) {
    return { ok: false, error: "WhatsApp not configured" };
  }

  const body = {
    messaging_product: "whatsapp",
    to,
    type: "text",
    text: { body: text },
  };

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { ok: false, error: err.error?.message || "WhatsApp API error" };
    }

    return { ok: true };
  } catch (err: any) {
    return { ok: false, error: err.message || "Network error" };
  }
}
