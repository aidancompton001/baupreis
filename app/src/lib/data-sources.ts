/**
 * External data source clients for price collection.
 *
 * 1. metals.dev — LME metal prices (copper, aluminum, zinc, nickel)
 * 2. Eurostat — Producer price indices for DE (steel C24, wood C16, construction C23)
 * 3. SMARD.de — Electricity spot prices (Bundesnetzagentur)
 * 4. Tankerkoenig — Diesel prices (Bundeskartellamt MTS-K)
 */

export interface PricePoint {
  price_eur: number;
  source: string;
}

/**
 * Fetch latest metal prices from metals.dev API.
 * Returns Map<material_code, PricePoint> for materials that have metals_dev_key.
 *
 * API: GET https://api.metals.dev/v1/latest?api_key={KEY}&currency=EUR&unit=mt
 * Returns prices in EUR per metric ton.
 *
 * On failure: returns empty Map (partial failure — other sources continue).
 */
export async function fetchMetalsPrices(): Promise<Map<string, PricePoint>> {
  const result = new Map<string, PricePoint>();
  const apiKey = process.env.METALS_DEV_API_KEY;

  if (!apiKey) {
    console.warn("[data-sources] METALS_DEV_API_KEY not configured, skipping metals.dev");
    return result;
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10_000);

    const res = await fetch(
      `https://api.metals.dev/v1/latest?api_key=${apiKey}&currency=EUR&unit=mt`,
      { signal: controller.signal }
    );
    clearTimeout(timeout);

    if (!res.ok) {
      throw new Error(`metals.dev returned ${res.status}`);
    }

    const data = await res.json();

    if (data.status !== "success" || !data.metals) {
      throw new Error("Unexpected metals.dev response format");
    }

    // Map metals.dev keys to our material codes
    const keyMapping: Record<string, string> = {
      copper: "copper_lme",
      aluminum: "aluminum_lme",
      zinc: "zinc_lme",
      nickel: "nickel_lme",
    };

    for (const [metalsDevKey, materialCode] of Object.entries(keyMapping)) {
      const price = data.metals[metalsDevKey];
      if (typeof price === "number" && price > 0) {
        result.set(materialCode, {
          price_eur: Math.round(price * 100) / 100,
          source: "metals.dev",
        });
      }
    }
  } catch (err: any) {
    console.error("[data-sources] metals.dev fetch failed:", err.message);
  }

  return result;
}

/**
 * Fetch producer price indices from Eurostat API for Germany.
 * Replaces Destatis GENESIS (which is often on maintenance).
 *
 * Three NACE sectors cover all construction materials:
 * - C24: Basic metals (steel rebar, beams)
 * - C16: Wood products (KVH, BSH, OSB)
 * - C23: Non-metallic minerals (concrete, cement, insulation)
 *
 * Free API, no key required, JSON format, monthly data.
 * Index base: 2015=100 (I15).
 */

interface EurostatSector {
  nace: string;
  materials: Array<{ code: string; base_eur: number }>;
}

const EUROSTAT_SECTORS: EurostatSector[] = [
  {
    nace: "C24", // Basic metals → steel
    materials: [
      { code: "steel_rebar", base_eur: 540 },  // 2015 base price EUR/t
      { code: "steel_beam", base_eur: 780 },
    ],
  },
  {
    nace: "C16", // Wood products
    materials: [
      { code: "wood_kvh", base_eur: 220 },      // 2015 base EUR/m³
      { code: "wood_bsh", base_eur: 310 },
      { code: "wood_osb", base_eur: 7.8 },      // EUR/m²
    ],
  },
  {
    nace: "C23", // Non-metallic minerals → concrete, cement, insulation
    materials: [
      { code: "concrete_c25", base_eur: 72 },   // 2015 base EUR/m³
      { code: "cement_cem2", base_eur: 78 },     // EUR/t
      { code: "insulation_eps", base_eur: 32 },  // EUR/m²
      { code: "insulation_xps", base_eur: 40 },
      { code: "insulation_mw", base_eur: 27 },
    ],
  },
];

async function fetchEurostatIndex(nace: string): Promise<number | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15_000);

    const url = `https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/sts_inppd_m?format=JSON&geo=DE&nace_r2=${nace}&s_adj=NSA&unit=I15&lang=EN`;
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);

    if (!res.ok) {
      throw new Error(`Eurostat ${nace} returned ${res.status}`);
    }

    const data = await res.json();
    const values = data.value as Record<string, number>;

    // Find the latest non-null value (highest index key)
    const sortedKeys = Object.keys(values)
      .map(Number)
      .sort((a, b) => a - b);

    if (sortedKeys.length === 0) return null;

    const lastKey = sortedKeys[sortedKeys.length - 1];
    return values[String(lastKey)] ?? null;
  } catch (err: any) {
    console.error(`[data-sources] Eurostat ${nace} fetch failed:`, err.message);
    return null;
  }
}

/** Fetch all construction material indices from Eurostat. Covers steel, wood, concrete, insulation. */
export async function fetchEurostatPrices(): Promise<Map<string, PricePoint>> {
  const result = new Map<string, PricePoint>();

  // Fetch all 3 sectors in parallel
  const indices = await Promise.all(
    EUROSTAT_SECTORS.map(async (sector) => ({
      nace: sector.nace,
      index: await fetchEurostatIndex(sector.nace),
      materials: sector.materials,
    }))
  );

  for (const { nace, index, materials } of indices) {
    if (!index || index <= 0) {
      console.warn(`[data-sources] Eurostat ${nace}: no index data`);
      continue;
    }

    for (const mat of materials) {
      const price = (mat.base_eur * index) / 100;
      result.set(mat.code, {
        price_eur: Math.round(price * 100) / 100,
        source: "eurostat",
      });
    }
  }

  return result;
}

/**
 * Fetch diesel prices from Tankerkoenig API (Bundeskartellamt MTS-K).
 * Real-time fuel prices from all German gas stations.
 * Free API with registration.
 *
 * Strategy: query 5 major cities, compute national average.
 */
export async function fetchTankerkoenigDiesel(): Promise<Map<string, PricePoint>> {
  const result = new Map<string, PricePoint>();
  const apiKey = process.env.TANKERKOENIG_API_KEY;

  if (!apiKey) {
    console.warn("[data-sources] TANKERKOENIG_API_KEY not configured, skipping diesel");
    return result;
  }

  try {
    // 5 major German cities for national average
    const cities = [
      { name: "Berlin", lat: 52.521, lng: 13.413 },
      { name: "München", lat: 48.137, lng: 11.576 },
      { name: "Hamburg", lat: 53.551, lng: 9.994 },
      { name: "Köln", lat: 50.938, lng: 6.960 },
      { name: "Frankfurt", lat: 50.110, lng: 8.682 },
    ];

    const prices: number[] = [];

    for (const city of cities) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10_000);

        const url = `https://creativecommons.tankerkoenig.de/json/list.php?lat=${city.lat}&lng=${city.lng}&rad=10&sort=price&type=diesel&apikey=${apiKey}`;
        const res = await fetch(url, { signal: controller.signal });
        clearTimeout(timeout);

        if (!res.ok) continue;

        const data = await res.json();
        if (data.ok && data.stations?.length > 0) {
          // Take median of first 5 stations to avoid outliers
          const stationPrices = data.stations
            .slice(0, 5)
            .map((s: any) => s.diesel)
            .filter((p: any) => typeof p === "number" && p > 0);

          if (stationPrices.length > 0) {
            stationPrices.sort((a: number, b: number) => a - b);
            const median = stationPrices[Math.floor(stationPrices.length / 2)];
            prices.push(median);
          }
        }
      } catch {
        // Individual city failure — continue with others
      }
    }

    if (prices.length > 0) {
      const avgPrice = prices.reduce((sum, p) => sum + p, 0) / prices.length;
      result.set("diesel", {
        price_eur: Math.round(avgPrice * 1000) / 1000,
        source: "tankerkoenig",
      });
    }
  } catch (err: any) {
    console.error("[data-sources] Tankerkoenig fetch failed:", err.message);
  }

  return result;
}

/**
 * Fetch electricity spot prices from SMARD.de (Bundesnetzagentur).
 * Day-ahead market price for Germany/Luxembourg bidding zone.
 * Completely free, no API key required.
 *
 * Filter 4169 = Marktpreis DE/LU, resolution: day.
 */
export async function fetchSMARDElectricity(): Promise<Map<string, PricePoint>> {
  const result = new Map<string, PricePoint>();

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15_000);

    // Step 1: get index of available timestamps
    const indexRes = await fetch(
      "https://www.smard.de/app/chart_data/4169/DE/index_day.json",
      { signal: controller.signal }
    );
    clearTimeout(timeout);

    if (!indexRes.ok) {
      throw new Error(`SMARD index returned ${indexRes.status}`);
    }

    const indexData = await indexRes.json();
    const timestamps = indexData.timestamps;

    if (!timestamps || timestamps.length === 0) {
      throw new Error("No SMARD timestamps available");
    }

    // Get the most recent timestamp
    const latestTimestamp = timestamps[timestamps.length - 1];

    const controller2 = new AbortController();
    const timeout2 = setTimeout(() => controller2.abort(), 15_000);

    // Step 2: fetch actual price data
    const dataRes = await fetch(
      `https://www.smard.de/app/chart_data/4169/DE/4169_DE_day_${latestTimestamp}.json`,
      { signal: controller2.signal }
    );
    clearTimeout(timeout2);

    if (!dataRes.ok) {
      throw new Error(`SMARD data returned ${dataRes.status}`);
    }

    const priceData = await dataRes.json();
    const series = priceData.series;

    if (!series || series.length === 0) {
      throw new Error("No SMARD price series");
    }

    // Get the latest non-null price entry
    // Series format: [[timestamp_ms, price_eur_mwh], ...]
    let latestPrice = 0;
    for (let i = series.length - 1; i >= 0; i--) {
      if (series[i][1] !== null && series[i][1] > 0) {
        latestPrice = series[i][1];
        break;
      }
    }

    if (latestPrice > 0) {
      result.set("electricity", {
        price_eur: Math.round(latestPrice * 100) / 100,
        source: "smard",
      });
    }
  } catch (err: any) {
    console.error("[data-sources] SMARD electricity fetch failed:", err.message);
  }

  return result;
}

/**
 * Generate synthetic prices ONLY for materials without any API source.
 * After integration of all free sources, this should cover 0 materials.
 * Kept as ultimate fallback.
 */
export function getSyntheticPrices(): Map<string, PricePoint> {
  const result = new Map<string, PricePoint>();

  // Only materials that have NO other source get synthetic prices
  // After full integration, this map should be empty
  const syntheticMaterials: Record<string, number> = {
    // All 16 materials now have real sources — synthetic is empty
    // Kept as fallback structure in case a new material is added
  };

  for (const [code, basePrice] of Object.entries(syntheticMaterials)) {
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) /
        86400000
    );
    const variation = Math.sin(dayOfYear * 0.1 + code.length) * 0.005;
    const price = basePrice * (1 + variation);

    result.set(code, {
      price_eur: Math.round(price * 100) / 100,
      source: "synthetic",
    });
  }

  return result;
}
