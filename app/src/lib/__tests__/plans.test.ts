import { describe, it, expect } from "vitest";
import { PLAN_LIMITS, PLAN_PRICES, applyPlanToOrg } from "../plans";

describe("PLAN_LIMITS", () => {
  it("trial has Pro-level access (not Team)", () => {
    const trial = PLAN_LIMITS.trial;
    expect(trial.materials).toBe(99);
    expect(trial.users).toBe(1);
    expect(trial.alerts).toBe(999);
    expect(trial.telegram).toBe(true);
    expect(trial.forecast).toBe(true);
    expect(trial.api).toBe(false);
    expect(trial.pdf).toBe(false);
  });

  it("basis has restricted features", () => {
    const basis = PLAN_LIMITS.basis;
    expect(basis.materials).toBe(5);
    expect(basis.users).toBe(1);
    expect(basis.alerts).toBe(3);
    expect(basis.telegram).toBe(false);
    expect(basis.forecast).toBe(false);
    expect(basis.api).toBe(false);
    expect(basis.pdf).toBe(false);
  });

  it("pro has telegram and forecast but no api/pdf", () => {
    const pro = PLAN_LIMITS.pro;
    expect(pro.materials).toBe(99);
    expect(pro.telegram).toBe(true);
    expect(pro.forecast).toBe(true);
    expect(pro.api).toBe(false);
    expect(pro.pdf).toBe(false);
  });

  it("team has all features", () => {
    const team = PLAN_LIMITS.team;
    expect(team.materials).toBe(99);
    expect(team.users).toBe(5);
    expect(team.alerts).toBe(999);
    expect(team.telegram).toBe(true);
    expect(team.forecast).toBe(true);
    expect(team.api).toBe(true);
    expect(team.pdf).toBe(true);
  });
});

describe("PLAN_PRICES", () => {
  it("basis is €49/month, €470/year", () => {
    expect(PLAN_PRICES.basis.monthly).toBe(49);
    expect(PLAN_PRICES.basis.yearly).toBe(470);
  });

  it("pro is €149/month, €1430/year", () => {
    expect(PLAN_PRICES.pro.monthly).toBe(149);
    expect(PLAN_PRICES.pro.yearly).toBe(1430);
  });

  it("team is €299/month, €2870/year", () => {
    expect(PLAN_PRICES.team.monthly).toBe(299);
    expect(PLAN_PRICES.team.yearly).toBe(2870);
  });
});

describe("applyPlanToOrg", () => {
  it("returns correct trial org fields", () => {
    const result = applyPlanToOrg("trial");
    expect(result.plan).toBe("trial");
    expect(result.max_materials).toBe(99);
    expect(result.max_users).toBe(1);
    expect(result.features_telegram).toBe(true);
    expect(result.features_forecast).toBe(true);
    expect(result.features_api).toBe(false);
    expect(result.features_pdf_reports).toBe(false);
  });

  it("falls back to basis for unknown plan", () => {
    const result = applyPlanToOrg("nonexistent");
    expect(result.plan).toBe("nonexistent");
    expect(result.max_materials).toBe(5);
    expect(result.max_users).toBe(1);
    expect(result.max_alerts).toBe(3);
  });
});
