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

    // XPS and Mineralwolle derived from the same Dämmstoffe index
    const daemmIndex = parsedIndices.get("Dämmstoffe");
    if (daemmIndex && daemmIndex > 0) {
      // XPS base 2020: ~52 EUR/m² (premium over EPS)
      result.set("insulation_xps", {
        price_eur: Math.round((52 * daemmIndex) / 100 * 100) / 100,
        source: "destatis",
      });
      // Mineralwolle base 2020: ~35 EUR/m²
      result.set("insulation_mw", {
        price_eur: Math.round((35 * daemmIndex) / 100 * 100) / 100,
        source: "destatis",
      });
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
 * Fetch steel price indices from Destatis GENESIS table 61241-0004.
 * Erzeugerpreisindex for Betonstahl (rebar) and Formstahl (beams).
 * Free API, guest access (GAST/GAST).
 *
 * Returns index-based EUR prices using 2020 base prices.
 */
export async function fetchDestatisSteelPrices(): Promise<Map<string, PricePoint>> {
  const result = new Map<string, PricePoint>();

  try {
    const currentYear = new Date().getFullYear();
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15_000);

    const url = new URL(
      "https://www-genesis.destatis.de/genesisWS/rest/2020/data/tablefile"
    );
    url.searchParams.set("username", process.env.DESTATIS_USER || "GAST");
    url.searchParams.set("password", process.env.DESTATIS_PASSWORD || "GAST");
    url.searchParams.set("name", "61241-0004");
    url.searchParams.set("area", "all");
    url.searchParams.set("compress", "false");
    url.searchParams.set("startyear", String(currentYear - 1));
    url.searchParams.set("endyear", String(currentYear));
    url.searchParams.set("language", "de");
    url.searchParams.set("format", "ffcsv");

    const res = await fetch(url.toString(), { signal: controller.signal });
    clearTimeout(timeout);

    if (!res.ok) {
      throw new Error(`Destatis steel returned ${res.status}`);
    }

    const csvText = await res.text();
    const indices = parseSteelCSV(csvText);

    // Base prices (2020=100) for index→EUR conversion
    const basePrices: Record<string, { base_eur: number; code: string }> = {
      betonstahl: { base_eur: 620, code: "steel_rebar" },
      formstahl: { base_eur: 900, code: "steel_beam" },
    };

    for (const [keyword, config] of Object.entries(basePrices)) {
      const index = indices.get(keyword);
      if (index && index > 0) {
        result.set(config.code, {
          price_eur: Math.round((config.base_eur * index) / 100 * 100) / 100,
          source: "destatis",
        });
      }
    }
  } catch (err: any) {
    console.error("[data-sources] Destatis steel fetch failed:", err.message);
  }

  return result;
}

/** Parse Destatis 61241-0004 CSV for steel keywords. */
function parseSteelCSV(csv: string): Map<string, number> {
  const indices = new Map<string, number>();
  const lines = csv.split("\n");

  for (const line of lines) {
    if (!line.trim() || line.startsWith('"')) continue;
    const parts = line.split(";");
    if (parts.length < 4) continue;

    const lastValue = parts[parts.length - 1]?.trim().replace(",", ".");
    const numValue = parseFloat(lastValue);
    if (isNaN(numValue)) continue;

    const rowText = parts.join(" ").toLowerCase();
    if (rowText.includes("betonstahl") || rowText.includes("betonstahlmatten")) {
      indices.set("betonstahl", numValue);
    } else if (rowText.includes("formstahl") || rowText.includes("profilstahl")) {
      indices.set("formstahl", numValue);
    }
  }

  return indices;
}

/**
 * Fetch wood/timber price indices from Destatis GENESIS table 61231-0001.
 * Erzeugerpreisindex Holzeinschlag — upstream timber prices.
 * Free API, guest access.
 */
export async function fetchDestatisWoodPrices(): Promise<Map<string, PricePoint>> {
  const result = new Map<string, PricePoint>();

  try {
    const currentYear = new Date().getFullYear();
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15_000);

    const url = new URL(
      "https://www-genesis.destatis.de/genesisWS/rest/2020/data/tablefile"
    );
    url.searchParams.set("username", process.env.DESTATIS_USER || "GAST");
    url.searchParams.set("password", process.env.DESTATIS_PASSWORD || "GAST");
    url.searchParams.set("name", "61231-0001");
    url.searchParams.set("area", "all");
    url.searchParams.set("compress", "false");
    url.searchParams.set("startyear", String(currentYear - 1));
    url.searchParams.set("endyear", String(currentYear));
    url.searchParams.set("language", "de");
    url.searchParams.set("format", "ffcsv");

    const res = await fetch(url.toString(), { signal: controller.signal });
    clearTimeout(timeout);

    if (!res.ok) {
      throw new Error(`Destatis wood returned ${res.status}`);
    }

    const csvText = await res.text();
    const lines = csvText.split("\n");
    let latestIndex = 0;

    // Find the latest Nadelstammholz (conifer timber) index — proxy for KVH/BSH
    for (const line of lines) {
      if (!line.trim() || line.startsWith('"')) continue;
      const parts = line.split(";");
      if (parts.length < 4) continue;

      const lastValue = parts[parts.length - 1]?.trim().replace(",", ".");
      const numValue = parseFloat(lastValue);
      if (isNaN(numValue)) continue;

      const rowText = parts.join(" ").toLowerCase();
      if (rowText.includes("nadelstammholz") || rowText.includes("fichtenstammholz")) {
        latestIndex = numValue;
      }
    }

    if (latestIndex > 0) {
      // KVH base 2020: ~280 EUR/m³
      result.set("wood_kvh", {
        price_eur: Math.round((280 * latestIndex) / 100 * 100) / 100,
        source: "destatis",
      });
      // BSH base 2020: ~400 EUR/m³ (higher due to lamination process)
      result.set("wood_bsh", {
        price_eur: Math.round((400 * latestIndex) / 100 * 100) / 100,
        source: "destatis",
      });
      // OSB correlates with timber index, base 2020: ~10.50 EUR/m²
      result.set("wood_osb", {
        price_eur: Math.round((10.5 * latestIndex) / 100 * 100) / 100,
        source: "destatis",
      });
    }
  } catch (err: any) {
    console.error("[data-sources] Destatis wood fetch failed:", err.message);
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
