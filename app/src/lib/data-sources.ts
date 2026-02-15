/**
 * External data source clients for price collection.
 *
 * 1. metals.dev — LME metal prices (copper, aluminum, zinc, nickel)
 *    Docs: https://www.metals.dev/docs
 *
 * 2. Destatis GENESIS — German construction price indices
 *    Docs: https://www-genesis.destatis.de/genesisWS/rest/2020
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
 * Fetch construction price indices from Destatis GENESIS API.
 * Table 61261-0002: Preisindizes für Bauwerke (construction price indices).
 *
 * API: GET https://www-genesis.destatis.de/genesisWS/rest/2020/data/tablefile
 * Returns CSV with quarterly index values.
 *
 * We convert indices to approximate EUR prices using base prices.
 * Data is quarterly — we only get new data every ~3 months.
 *
 * On failure: returns empty Map (partial failure).
 */
export async function fetchDestatisPrices(): Promise<Map<string, PricePoint>> {
  const result = new Map<string, PricePoint>();
  const username = process.env.DESTATIS_USER;
  const password = process.env.DESTATIS_PASSWORD;

  if (!username || !password) {
    console.warn("[data-sources] DESTATIS credentials not configured, skipping");
    return result;
  }

  try {
    const currentYear = new Date().getFullYear();
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15_000);

    const url = new URL(
      "https://www-genesis.destatis.de/genesisWS/rest/2020/data/tablefile"
    );
    url.searchParams.set("username", username);
    url.searchParams.set("password", password);
    url.searchParams.set("name", "61261-0002");
    url.searchParams.set("area", "free");
    url.searchParams.set("compress", "false");
    url.searchParams.set("startyear", String(currentYear - 1));
    url.searchParams.set("endyear", String(currentYear));
    url.searchParams.set("language", "de");
    url.searchParams.set("format", "ffcsv");

    const res = await fetch(url.toString(), { signal: controller.signal });
    clearTimeout(timeout);

    if (!res.ok) {
      throw new Error(`Destatis GENESIS returned ${res.status}`);
    }

    const csvText = await res.text();
    const parsedIndices = parseDestatisCSV(csvText);

    // Base prices (2020=100) for converting index to EUR
    // Sources: BKI Baupreise, industry averages
    const basePrices: Record<string, { base_eur: number; code: string }> = {
      Transportbeton: { base_eur: 85, code: "concrete_c25" },
      Zement: { base_eur: 95, code: "cement_cem2" },
      "Dämmstoffe": { base_eur: 42, code: "insulation_eps" },
    };

    for (const [keyword, config] of Object.entries(basePrices)) {
      const index = parsedIndices.get(keyword);
      if (index && index > 0) {
        result.set(config.code, {
          price_eur: Math.round((config.base_eur * index) / 100 * 100) / 100,
          source: "destatis",
        });
      }
    }
  } catch (err: any) {
    console.error("[data-sources] Destatis fetch failed:", err.message);
  }

  return result;
}

/**
 * Parse Destatis GENESIS FFCSV format.
 * Returns Map<keyword, latest_index_value>.
 *
 * FFCSV format: semicolon-separated, header rows start with metadata,
 * data rows contain the index values.
 */
function parseDestatisCSV(csv: string): Map<string, number> {
  const indices = new Map<string, number>();

  const lines = csv.split("\n");

  for (const line of lines) {
    // Skip empty lines and metadata/header lines
    if (!line.trim() || line.startsWith('"')) continue;

    const parts = line.split(";");
    if (parts.length < 4) continue;

    // Look for rows with index values (numeric in last column)
    const lastValue = parts[parts.length - 1]?.trim().replace(",", ".");
    const numValue = parseFloat(lastValue);

    if (isNaN(numValue)) continue;

    // Match keywords in the row description
    const rowText = parts.join(" ").toLowerCase();
    if (rowText.includes("transportbeton")) {
      indices.set("Transportbeton", numValue);
    } else if (rowText.includes("zement") && !rowText.includes("faser")) {
      indices.set("Zement", numValue);
    } else if (
      rowText.includes("dämmstoff") ||
      rowText.includes("dämmstoffe")
    ) {
      indices.set("Dämmstoffe", numValue);
    }
  }

  return indices;
}

/**
 * Generate synthetic prices for materials without direct API sources.
 * Uses base prices with small random variation to simulate market movement.
 *
 * In production, these would come from additional data sources
 * (Eurostat for energy, industry reports for wood/insulation).
 */
export function getSyntheticPrices(): Map<string, PricePoint> {
  const result = new Map<string, PricePoint>();

  // Base prices with small daily variation (±0.5%)
  // All 16 materials covered — no API keys needed for demo/dev mode
  const syntheticMaterials: Record<string, number> = {
    steel_rebar: 750,
    steel_beam: 1100,
    copper_lme: 8200,
    aluminum_lme: 2150,
    zinc_lme: 2400,
    nickel_lme: 16500,
    concrete_c25: 95,
    cement_cem2: 105,
    wood_kvh: 320,
    wood_bsh: 450,
    wood_osb: 12.5,
    insulation_eps: 48,
    insulation_xps: 55,
    insulation_mw: 38,
    diesel: 1.45,
    electricity: 85,
  };

  for (const [code, basePrice] of Object.entries(syntheticMaterials)) {
    // Deterministic daily variation based on date
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
