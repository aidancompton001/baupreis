import { describe, it, expect } from "vitest";
import { generateCsrfToken, validateCsrfToken } from "../csrf";

describe("CSRF", () => {
  it("generates a token string", () => {
    const token = generateCsrfToken("test-session-id");
    expect(typeof token).toBe("string");
    expect(token.length).toBeGreaterThan(20);
  });

  it("validates a correct token", () => {
    const token = generateCsrfToken("test-session-id");
    expect(validateCsrfToken(token, "test-session-id")).toBe(true);
  });

  it("rejects a wrong token", () => {
    expect(validateCsrfToken("wrong-token", "test-session-id")).toBe(false);
  });

  it("rejects token for wrong session", () => {
    const token = generateCsrfToken("session-a");
    expect(validateCsrfToken(token, "session-b")).toBe(false);
  });

  it("rejects expired token (>1h)", () => {
    const token = generateCsrfToken("test-session-id", Date.now() - 3601_000);
    expect(validateCsrfToken(token, "test-session-id")).toBe(false);
  });

  it("rejects empty inputs", () => {
    expect(validateCsrfToken("", "session")).toBe(false);
    expect(validateCsrfToken("token", "")).toBe(false);
  });
});
