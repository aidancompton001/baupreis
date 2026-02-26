import { describe, it, expect, vi } from "vitest";
import { logger } from "../logger";

describe("logger", () => {
  it("outputs structured JSON for info", () => {
    const spy = vi.spyOn(console, "log").mockImplementation(() => {});
    logger.info("test message", { key: "value" });
    expect(spy).toHaveBeenCalledOnce();
    const output = JSON.parse(spy.mock.calls[0][0] as string);
    expect(output.level).toBe("info");
    expect(output.message).toBe("test message");
    expect(output.key).toBe("value");
    expect(output.timestamp).toBeDefined();
    spy.mockRestore();
  });

  it("outputs to console.error for error level", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    logger.error("fail", { code: 500 });
    expect(spy).toHaveBeenCalledOnce();
    const output = JSON.parse(spy.mock.calls[0][0] as string);
    expect(output.level).toBe("error");
    expect(output.code).toBe(500);
    spy.mockRestore();
  });

  it("outputs to console.warn for warn level", () => {
    const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
    logger.warn("caution");
    expect(spy).toHaveBeenCalledOnce();
    spy.mockRestore();
  });
});
