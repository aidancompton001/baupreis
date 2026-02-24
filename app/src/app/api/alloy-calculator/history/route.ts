import { requireOrg, canAccess } from "@/lib/auth";
import pool from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { ALLOYS } from "@/lib/alloys";

/**
 * Mapping: element symbol → material code in `materials` table.
 * Only elements with LME price history are mapped.
 */
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

    const { searchParams } = new URL(req.url);
    const alloyCode = searchParams.get("code");
    const daysRaw = parseInt(searchParams.get("days") || "90");
    const days = Math.min(365, Math.max(7, daysRaw));

    if (!alloyCode) {
      return NextResponse.json({ error: "code parameter fehlt." }, { status: 400 });
    }

    const alloy = ALLOYS.find((a) => a.code === alloyCode);
    if (!alloy) {
      return NextResponse.json({ error: "Legierung nicht gefunden." }, { status: 404 });
    }

    // Find which elements have historical price data
    const trackedElements: Array<{ element: string; fraction: number; materialCode: string }> = [];
    for (const [element, fraction] of Object.entries(alloy.composition)) {
      const matCode = ELEMENT_TO_MATERIAL[element];
      if (matCode && fraction > 0.001) {
        trackedElements.push({ element, fraction, materialCode: matCode });
      }
    }

    if (trackedElements.length === 0) {
      return NextResponse.json({
        alloyCode,
        days,
        dataPoints: [],
        trackedElements: [],
        message: "Keine historischen LME-Daten für diese Legierung verfügbar.",
      });
    }

    // Fetch historical prices for all tracked elements
    const materialCodes = trackedElements.map((e) => e.materialCode);
    const placeholders = materialCodes.map((_, i) => `$${i + 1}`).join(",");

    const query = `
      SELECT
        p.timestamp::date AS date,
        m.code AS material_code,
        AVG(p.price_eur) AS avg_price
      FROM prices p
      JOIN materials m ON p.material_id = m.id
      WHERE m.code IN (${placeholders})
        AND p.timestamp > NOW() - make_interval(days => $${materialCodes.length + 1}::int)
      GROUP BY p.timestamp::date, m.code
      ORDER BY date ASC
    `;

    const result = await pool.query(query, [...materialCodes, days]);

    // Group prices by date
    const pricesByDate = new Map<string, Record<string, number>>();
    for (const row of result.rows) {
      const dateStr = new Date(row.date).toISOString().slice(0, 10);
      if (!pricesByDate.has(dateStr)) {
        pricesByDate.set(dateStr, {});
      }
      pricesByDate.get(dateStr)![row.material_code] = Number(row.avg_price);
    }

    // Calculate alloy price for each date
    const dataPoints: Array<{ date: string; price: number; breakdown: Record<string, number> }> = [];

    const entries = Array.from(pricesByDate.entries());
    for (const [date, prices] of entries) {
      // Check all tracked elements have data for this date
      const allPresent = trackedElements.every((e) => prices[e.materialCode] != null);
      if (!allPresent) continue;

      let alloyPrice = 0;
      const breakdown: Record<string, number> = {};

      for (const { element, fraction, materialCode } of trackedElements) {
        const contribution = fraction * prices[materialCode];
        alloyPrice += contribution;
        breakdown[element] = Math.round(contribution);
      }

      // Add contribution from non-tracked elements using static prices
      // (Fe, Mn, Si, etc. — stable prices, minimal impact)
      // This gives a more complete picture
      const { BASE_METALS } = await import("@/lib/alloys");
      for (const [element, fraction] of Object.entries(alloy.composition)) {
        if (!ELEMENT_TO_MATERIAL[element] && fraction > 0.001) {
          const metal = BASE_METALS[element];
          if (metal) {
            alloyPrice += fraction * metal.priceEurPerTonne;
          }
        }
      }

      dataPoints.push({
        date,
        price: Math.round(alloyPrice),
        breakdown,
      });
    }

    return NextResponse.json({
      alloyCode,
      alloyName: alloy.nameDE,
      days,
      dataPoints,
      trackedElements: trackedElements.map((e) => ({
        element: e.element,
        fraction: e.fraction,
        materialCode: e.materialCode,
      })),
    });
  } catch (error: any) {
    if (["No organization found", "Trial expired", "Subscription cancelled"].includes(error.message)) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 });
  }
}
