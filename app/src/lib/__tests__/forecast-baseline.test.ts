import { describe, it, expect } from "vitest";
import { computeBaseline, computePriceChangePct } from "../forecast-baseline";

describe("computeBaseline", () => {
  it("returns zeros for empty prices", () => {
    const result = computeBaseline([]);
    expect(result.ma7).toBe(0);
    expect(result.forecast7d).toBe(0);
    expect(result.confidence).toBe(0);
  });

  it("handles single price point", () => {
    const result = computeBaseline([{ price_eur: 100, timestamp: "2026-02-26" }]);
    expect(result.ma7).toBe(100);
    expect(result.forecast7d).toBeGreaterThan(0);
    expect(result.confidence).toBe(20);
  });

  it("computes moving averages correctly", () => {
    const prices = Array.from({ length: 10 }, (_, i) => ({
      price_eur: 100 + i, // 100, 101, ..., 109
      timestamp: `2026-02-${26 - i}`,
    }));
    const result = computeBaseline(prices);
    // MA7 = avg of first 7 elements: (100+101+102+103+104+105+106)/7 = 103
    expect(result.ma7).toBe(103);
  });

  it("detects rising trend via positive slope", () => {
    // Prices rising: oldest=50, newest=100
    const prices = Array.from({ length: 30 }, (_, i) => ({
      price_eur: 100 - i * 1.5, // newest=100, oldest~55
      timestamp: `2026-02-${26 - i}`,
    }));
    const result = computeBaseline(prices);
    expect(result.regression.slope).toBeGreaterThan(0);
    expect(result.forecast30d).toBeGreaterThan(result.forecast7d);
  });

  it("increases confidence with more data points", () => {
    const few = computeBaseline([
      { price_eur: 100, timestamp: "2026-02-26" },
      { price_eur: 101, timestamp: "2026-02-25" },
    ]);
    const many = computeBaseline(
      Array.from({ length: 60 }, (_, i) => ({
        price_eur: 100 + i * 0.1,
        timestamp: `2026-02-${26 - i}`,
      }))
    );
    expect(many.confidence).toBeGreaterThan(few.confidence);
  });

  it("ensures forecasts are positive", () => {
    // Even with falling prices, forecasts should not go negative
    const prices = Array.from({ length: 30 }, (_, i) => ({
      price_eur: Math.max(1, 50 - i * 5), // Dropping fast
      timestamp: `2026-02-${26 - i}`,
    }));
    const result = computeBaseline(prices);
    expect(result.forecast7d).toBeGreaterThan(0);
    expect(result.forecast30d).toBeGreaterThan(0);
    expect(result.forecast90d).toBeGreaterThan(0);
  });
});

describe("computePriceChangePct", () => {
  // Helper: generate prices sorted DESC (newest first)
  function makePrices(entries: Array<[number, string]>) {
    return entries.map(([price, ts]) => ({ price_eur: price, timestamp: ts }));
  }

  it("returns null for empty array", () => {
    expect(computePriceChangePct([], 7)).toBeNull();
  });

  it("returns null for single price point", () => {
    const prices = makePrices([[100, "2026-03-27T12:00:00Z"]]);
    expect(computePriceChangePct(prices, 7)).toBeNull();
  });

  it("calculates correct 7d change with different prices", () => {
    const prices = makePrices([
      [110, "2026-03-27T12:00:00Z"], // latest
      [105, "2026-03-25T12:00:00Z"],
      [100, "2026-03-20T12:00:00Z"], // ~7 days ago
      [95,  "2026-03-15T12:00:00Z"],
    ]);
    // 7d ago: 2026-03-20 → price 100
    // change: (110 - 100) / 100 * 100 = 10.00%
    expect(computePriceChangePct(prices, 7)).toBe(10);
  });

  it("returns 0 when all prices are identical (Eurostat monthly)", () => {
    const prices = makePrices([
      [786.78, "2026-03-27T12:00:00Z"],
      [786.78, "2026-03-27T06:00:00Z"],
      [786.78, "2026-03-26T12:00:00Z"],
      [786.78, "2026-03-20T12:00:00Z"],
      [786.78, "2026-03-15T12:00:00Z"],
    ]);
    expect(computePriceChangePct(prices, 7)).toBe(0);
  });

  it("calculates negative change correctly", () => {
    const prices = makePrices([
      [90,  "2026-03-27T12:00:00Z"],
      [100, "2026-03-20T12:00:00Z"],
    ]);
    expect(computePriceChangePct(prices, 7)).toBe(-10);
  });

  it("returns null when no price within 24h tolerance of target", () => {
    const prices = makePrices([
      [110, "2026-03-27T12:00:00Z"],
      [100, "2026-03-10T12:00:00Z"], // 17 days ago, not within ±24h of 7d target
    ]);
    // Target: Mar 20. Nearest: Mar 10 (10 days away) > 24h tolerance
    expect(computePriceChangePct(prices, 7)).toBeNull();
  });

  it("finds nearest price within ±24h tolerance", () => {
    const prices = makePrices([
      [110, "2026-03-27T12:00:00Z"],
      [102, "2026-03-21T06:00:00Z"], // 6h18m off from exactly 7d ago — within tolerance
      [100, "2026-03-19T12:00:00Z"],
    ]);
    // Target: Mar 20 12:00. Nearest: Mar 21 06:00 (18h off) → within ±24h
    // change: (110 - 102) / 102 * 100 = 7.84%
    expect(computePriceChangePct(prices, 7)).toBeCloseTo(7.84, 1);
  });

  it("handles 30d change calculation", () => {
    const prices = makePrices([
      [120, "2026-03-27T12:00:00Z"],
      [100, "2026-02-25T12:00:00Z"], // ~30 days ago
    ]);
    expect(computePriceChangePct(prices, 30)).toBe(20);
  });

  it("returns null when old price is 0", () => {
    const prices = makePrices([
      [100, "2026-03-27T12:00:00Z"],
      [0,   "2026-03-20T12:00:00Z"],
    ]);
    expect(computePriceChangePct(prices, 7)).toBeNull();
  });
});
