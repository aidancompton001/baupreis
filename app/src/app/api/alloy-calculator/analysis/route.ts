import { requireOrg, canAccess } from "@/lib/auth";
import pool from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { ALLOYS, BASE_METALS } from "@/lib/alloys";

/** Mapping: element symbol → material code for analysis lookup */
const ELEMENT_TO_MATERIAL: Record<string, string> = {
  Cu: "copper_lme",
  Al: "aluminum_lme",
  Zn: "zinc_lme",
  Ni: "nickel_lme",
};

export async function GET(req: NextRequest) {
  try {
    const org = await requireOrg();
    if (!canAccess(org, "forecast")) {
      return NextResponse.json(
        { error: "Legierungsrechner ist ab dem Pro-Plan verfügbar." },
        { status: 403 }
      );
    }

    const alloyCode = req.nextUrl.searchParams.get("code");
    if (!alloyCode) {
      return NextResponse.json({ error: "code parameter fehlt." }, { status: 400 });
    }

    const alloy = ALLOYS.find((a) => a.code === alloyCode);
    if (!alloy) {
      return NextResponse.json({ error: "Legierung nicht gefunden." }, { status: 404 });
    }

    // Find tracked elements with LME analysis data
    const trackedElements: Array<{ element: string; fraction: number; materialCode: string }> = [];
    for (const [element, fraction] of Object.entries(alloy.composition)) {
      const matCode = ELEMENT_TO_MATERIAL[element];
      if (matCode && fraction > 0.001) {
        trackedElements.push({ element, fraction, materialCode: matCode });
      }
    }

    // Fetch latest analysis for each tracked element's material
    const materialCodes = trackedElements.map((e) => e.materialCode);
    if (materialCodes.length === 0) {
      return NextResponse.json({
        alloyCode,
        hasAnalysis: false,
        message: "Keine LME-Daten für Trendanalyse verfügbar.",
      });
    }

    const placeholders = materialCodes.map((_, i) => `$${i + 1}`).join(",");
    const analysisResult = await pool.query(
      `SELECT DISTINCT ON (m.code)
         m.code AS material_code,
         a.trend, a.change_pct_7d, a.change_pct_30d,
         a.forecast_json, a.recommendation, a.confidence,
         a.explanation_de, a.explanation_en, a.explanation_ru,
         a.timestamp
       FROM analysis a
       JOIN materials m ON a.material_id = m.id
       WHERE m.code IN (${placeholders})
       ORDER BY m.code, a.timestamp DESC`,
      materialCodes
    );

    // Build element analyses map
    const elementAnalyses = new Map<string, any>();
    for (const row of analysisResult.rows) {
      elementAnalyses.set(row.material_code, row);
    }

    // Calculate weighted alloy trend
    let weightedChange7d = 0;
    let weightedChange30d = 0;
    let weightedConfidence = 0;
    let totalWeight = 0;
    const elementTrends: Array<{
      element: string;
      fraction: number;
      trend: string;
      change7d: number;
      change30d: number;
      confidence: number;
    }> = [];

    for (const { element, fraction, materialCode } of trackedElements) {
      const analysis = elementAnalyses.get(materialCode);
      if (!analysis) continue;

      const change7d = Number(analysis.change_pct_7d) || 0;
      const change30d = Number(analysis.change_pct_30d) || 0;
      const confidence = Number(analysis.confidence) || 0;

      weightedChange7d += fraction * change7d;
      weightedChange30d += fraction * change30d;
      weightedConfidence += fraction * confidence;
      totalWeight += fraction;

      elementTrends.push({
        element,
        fraction,
        trend: analysis.trend,
        change7d,
        change30d,
        confidence,
      });
    }

    if (totalWeight > 0) {
      weightedChange7d = Math.round(weightedChange7d / totalWeight * 100) / 100;
      weightedChange30d = Math.round(weightedChange30d / totalWeight * 100) / 100;
      weightedConfidence = Math.round(weightedConfidence / totalWeight);
    }

    const alloyTrend = weightedChange7d > 0.5 ? "rising" : weightedChange7d < -0.5 ? "falling" : "stable";
    const recommendation = alloyTrend === "rising" ? "buy_now" : alloyTrend === "falling" ? "wait" : "watch";

    // Try Claude AI for detailed analysis
    let aiInsight: { de: string; en: string; ru: string } | null = null;
    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    const hasValidApiKey = anthropicKey && anthropicKey !== "placeholder" && anthropicKey.length > 10;

    if (hasValidApiKey && elementTrends.length > 0) {
      try {
        const client = new Anthropic({ apiKey: anthropicKey });

        const trendData = elementTrends.map((et) =>
          `${et.element} (${(et.fraction * 100).toFixed(1)}%): ${et.trend}, 7d ${et.change7d > 0 ? "+" : ""}${et.change7d}%, 30d ${et.change30d > 0 ? "+" : ""}${et.change30d}%`
        ).join("\n");

        const prompt = `Legierung ${alloy.nameDE} (${alloy.code}, ${alloy.din}).
Zusammensetzung-Trends der letzten Wochen:
${trendData}

Gewichteter Alloy-Trend: ${alloyTrend}, 7d: ${weightedChange7d > 0 ? "+" : ""}${weightedChange7d}%, 30d: ${weightedChange30d > 0 ? "+" : ""}${weightedChange30d}%

Gib eine kurze Analyse (max 2 Sätze) in 3 Sprachen:
Antworte NUR mit JSON:
{"de": "...", "en": "...", "ru": "..."}`;

        const response = await client.messages.create({
          model: "claude-3-haiku-20240307",
          max_tokens: 512,
          messages: [{ role: "user", content: prompt }],
        });

        const text = response.content[0].type === "text" ? response.content[0].text : "";
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          aiInsight = JSON.parse(jsonMatch[0]);
        }
      } catch {
        // Fallback to static
      }
    }

    // Static fallback if no AI
    if (!aiInsight) {
      const trendLabels = { rising: ["steigt", "rising", "растёт"], falling: ["fällt", "falling", "падает"], stable: ["stabil", "stable", "стабильна"] };
      const labels = trendLabels[alloyTrend as keyof typeof trendLabels] || trendLabels.stable;
      aiInsight = {
        de: `${alloy.nameDE}: Preis ${labels[0]}. Gewichtete Änderung 7T: ${weightedChange7d > 0 ? "+" : ""}${weightedChange7d}%.`,
        en: `${alloy.nameEN}: Price ${labels[1]}. Weighted 7d change: ${weightedChange7d > 0 ? "+" : ""}${weightedChange7d}%.`,
        ru: `${alloy.nameRU}: Цена ${labels[2]}. Взвешенное изменение 7д: ${weightedChange7d > 0 ? "+" : ""}${weightedChange7d}%.`,
      };
    }

    return NextResponse.json({
      alloyCode,
      alloyName: alloy.nameDE,
      hasAnalysis: elementTrends.length > 0,
      trend: alloyTrend,
      change7d: weightedChange7d,
      change30d: weightedChange30d,
      confidence: weightedConfidence,
      recommendation,
      insight: aiInsight,
      elementTrends,
      timestamp: analysisResult.rows[0]?.timestamp || null,
    });
  } catch (error: any) {
    if (["No organization found", "Trial expired", "Subscription cancelled"].includes(error.message)) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 });
  }
}
