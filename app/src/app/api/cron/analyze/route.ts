import { requireCronAuth } from "@/lib/cron-auth";
import pool from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

/**
 * POST /api/cron/analyze
 * Crontab: every 12 hours
 *
 * Uses Claude AI to analyze price trends for all active materials.
 * Single batch prompt for all 16 materials (~$0.015 per run, ~$0.90/month).
 *
 * Inserts one analysis row per material with:
 * - trend (rising/falling/stable)
 * - change_pct_7d, change_pct_30d
 * - recommendation (buy_now/wait/watch)
 * - confidence (0-100)
 * - explanation_de/en/ru (multilingual text)
 * - forecast_json ({7d, 30d, 90d} price predictions)
 */
export async function POST(req: NextRequest) {
  try {
    requireCronAuth(req);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const errors: string[] = [];
  let analyzed = 0;

  try {
    // 1. Fetch recent prices for all materials (last 90 days)
    const pricesResult = await pool.query(
      `SELECT m.id as material_id, m.code, m.name_de, m.unit,
              p.price_eur, p.timestamp, p.source
       FROM prices p
       JOIN materials m ON p.material_id = m.id
       WHERE m.is_active = true
         AND p.timestamp > NOW() - INTERVAL '90 days'
       ORDER BY m.code, p.timestamp DESC`
    );

    // Group prices by material
    const materialPrices = new Map<
      string,
      {
        material_id: string;
        code: string;
        name_de: string;
        unit: string;
        prices: Array<{ price_eur: number; timestamp: string; source: string }>;
      }
    >();

    for (const row of pricesResult.rows) {
      if (!materialPrices.has(row.code)) {
        materialPrices.set(row.code, {
          material_id: row.material_id,
          code: row.code,
          name_de: row.name_de,
          unit: row.unit,
          prices: [],
        });
      }
      materialPrices.get(row.code)!.prices.push({
        price_eur: parseFloat(row.price_eur),
        timestamp: row.timestamp,
        source: row.source,
      });
    }

    if (materialPrices.size === 0) {
      return NextResponse.json({
        ok: true,
        analyzed: 0,
        message: "No price data available for analysis",
      });
    }

    // 2. Check if Claude API key is available — synthetic fallback if not
    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    const hasValidApiKey =
      anthropicKey &&
      anthropicKey !== "placeholder" &&
      anthropicKey.length > 10;

    if (!hasValidApiKey) {
      // Generate deterministic synthetic analysis from price data
      const now = new Date().toISOString();
      for (const [code, data] of Array.from(materialPrices)) {
        const prices = data.prices;
        const latestPrice = prices[0]?.price_eur || 0;

        const oldPrice =
          prices.length > 1
            ? prices[Math.min(prices.length - 1, 6)]?.price_eur
            : latestPrice;
        const change7d =
          oldPrice > 0
            ? ((latestPrice - oldPrice) / oldPrice) * 100
            : 0;
        const change30d = change7d * 1.8;

        const trend =
          change7d > 0.5 ? "rising" : change7d < -0.5 ? "falling" : "stable";
        const recommendation =
          trend === "rising"
            ? "buy_now"
            : trend === "falling"
              ? "wait"
              : "watch";

        const forecast7d =
          Math.round(latestPrice * (1 + (change7d / 100) * 0.5) * 100) / 100;
        const forecast30d =
          Math.round(latestPrice * (1 + (change30d / 100) * 0.3) * 100) / 100;
        const forecast90d =
          Math.round(latestPrice * (1 + (change30d / 100) * 0.5) * 100) / 100;

        const explanationsDe: Record<string, string> = {
          rising: `${data.name_de}: Preise steigen leicht. Kaufempfehlung vor weiteren Erhöhungen.`,
          falling: `${data.name_de}: Preisrückgang zu beobachten. Abwarten könnte sich lohnen.`,
          stable: `${data.name_de}: Preise bleiben stabil. Kein dringender Handlungsbedarf.`,
        };
        const explanationsEn: Record<string, string> = {
          rising: `${data.name_de}: Prices are rising slightly. Buying recommended before further increases.`,
          falling: `${data.name_de}: Price decline observed. Waiting could be worthwhile.`,
          stable: `${data.name_de}: Prices remain stable. No urgent action needed.`,
        };
        const explanationsRu: Record<string, string> = {
          rising: `${data.name_de}: Цены немного растут. Рекомендуется покупка до дальнейшего роста.`,
          falling: `${data.name_de}: Наблюдается снижение цен. Возможно, стоит подождать.`,
          stable: `${data.name_de}: Цены остаются стабильными. Срочных действий не требуется.`,
        };

        try {
          await pool.query(
            `INSERT INTO analysis
              (material_id, timestamp, trend, change_pct_7d, change_pct_30d,
               forecast_json, explanation_de, explanation_en, explanation_ru,
               recommendation, confidence,
               model_version, prompt_tokens, completion_tokens)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
            [
              data.material_id,
              now,
              trend,
              Math.round(change7d * 100) / 100,
              Math.round(change30d * 100) / 100,
              JSON.stringify({
                "7d": forecast7d,
                "30d": forecast30d,
                "90d": forecast90d,
              }),
              explanationsDe[trend],
              explanationsEn[trend],
              explanationsRu[trend],
              recommendation,
              35,
              "synthetic",
              0,
              0,
            ]
          );
          analyzed++;
        } catch (err: any) {
          errors.push(`Synthetic insert ${code}: ${err.message}`);
        }
      }

      return NextResponse.json({
        ok: true,
        analyzed,
        total_materials: materialPrices.size,
        mode: "synthetic",
        errors: errors.length > 0 ? errors : undefined,
      });
    }

    // 3. Build batch prompt with all materials (Claude API path)
    let priceTable = "Preisdaten der letzten 90 Tage:\n\n";
    for (const [code, data] of Array.from(materialPrices)) {
      priceTable += `## ${data.name_de} (${code}, ${data.unit})\n`;
      // Include last 10 data points per material to keep prompt size manageable
      const recent = data.prices.slice(0, 10);
      for (const p of recent) {
        const date = new Date(p.timestamp).toLocaleDateString("de-DE");
        priceTable += `- ${date}: €${p.price_eur.toLocaleString("de-DE", { minimumFractionDigits: 2 })} (${p.source})\n`;
      }
      priceTable += "\n";
    }

    const systemPrompt = `Du bist ein Analyst für Baustoffpreise in Deutschland.
Analysiere die folgenden Preisdaten und gib für JEDES Material eine Einschätzung.

Antworte NUR mit validem JSON — kein Markdown, kein erklärende Text, nur das JSON-Array.

Format:
[
  {
    "code": "material_code",
    "trend": "rising" | "falling" | "stable",
    "change_pct_7d": number,
    "change_pct_30d": number,
    "recommendation": "buy_now" | "wait" | "watch",
    "confidence": number (0-100),
    "explanation_de": "2-3 Sätze auf Deutsch",
    "explanation_en": "2-3 sentences in English",
    "explanation_ru": "2-3 предложения на русском",
    "forecast_json": { "7d": number, "30d": number, "90d": number }
  }
]

Regeln:
- forecast_json enthält prognostizierte PREISE (EUR), nicht Prozent
- confidence: 80+ nur bei klarem Trend mit vielen Datenpunkten
- Sei konservativ bei Prognosen
- Wenn zu wenig Daten: confidence < 40, recommendation = "watch"`;

    // 4. Call Claude API (non-streaming, batch)
    const client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const response = await client.messages.create({
      model: "claude-sonnet-4-5-20250929",
      max_tokens: 4096,
      system: systemPrompt,
      messages: [{ role: "user", content: priceTable }],
    });

    // 5. Parse response
    const content =
      response.content[0].type === "text" ? response.content[0].text : "";

    let analyses: Array<{
      code: string;
      trend: string;
      change_pct_7d: number;
      change_pct_30d: number;
      recommendation: string;
      confidence: number;
      explanation_de: string;
      explanation_en: string;
      explanation_ru: string;
      forecast_json: { "7d": number; "30d": number; "90d": number };
    }>;

    try {
      // Handle potential markdown code blocks in response
      const jsonStr = content.replace(/```json?\s*\n?/g, "").replace(/```\s*$/g, "").trim();
      analyses = JSON.parse(jsonStr);
    } catch (parseErr) {
      errors.push(`JSON parse error: ${content.substring(0, 200)}`);
      return NextResponse.json(
        { ok: false, analyzed: 0, errors },
        { status: 500 }
      );
    }

    if (!Array.isArray(analyses)) {
      errors.push("Response is not an array");
      return NextResponse.json(
        { ok: false, analyzed: 0, errors },
        { status: 500 }
      );
    }

    // 6. Insert analysis for each material
    const now = new Date().toISOString();
    const modelVersion = "claude-sonnet-4-5-20250929";
    const promptTokens = response.usage?.input_tokens || 0;
    const completionTokens = response.usage?.output_tokens || 0;

    for (const a of analyses) {
      const materialData = materialPrices.get(a.code);
      if (!materialData) {
        errors.push(`Unknown material code in response: ${a.code}`);
        continue;
      }

      try {
        await pool.query(
          `INSERT INTO analysis
            (material_id, timestamp, trend, change_pct_7d, change_pct_30d,
             forecast_json, explanation_de, explanation_en, explanation_ru,
             recommendation, confidence,
             model_version, prompt_tokens, completion_tokens)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
          [
            materialData.material_id,
            now,
            a.trend,
            a.change_pct_7d,
            a.change_pct_30d,
            JSON.stringify(a.forecast_json),
            a.explanation_de,
            a.explanation_en || a.explanation_de,
            a.explanation_ru || a.explanation_de,
            a.recommendation,
            a.confidence,
            modelVersion,
            promptTokens,
            completionTokens,
          ]
        );
        analyzed++;
      } catch (err: any) {
        errors.push(`Insert analysis ${a.code}: ${err.message}`);
      }
    }

    return NextResponse.json({
      ok: true,
      analyzed,
      total_materials: materialPrices.size,
      usage: {
        input_tokens: promptTokens,
        output_tokens: completionTokens,
      },
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: error.message || "Analysis failed", analyzed, errors },
      { status: 500 }
    );
  }
}
