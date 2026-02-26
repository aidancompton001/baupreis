/**
 * Statistical baseline forecasts — used before/alongside LLM predictions.
 * Provides moving averages and simple linear regression.
 */

interface PricePoint {
  price_eur: number;
  timestamp: string;
}

/** Simple moving average over last N data points. */
function movingAverage(prices: PricePoint[], window: number): number {
  const slice = prices.slice(0, window);
  if (slice.length === 0) return 0;
  return slice.reduce((sum, p) => sum + p.price_eur, 0) / slice.length;
}

/** Simple linear regression: y = slope * x + intercept.
 *  x = day index (0 = oldest), y = price.
 *  Returns slope (EUR/day), intercept, r² (coefficient of determination). */
function linearRegression(prices: PricePoint[]): {
  slope: number;
  intercept: number;
  r2: number;
} {
  if (prices.length < 2) return { slope: 0, intercept: prices[0]?.price_eur || 0, r2: 0 };

  // Reverse so index 0 = oldest
  const sorted = [...prices].reverse();
  const n = sorted.length;
  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0, sumY2 = 0;

  for (let i = 0; i < n; i++) {
    const x = i;
    const y = sorted[i].price_eur;
    sumX += x;
    sumY += y;
    sumXY += x * y;
    sumX2 += x * x;
    sumY2 += y * y;
  }

  const denom = n * sumX2 - sumX * sumX;
  if (denom === 0) return { slope: 0, intercept: sumY / n, r2: 0 };

  const slope = (n * sumXY - sumX * sumY) / denom;
  const intercept = (sumY - slope * sumX) / n;

  // R²
  const yMean = sumY / n;
  let ssTot = 0, ssRes = 0;
  for (let i = 0; i < n; i++) {
    const yPred = slope * i + intercept;
    ssTot += (sorted[i].price_eur - yMean) ** 2;
    ssRes += (sorted[i].price_eur - yPred) ** 2;
  }
  const r2 = ssTot > 0 ? 1 - ssRes / ssTot : 0;

  return { slope, intercept, r2 };
}

/** Compute statistical baseline for a single material. */
export function computeBaseline(prices: PricePoint[]): {
  ma7: number;
  ma30: number;
  regression: { slope: number; r2: number };
  forecast7d: number;
  forecast30d: number;
  forecast90d: number;
  confidence: number;
} {
  if (prices.length === 0) {
    return { ma7: 0, ma30: 0, regression: { slope: 0, r2: 0 }, forecast7d: 0, forecast30d: 0, forecast90d: 0, confidence: 0 };
  }

  const latest = prices[0].price_eur;
  const ma7 = movingAverage(prices, 7);
  const ma30 = movingAverage(prices, 30);
  const reg = linearRegression(prices);

  // Forecast: extrapolate from latest data point using regression slope
  const n = prices.length;
  const forecast7d = Math.round((reg.slope * (n + 7) + reg.intercept) * 100) / 100;
  const forecast30d = Math.round((reg.slope * (n + 30) + reg.intercept) * 100) / 100;
  const forecast90d = Math.round((reg.slope * (n + 90) + reg.intercept) * 100) / 100;

  // Ensure forecasts are positive
  const safeForecast = (v: number) => Math.max(v, latest * 0.5);

  // Confidence based on data quantity and regression fit
  let confidence = 20;
  if (prices.length >= 7) confidence += 10;
  if (prices.length >= 30) confidence += 15;
  if (prices.length >= 60) confidence += 10;
  if (reg.r2 > 0.5) confidence += 10;
  if (reg.r2 > 0.8) confidence += 10;
  confidence = Math.min(confidence, 75); // Statistical baseline capped at 75

  return {
    ma7: Math.round(ma7 * 100) / 100,
    ma30: Math.round(ma30 * 100) / 100,
    regression: { slope: Math.round(reg.slope * 1000) / 1000, r2: Math.round(reg.r2 * 100) / 100 },
    forecast7d: safeForecast(forecast7d),
    forecast30d: safeForecast(forecast30d),
    forecast90d: safeForecast(forecast90d),
    confidence,
  };
}
