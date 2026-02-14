import pool from "./db";

// Category weights for BauPreis Index (base = 1000)
const CATEGORY_WEIGHTS: Record<string, number> = {
  steel: 0.25,
  metal: 0.15,
  concrete: 0.20,
  wood: 0.20,
  insulation: 0.10,
  energy: 0.10,
};

interface IndexResult {
  index_value: number;
  change_pct_1d: number | null;
  change_pct_7d: number | null;
  change_pct_30d: number | null;
  components_json: Record<string, { weight: number; ratio: number; materials: string[] }>;
}

/**
 * Calculate BauPreis Index for a given date.
 * Uses the ratio of current prices to baseline (earliest available) prices,
 * weighted by material category.
 *
 * Formula: Index(t) = 1000 × Σ(w_cat × avg(P_i(t) / P_i(base)))
 */
export async function calculateBaupreisIndex(
  targetDate: string
): Promise<IndexResult> {
  // Get baseline prices (earliest price per material)
  const baselineResult = await pool.query(
    `SELECT DISTINCT ON (m.id)
       m.id, m.code, m.category, p.price_eur
     FROM materials m
     JOIN prices p ON p.material_id = m.id
     WHERE m.is_active = true
     ORDER BY m.id, p.timestamp ASC`
  );

  // Get target-date prices (closest within ±7 days)
  const currentResult = await pool.query(
    `SELECT DISTINCT ON (m.id)
       m.id, m.code, m.category, m.name_de, p.price_eur
     FROM materials m
     JOIN prices p ON p.material_id = m.id
     WHERE m.is_active = true
       AND p.timestamp BETWEEN ($1::date - INTERVAL '7 days') AND ($1::date + INTERVAL '7 days')
     ORDER BY m.id, ABS(EXTRACT(EPOCH FROM (p.timestamp - $1::date))) ASC`,
    [targetDate]
  );

  const baselineMap = new Map<string, number>();
  const categoryMap = new Map<string, string>();
  for (const row of baselineResult.rows) {
    baselineMap.set(row.id, parseFloat(row.price_eur));
    categoryMap.set(row.id, row.category);
  }

  // Group ratios by category
  const categoryRatios: Record<string, { ratios: number[]; materials: string[] }> = {};
  for (const cat of Object.keys(CATEGORY_WEIGHTS)) {
    categoryRatios[cat] = { ratios: [], materials: [] };
  }

  for (const row of currentResult.rows) {
    const base = baselineMap.get(row.id);
    const cat = categoryMap.get(row.id);
    if (base && base > 0 && cat && categoryRatios[cat]) {
      categoryRatios[cat].ratios.push(parseFloat(row.price_eur) / base);
      categoryRatios[cat].materials.push(row.name_de);
    }
  }

  // Calculate weighted index
  let indexValue = 0;
  const components: Record<string, { weight: number; ratio: number; materials: string[] }> = {};

  for (const [cat, weight] of Object.entries(CATEGORY_WEIGHTS)) {
    const { ratios, materials } = categoryRatios[cat];
    const avgRatio = ratios.length > 0
      ? ratios.reduce((a, b) => a + b, 0) / ratios.length
      : 1.0;

    indexValue += weight * avgRatio;
    components[cat] = { weight, ratio: avgRatio, materials };
  }

  indexValue = Math.round(indexValue * 1000 * 100) / 100;

  // Get previous index values for change calculation
  const prevResult = await pool.query(
    `SELECT date, index_value FROM baupreis_index
     WHERE date IN (
       ($1::date - INTERVAL '1 day')::date,
       ($1::date - INTERVAL '7 days')::date,
       ($1::date - INTERVAL '30 days')::date
     )
     ORDER BY date`,
    [targetDate]
  );

  const prevMap = new Map<string, number>();
  for (const row of prevResult.rows) {
    const dateStr = new Date(row.date).toISOString().slice(0, 10);
    prevMap.set(dateStr, parseFloat(row.index_value));
  }

  const targetD = new Date(targetDate);
  function dateOffset(days: number): string {
    const d = new Date(targetD);
    d.setDate(d.getDate() - days);
    return d.toISOString().slice(0, 10);
  }

  function calcChange(days: number): number | null {
    const prev = prevMap.get(dateOffset(days));
    if (!prev || prev === 0) return null;
    return Math.round(((indexValue - prev) / prev) * 10000) / 100;
  }

  return {
    index_value: indexValue,
    change_pct_1d: calcChange(1),
    change_pct_7d: calcChange(7),
    change_pct_30d: calcChange(30),
    components_json: components,
  };
}
