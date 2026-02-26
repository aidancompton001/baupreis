import { requireCronAuth } from "@/lib/cron-auth";
import {
  fetchMetalsPrices,
  fetchEurostatPrices,
  fetchTankerkoenigDiesel,
  fetchSMARDElectricity,
  getSyntheticPrices,
} from "@/lib/data-sources";
import pool from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/cron/collect-prices
 * Crontab: every 6 hours
 *
 * Collects prices from 5 sources in parallel:
 * 1. metals.dev — LME metals (copper, aluminum, zinc, nickel)
 * 2. Eurostat — Producer price indices for DE (steel, wood, concrete, insulation)
 * 3. Tankerkoenig — diesel prices (Bundeskartellamt MTS-K)
 * 4. SMARD.de — electricity spot prices (Bundesnetzagentur)
 * 5. Synthetic — fallback (should be empty, all 16 materials covered)
 *
 * Partial failure: if one source fails, others continue.
 * Priority: real API > eurostat index > synthetic fallback.
 */
export async function POST(req: NextRequest) {
  try {
    requireCronAuth(req);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const errors: string[] = [];
  let collected = 0;
  let skipped = 0;

  try {
    // 1. Load material catalog: code → id mapping
    const materialsResult = await pool.query(
      "SELECT id, code FROM materials WHERE is_active = true"
    );
    const materialMap = new Map<string, string>();
    for (const row of materialsResult.rows) {
      materialMap.set(row.code, row.id);
    }

    const emptyMap = () => new Map<string, { price_eur: number; source: string }>();

    // 2. Fetch prices from all 5 sources in parallel
    const [
      metalsPrices,
      eurostatPrices,
      dieselPrices,
      electricityPrices,
      syntheticPrices,
    ] = await Promise.all([
      fetchMetalsPrices().catch((err) => {
        errors.push(`metals.dev: ${err.message}`);
        return emptyMap();
      }),
      fetchEurostatPrices().catch((err) => {
        errors.push(`eurostat: ${err.message}`);
        return emptyMap();
      }),
      fetchTankerkoenigDiesel().catch((err) => {
        errors.push(`tankerkoenig: ${err.message}`);
        return emptyMap();
      }),
      fetchSMARDElectricity().catch((err) => {
        errors.push(`smard: ${err.message}`);
        return emptyMap();
      }),
      Promise.resolve(getSyntheticPrices()),
    ]);

    // 3. Merge: real API sources override synthetic (priority order: lowest first)
    const allPrices = new Map<string, { price_eur: number; source: string }>();
    syntheticPrices.forEach((point, code) => allPrices.set(code, point));
    eurostatPrices.forEach((point, code) => allPrices.set(code, point));
    dieselPrices.forEach((point, code) => allPrices.set(code, point));
    electricityPrices.forEach((point, code) => allPrices.set(code, point));
    metalsPrices.forEach((point, code) => allPrices.set(code, point));

    // 4. Insert into DB
    const now = new Date().toISOString();
    for (const [code, point] of Array.from(allPrices)) {
      const materialId = materialMap.get(code);
      if (!materialId) {
        skipped++;
        continue;
      }

      try {
        await pool.query(
          `INSERT INTO prices (material_id, timestamp, price_eur, source)
           VALUES ($1, $2, $3, $4)`,
          [materialId, now, point.price_eur, point.source]
        );
        collected++;
      } catch (err: any) {
        errors.push(`Insert ${code}: ${err.message}`);
        skipped++;
      }
    }

    return NextResponse.json({
      ok: true,
      collected,
      skipped,
      sources: {
        metals_dev: metalsPrices.size,
        eurostat: eurostatPrices.size,
        tankerkoenig: dieselPrices.size,
        smard: electricityPrices.size,
        synthetic: syntheticPrices.size,
      },
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        ok: false,
        error: error.message || "Collection failed",
        collected,
        skipped,
        errors,
      },
      { status: 500 }
    );
  }
}
