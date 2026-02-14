import { requireCronAuth } from "@/lib/cron-auth";
import {
  fetchMetalsPrices,
  fetchDestatisPrices,
  getSyntheticPrices,
} from "@/lib/data-sources";
import pool from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/cron/collect-prices
 * Crontab: every 6 hours
 *
 * Collects prices from 3 sources in parallel:
 * 1. metals.dev — LME metals (copper, aluminum, zinc, nickel)
 * 2. Destatis GENESIS — construction indices (concrete, cement, insulation)
 * 3. Synthetic — remaining materials (steel, wood, energy) with deterministic variation
 *
 * Partial failure: if one source fails, others continue.
 * Idempotency: each call inserts new rows with current timestamp.
 * Dashboard uses DISTINCT ON ... ORDER BY timestamp DESC for latest prices.
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

    // 2. Fetch prices from all sources in parallel
    const [metalsPrices, destatisPrices, syntheticPrices] = await Promise.all([
      fetchMetalsPrices().catch((err) => {
        errors.push(`metals.dev: ${err.message}`);
        return new Map<string, { price_eur: number; source: string }>();
      }),
      fetchDestatisPrices().catch((err) => {
        errors.push(`destatis: ${err.message}`);
        return new Map<string, { price_eur: number; source: string }>();
      }),
      Promise.resolve(getSyntheticPrices()),
    ]);

    // 3. Merge: API sources override synthetic
    const allPrices = new Map<string, { price_eur: number; source: string }>();
    syntheticPrices.forEach((point, code) => allPrices.set(code, point));
    destatisPrices.forEach((point, code) => allPrices.set(code, point));
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
        destatis: destatisPrices.size,
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
