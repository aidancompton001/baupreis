import { requireOrg, canAccess } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";
import pool from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export async function POST(req: NextRequest) {
  try {
    const org = await requireOrg();

    if (!canAccess(org, "forecast")) {
      return NextResponse.json(
        { error: "KI-Chat ist ab dem Pro-Plan verfügbar." },
        { status: 403 }
      );
    }

    if (!checkRateLimit(`chat:${org.id}`, 10, 60_000)) {
      return NextResponse.json(
        { error: "Zu viele Anfragen. Bitte warten Sie eine Minute." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const messages: Array<{ role: string; content: string }> = body.messages;

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Nachrichten fehlen." },
        { status: 400 }
      );
    }

    if (messages.length > 20) {
      return NextResponse.json(
        { error: "Maximal 20 Nachrichten pro Gespräch." },
        { status: 400 }
      );
    }

    for (const msg of messages) {
      if (
        typeof msg.content !== "string" ||
        msg.content.length > 2000 ||
        !["user", "assistant"].includes(msg.role)
      ) {
        return NextResponse.json(
          { error: "Ungültiges Nachrichtenformat." },
          { status: 400 }
        );
      }
    }

    // Fetch current prices and analysis for org's materials as context
    let orgFilter = "";
    const params: any[] = [];
    let paramIdx = 1;

    if (org.plan === "basis" || org.plan === "trial") {
      orgFilter = `AND m.id IN (SELECT material_id FROM org_materials WHERE org_id = $${paramIdx})`;
      params.push(org.id);
      paramIdx++;
    }

    const pricesResult = await pool.query(
      `SELECT DISTINCT ON (m.code)
         m.name_de, m.code, m.unit, p.price_eur, p.timestamp
       FROM prices p
       JOIN materials m ON p.material_id = m.id
       WHERE p.timestamp > NOW() - INTERVAL '7 days' ${orgFilter}
       ORDER BY m.code, p.timestamp DESC`,
      params
    );

    const analysisResult = await pool.query(
      `SELECT DISTINCT ON (m.code)
         m.name_de, m.code, a.trend, a.change_pct_7d, a.change_pct_30d,
         a.recommendation, a.explanation_de
       FROM analysis a
       JOIN materials m ON a.material_id = m.id
       WHERE 1=1 ${orgFilter.replace(new RegExp(`\\$${1}`, "g"), `$${params.length > 0 ? params.length : 1}`)}
       ORDER BY m.code, a.timestamp DESC`,
      params.length > 0 ? [params[0]] : []
    );

    // Build price context table
    let priceContext = "Aktuelle Preise (letzte 7 Tage):\n";
    priceContext += "| Material | Preis | Einheit | Stand |\n";
    priceContext += "|----------|-------|---------|-------|\n";
    for (const row of pricesResult.rows) {
      const date = new Date(row.timestamp).toLocaleDateString("de-DE");
      priceContext += `| ${row.name_de} | €${parseFloat(row.price_eur).toLocaleString("de-DE", { minimumFractionDigits: 2 })} | ${row.unit} | ${date} |\n`;
    }

    let analysisContext = "\nAktuelle Analyse:\n";
    for (const row of analysisResult.rows) {
      const trend =
        row.trend === "rising"
          ? "steigend"
          : row.trend === "falling"
            ? "fallend"
            : "stabil";
      const rec =
        row.recommendation === "buy_now"
          ? "Jetzt kaufen"
          : row.recommendation === "wait"
            ? "Abwarten"
            : "Beobachten";
      analysisContext += `- ${row.name_de}: Trend ${trend}, 7T ${row.change_pct_7d > 0 ? "+" : ""}${row.change_pct_7d}%, 30T ${row.change_pct_30d > 0 ? "+" : ""}${row.change_pct_30d}%, Empfehlung: ${rec}\n`;
    }

    const systemPrompt = `Du bist BauPreis AI, ein KI-Assistent für Baustoffpreise in Deutschland.
Du hilfst Einkäufern und Geschäftsführern in der Baubranche bei Fragen zu Materialpreisen, Trends und Einkaufsstrategien.

${priceContext}
${analysisContext}

Regeln:
- Antworte IMMER auf Deutsch.
- Beziehe dich auf die realen Preisdaten oben.
- Wenn du keine Daten zu einem Material hast, sage das ehrlich.
- Gib keine Finanzberatung — nur Marktinformationen und Einschätzungen.
- Halte Antworten kurz und präzise (max. 3-4 Absätze).
- Verwende € für Preise und das deutsche Zahlenformat (1.234,56).`;

    const client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const stream = client.messages.stream({
      model: "claude-sonnet-4-5-20250929",
      max_tokens: 1024,
      system: systemPrompt,
      messages: messages.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    });

    // Stream response as SSE
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (
              event.type === "content_block_delta" &&
              event.delta.type === "text_delta"
            ) {
              const data = JSON.stringify({ text: event.delta.text });
              controller.enqueue(
                encoder.encode(`data: ${data}\n\n`)
              );
            }
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (err) {
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ error: "Stream-Fehler" })}\n\n`
            )
          );
          controller.close();
        }
      },
    });

    return new NextResponse(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
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
