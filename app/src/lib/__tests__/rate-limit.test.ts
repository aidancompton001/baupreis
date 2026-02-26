import { describe, it, expect } from "vitest";
import { checkRateLimit } from "../rate-limit";

describe("checkRateLimit", () => {
  it("allows requests within limit", () => {
    const key = `test-allow-${Date.now()}`;
    expect(checkRateLimit(key, 3, 60_000)).toBe(true);
    expect(checkRateLimit(key, 3, 60_000)).toBe(true);
    expect(checkRateLimit(key, 3, 60_000)).toBe(true);
  });

  it("blocks requests exceeding limit", () => {
    const key = `test-block-${Date.now()}`;
    expect(checkRateLimit(key, 2, 60_000)).toBe(true);
    expect(checkRateLimit(key, 2, 60_000)).toBe(true);
    expect(checkRateLimit(key, 2, 60_000)).toBe(false);
  });

  it("different keys are independent", () => {
    const key1 = `test-a-${Date.now()}`;
    const key2 = `test-b-${Date.now()}`;
    expect(checkRateLimit(key1, 1, 60_000)).toBe(true);
    expect(checkRateLimit(key1, 1, 60_000)).toBe(false);
    expect(checkRateLimit(key2, 1, 60_000)).toBe(true);
  });
});
