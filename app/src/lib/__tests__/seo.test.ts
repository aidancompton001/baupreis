import { describe, it, expect } from "vitest";
import de from "@/i18n/de";
import en from "@/i18n/en";
import ru from "@/i18n/ru";

/* ─── Trial period consistency: must be 14 everywhere ─── */

const TRIAL_KEYS = [
  "meta.description",
  "onboarding.trialStart",
  "onboarding.setupHint",
  "onboarding.planValue",
  "landing.ctaTrial",
  "landing.step1Text",
  "landing.ctaBottomText",
  "pricing.subtitle",
  "pricing.trialDays",
];

describe("Trial period = 14 days (business plan requirement)", () => {
  it.each(TRIAL_KEYS)("de[%s] contains '14' and NOT '7 Tage kostenlos'", (key) => {
    const val = de[key];
    expect(val).toBeDefined();
    expect(val).toMatch(/14/);
    expect(val).not.toMatch(/7 Tage kostenlos/);
  });

  it.each(TRIAL_KEYS.filter((k) => k !== "landing.ctaTrial"))(
    "en[%s] contains '14' and NOT '7 days free'",
    (key) => {
      const val = en[key];
      expect(val).toBeDefined();
      expect(val).toMatch(/14/);
      expect(val).not.toMatch(/7 days free/);
    }
  );

  it("ru trial keys contain '14' and NOT '7 дней бесплатно'", () => {
    const ruTrialKeys = [
      "meta.description",
      "onboarding.trialStart",
      "onboarding.setupHint",
      "onboarding.planValue",
      "landing.ctaTrial",
      "landing.step1Text",
      "landing.ctaBottomText",
      "pricing.subtitle",
      "pricing.trialDays",
    ];
    for (const key of ruTrialKeys) {
      const val = ru[key];
      expect(val, `ru[${key}]`).toBeDefined();
      expect(val, `ru[${key}] should contain '14'`).toMatch(/14/);
      expect(val, `ru[${key}] should NOT contain '7 дней бесплатно'`).not.toMatch(
        /7 дней бесплатно/
      );
    }
  });
});

/* ─── No €1 pricing anywhere in marketing copy ─── */

describe("No €1/month pricing (minimum is €49)", () => {
  const marketingKeys = [
    "meta.description",
    "landing.ctaSubline",
  ];

  it("de has no '€1/Monat'", () => {
    for (const key of marketingKeys) {
      if (de[key]) {
        expect(de[key]).not.toMatch(/€1\/Monat/);
      }
    }
  });

  it("en has no '€1/month'", () => {
    for (const key of marketingKeys) {
      if (en[key]) {
        expect(en[key]).not.toMatch(/€1\/month/i);
      }
    }
  });

  it("ru has no '€1/мес'", () => {
    for (const key of marketingKeys) {
      if (ru[key]) {
        expect(ru[key]).not.toMatch(/€1\/мес/);
      }
    }
  });
});

/* ─── Page-specific SEO metadata keys exist ─── */

const SEO_PAGES = ["preise", "ueberuns", "kontakt", "blog", "impressum", "agb", "datenschutz"];

describe("Page-specific SEO metadata keys", () => {
  it.each(SEO_PAGES)("de has meta.%s.title and meta.%s.description", (page) => {
    expect(de[`meta.${page}.title`]).toBeDefined();
    expect(de[`meta.${page}.title`].length).toBeGreaterThan(5);
    expect(de[`meta.${page}.description`]).toBeDefined();
    expect(de[`meta.${page}.description`].length).toBeGreaterThan(20);
  });

  it.each(SEO_PAGES)("en has meta.%s.title and meta.%s.description", (page) => {
    expect(en[`meta.${page}.title`]).toBeDefined();
    expect(en[`meta.${page}.description`]).toBeDefined();
  });

  it.each(SEO_PAGES)("ru has meta.%s.title and meta.%s.description", (page) => {
    expect(ru[`meta.${page}.title`]).toBeDefined();
    expect(ru[`meta.${page}.description`]).toBeDefined();
  });
});

/* ─── Title length ≤ 60 chars (Google truncates at ~60) ─── */

describe("Title tag length ≤ 60 characters", () => {
  it("de root title ≤ 60 chars", () => {
    expect(de["meta.title"].length).toBeLessThanOrEqual(60);
  });

  it.each(SEO_PAGES)("de meta.%s.title ≤ 60 chars", (page) => {
    expect(de[`meta.${page}.title`].length).toBeLessThanOrEqual(60);
  });
});

/* ─── Description length between 120-160 chars ─── */

describe("Meta description length 50-160 characters", () => {
  it("de root description 50-160 chars", () => {
    const len = de["meta.description"].length;
    expect(len).toBeGreaterThanOrEqual(50);
    expect(len).toBeLessThanOrEqual(160);
  });
});
