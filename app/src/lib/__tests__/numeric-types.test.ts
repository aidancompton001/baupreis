/**
 * T012: Regression test for pg numeric → string type issue.
 * PostgreSQL DECIMAL(6,2) returns strings via node-postgres.
 * Ensures Number() conversion handles all edge cases.
 */
import { describe, it, expect } from "vitest";
import { formatPercent } from "../utils";

describe("T012: pg numeric string handling", () => {
  it("formatPercent handles string input from pg DECIMAL", () => {
    // pg returns "2.43" not 2.43
    expect(formatPercent("2.43")).toBe("+2.43%");
    expect(formatPercent("-3.20")).toBe("-3.20%");
    expect(formatPercent("0.00")).toBe("0.00%");
  });

  it("formatPercent handles actual numbers", () => {
    expect(formatPercent(2.43)).toBe("+2.43%");
    expect(formatPercent(-4.29)).toBe("-4.29%");
    expect(formatPercent(0)).toBe("0.00%");
  });

  it("Number() on pg numeric strings produces valid numbers for .toFixed()", () => {
    // This is the exact pattern that crashed: (value || 0).toFixed(1)
    // With string: ("2.43" || 0) = "2.43", "2.43".toFixed → TypeError
    // Fix: Number(value || 0).toFixed(1)
    const pgString = "2.43";
    expect(() => Number(pgString || 0).toFixed(1)).not.toThrow();
    expect(Number(pgString || 0).toFixed(1)).toBe("2.4");
  });

  it("Number() on null/undefined pg values defaults to 0", () => {
    expect(Number(null || 0).toFixed(1)).toBe("0.0");
    expect(Number(undefined || 0).toFixed(1)).toBe("0.0");
  });

  it("string comparison with > 0 works after Number() conversion", () => {
    // Bug: "2.43" > 0 is true in JS (coercion), but "-3.20" > 0 is false
    // This happens to work, but Number() makes it explicit
    const positive = "2.43";
    const negative = "-3.20";
    const zero = "0.00";

    expect(Number(positive) > 0).toBe(true);
    expect(Number(negative) > 0).toBe(false);
    expect(Number(negative) < 0).toBe(true);
    expect(Number(zero) > 0).toBe(false);
    expect(Number(zero) < 0).toBe(false);
  });

  it("API-level conversion: simulates row mapping with Number()", () => {
    // Simulates what /api/analysis/route.ts now does
    const pgRow = {
      change_pct_7d: "1.50",
      change_pct_30d: "-2.80",
    };

    const converted = {
      ...pgRow,
      change_pct_7d: pgRow.change_pct_7d != null ? Number(pgRow.change_pct_7d) : null,
      change_pct_30d: pgRow.change_pct_30d != null ? Number(pgRow.change_pct_30d) : null,
    };

    expect(typeof converted.change_pct_7d).toBe("number");
    expect(typeof converted.change_pct_30d).toBe("number");
    expect(converted.change_pct_7d).toBe(1.5);
    expect(converted.change_pct_30d).toBe(-2.8);
    expect(() => converted.change_pct_30d!.toFixed(1)).not.toThrow();
  });
});
