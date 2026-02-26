import { describe, it, expect } from "vitest";
import { computeBaseline } from "../forecast-baseline";

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
