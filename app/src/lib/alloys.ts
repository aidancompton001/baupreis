// =============================================================================
// Alloy Price Calculator — Production-Grade Engine
// Data verified: Feb 2026 | Sources: EN/DIN standards, LME, Fastmarkets
// =============================================================================

// --- Types -------------------------------------------------------------------

export type AlloyCategory =
  | "stainless_steel"
  | "copper_alloy"
  | "aluminum_alloy"
  | "structural_steel";

export type ProductForm =
  | "blech"       // Sheet/plate
  | "stabstahl"   // Bar/rod
  | "blankstahl"  // Bright steel
  | "rohr_geschweisst" // Welded tube
  | "rohr_nahtlos"     // Seamless tube
  | "profil"      // Profile/section
  | "draht"       // Wire
  | "guss";       // Casting

export interface Alloy {
  code: string;
  werkstoffNr: string;
  din: string;
  aisi?: string;
  category: AlloyCategory;
  nameDE: string;
  nameEN: string;
  nameRU: string;
  /** Element fractions (midpoint of standard range), must sum to ~1.0 */
  composition: Record<string, number>;
  pricingMethod: "legierungszuschlag" | "weighted" | "scrap_based";
  /** Processing cost multiplier range per default product form */
  processingMultiplier: { min: number; max: number; default: number };
  standard: string;
}

export interface BaseMetal {
  symbol: string;
  nameDE: string;
  nameEN: string;
  priceEurPerTonne: number;
  source: string;
  lastVerified: string;
  notes: string;
}

export interface PriceResult {
  alloy: Alloy;
  productForm: ProductForm;
  weightKg: number;
  metallwert: number;           // Raw metal value EUR/t
  elementBreakdown: Array<{ element: string; fraction: number; pricePerTonne: number; contribution: number }>;
  processingMultiplier: number;
  totalPerTonneMin: number;
  totalPerTonneMax: number;
  totalPerTonneDefault: number;
  totalForWeight: number;
  // Stainless-specific
  legierungszuschlag?: number;
  basispreis?: { min: number; max: number };
  publishedLZ?: number;
  // Carbon steel-specific
  scrapBasis?: number;
  disclaimer: string;
}

// --- Reference Prices (Verified Feb 2026) ------------------------------------
// Sources: LME, Fastmarkets, Westmetall, TradingEconomics
// CRITICAL: These are STATIC fallback prices. In production, fetch live from metals.dev API.

export const LAST_PRICE_UPDATE = "2026-02";

export const BASE_METALS: Record<string, BaseMetal> = {
  Cu: {
    symbol: "Cu",
    nameDE: "Kupfer",
    nameEN: "Copper",
    priceEurPerTonne: 10_850,
    source: "LME spot",
    lastVerified: "2026-02-23",
    notes: "LME cash settlement, ~12,785 USD/t at 1.178 EUR/USD",
  },
  Al: {
    symbol: "Al",
    nameDE: "Aluminium",
    nameEN: "Aluminum",
    priceEurPerTonne: 2_636,
    source: "LME spot",
    lastVerified: "2026-02-20",
    notes: "LME cash settlement, ~3,106 USD/t",
  },
  Zn: {
    symbol: "Zn",
    nameDE: "Zink",
    nameEN: "Zinc",
    priceEurPerTonne: 2_867,
    source: "LME 3-month",
    lastVerified: "2026-02-20",
    notes: "LME 3-month futures, ~3,378 USD/t",
  },
  Ni: {
    symbol: "Ni",
    nameDE: "Nickel",
    nameEN: "Nickel",
    priceEurPerTonne: 14_720,
    source: "LME 3-month",
    lastVerified: "2026-02-20",
    notes: "LME 3-month futures, ~17,343 USD/t",
  },
  Sn: {
    symbol: "Sn",
    nameDE: "Zinn",
    nameEN: "Tin",
    priceEurPerTonne: 41_670,
    source: "LME futures",
    lastVerified: "2026-02-09",
    notes: "Highly volatile (range 39,500-48,200). ~49,100 USD/t. AI/solder demand driven.",
  },
  Pb: {
    symbol: "Pb",
    nameDE: "Blei",
    nameEN: "Lead",
    priceEurPerTonne: 1_659,
    source: "LME 3-month",
    lastVerified: "2026-02-20",
    notes: "~1,954 USD/t",
  },
  Fe: {
    symbol: "Fe",
    nameDE: "Eisen (Schrott)",
    nameEN: "Iron (Scrap)",
    priceEurPerTonne: 305,
    source: "Ex-works Germany",
    lastVerified: "2026-02-13",
    notes: "HMS 1&2 steel scrap, ex-works Germany. Up 13% vs end 2025.",
  },
  Cr: {
    symbol: "Cr",
    nameDE: "Chrom (FeCr 65%)",
    nameEN: "Chromium (FeCr 65%)",
    priceEurPerTonne: 2_077,
    source: "Fastmarkets / BSSA",
    lastVerified: "2026-02",
    notes: "FeCr HC 65% Cr at ~1,350 EUR/t alloy. Per tonne Cr content: 1,350/0.65 = 2,077 EUR/t. LZ benchmark: 2,901 EUR/t (155 USc/lb).",
  },
  Mo: {
    symbol: "Mo",
    nameDE: "Molybdaen (FeMo 65%)",
    nameEN: "Molybdenum (FeMo 65%)",
    priceEurPerTonne: 37_385,
    source: "Fastmarkets Rotterdam",
    lastVerified: "2026-01",
    notes: "FeMo 65% Mo, ~24,300 EUR/t alloy. Per tonne Mo content: 24,300/0.65 = 37,385 EUR/t.",
  },
  Mn: {
    symbol: "Mn",
    nameDE: "Mangan (FeMn 78%)",
    nameEN: "Manganese (FeMn 78%)",
    priceEurPerTonne: 1_333,
    source: "Fastmarkets DDP NW EU",
    lastVerified: "2026-02",
    notes: "HC FeMn 78% Mn at ~1,040 EUR/t alloy. Per tonne Mn content: 1,040/0.78 = 1,333 EUR/t.",
  },
  Si: {
    symbol: "Si",
    nameDE: "Silizium (FeSi 75%)",
    nameEN: "Silicon (FeSi 75%)",
    priceEurPerTonne: 2_000,
    source: "Fastmarkets delivered Europe",
    lastVerified: "2026-02",
    notes: "FeSi 75% Si at ~1,500 EUR/t alloy. Per tonne Si content: 1,500/0.75 = 2,000 EUR/t.",
  },
  Mg: {
    symbol: "Mg",
    nameDE: "Magnesium",
    nameEN: "Magnesium",
    priceEurPerTonne: 2_800,
    source: "Estimated (Asian Metal)",
    lastVerified: "2026-02",
    notes: "Estimated. Chinese Mg was ~18,500 CNY/t. EUR price includes EU premium + CBAM.",
  },
  Ti: {
    symbol: "Ti",
    nameDE: "Titan",
    nameEN: "Titanium",
    priceEurPerTonne: 10_000,
    source: "Estimated (sponge)",
    lastVerified: "2026-02",
    notes: "Ti sponge ~10-12 USD/kg. Used only in trace amounts in 1.4571.",
  },
};

// --- Legierungszuschlag System -----------------------------------------------
// Reverse-engineered from published values. 99.7% accuracy for 1.4301.
// Reference values from Feb 1994 cartel agreement (EU Court T-48/98).

const LZ_REFERENCE_VALUES: Record<string, number> = {
  Ni: 3_750,  // ECU/t (1994)
  Cr: 777,    // ECU/t (1994)
  Mo: 5_532,  // ECU/t (1994)
};

/** Form factors for Legierungszuschlag calculation */
export const LZ_FORM_FACTORS: Record<ProductForm, number> = {
  blech: 1.50,
  stabstahl: 1.22,
  blankstahl: 1.30,
  rohr_geschweisst: 1.15,
  rohr_nahtlos: 1.20,
  profil: 1.18,
  draht: 1.35,
  guss: 1.40,
};

/** Published LZ values (Feb 2026) from legierungszuschlag.info */
const PUBLISHED_LZ: Record<string, Record<string, number>> = {
  "1.4301": {
    blech: 2_118,
    stabstahl: 1_730,
    blankstahl: 1_837,
    rohr_geschweisst: 1_625,
    rohr_nahtlos: 1_696,
    profil: 1_668,
    draht: 1_907,
    guss: 1_978,
  },
  "1.4404": {
    blech: 3_482,
    stabstahl: 2_844,
    blankstahl: 3_020,
    rohr_geschweisst: 2_672,
    rohr_nahtlos: 2_788,
    profil: 2_742,
    draht: 3_136,
    guss: 3_253,
  },
  "1.4571": {
    blech: 3_580,
    stabstahl: 2_924,
    blankstahl: 3_105,
    rohr_geschweisst: 2_747,
    rohr_nahtlos: 2_867,
    profil: 2_820,
    draht: 3_225,
    guss: 3_345,
  },
};

/** Stainless steel base prices (Basispreis) — typical German market */
const STAINLESS_BASE_PRICES: Record<string, { min: number; max: number }> = {
  "1.4301": { min: 1_800, max: 2_200 },
  "1.4404": { min: 2_200, max: 2_600 },
  "1.4571": { min: 2_400, max: 2_800 },
};

// --- Alloy Database ----------------------------------------------------------
// All compositions: midpoint values from EN/DIN standards.
// Fractions are decimal (0.185 = 18.5%).

export const ALLOYS: Alloy[] = [
  // ===== STAINLESS STEEL (EN 10088-1) ========================================
  {
    code: "1.4301",
    werkstoffNr: "1.4301",
    din: "X5CrNi18-10",
    aisi: "304",
    category: "stainless_steel",
    nameDE: "Edelstahl 1.4301 (V2A)",
    nameEN: "Stainless Steel 1.4301 (304)",
    nameRU: "Нержавейка 1.4301 (304)",
    composition: { Fe: 0.700, Cr: 0.185, Ni: 0.0925, Mn: 0.010, Si: 0.005, C: 0.0035 },
    pricingMethod: "legierungszuschlag",
    processingMultiplier: { min: 1.4, max: 1.8, default: 1.5 },
    standard: "EN 10088-1:2014",
  },
  {
    code: "1.4404",
    werkstoffNr: "1.4404",
    din: "X2CrNiMo17-12-2",
    aisi: "316L",
    category: "stainless_steel",
    nameDE: "Edelstahl 1.4404 (V4A)",
    nameEN: "Stainless Steel 1.4404 (316L)",
    nameRU: "Нержавейка 1.4404 (316L)",
    composition: { Fe: 0.655, Cr: 0.175, Ni: 0.115, Mo: 0.0225, Mn: 0.010, Si: 0.005, C: 0.0015 },
    pricingMethod: "legierungszuschlag",
    processingMultiplier: { min: 1.4, max: 1.8, default: 1.5 },
    standard: "EN 10088-1:2014",
  },
  {
    code: "1.4571",
    werkstoffNr: "1.4571",
    din: "X6CrNiMoTi17-12-2",
    category: "stainless_steel",
    nameDE: "Edelstahl 1.4571 (Ti-stabilisiert)",
    nameEN: "Stainless Steel 1.4571 (Ti-stabilized)",
    nameRU: "Нержавейка 1.4571 (Ti-стабилизированная)",
    composition: { Fe: 0.650, Cr: 0.175, Ni: 0.120, Mo: 0.0225, Ti: 0.004, Mn: 0.010, Si: 0.005, C: 0.004 },
    pricingMethod: "legierungszuschlag",
    processingMultiplier: { min: 1.4, max: 1.8, default: 1.5 },
    standard: "EN 10088-1:2014",
  },

  // ===== COPPER ALLOYS =======================================================
  {
    code: "CuZn37",
    werkstoffNr: "2.0321",
    din: "CuZn37",
    category: "copper_alloy",
    nameDE: "Messing Ms63 (CuZn37)",
    nameEN: "Brass Ms63 (CuZn37)",
    nameRU: "Латунь Ms63 (CuZn37)",
    composition: { Cu: 0.630, Zn: 0.370 },
    pricingMethod: "weighted",
    processingMultiplier: { min: 1.2, max: 1.5, default: 1.3 },
    standard: "EN 12163:2016",
  },
  {
    code: "CuZn39Pb3",
    werkstoffNr: "2.0401",
    din: "CuZn39Pb3",
    category: "copper_alloy",
    nameDE: "Automatenmessing Ms58 (CuZn39Pb3)",
    nameEN: "Free-cutting Brass Ms58 (CuZn39Pb3)",
    nameRU: "Автоматная латунь Ms58 (CuZn39Pb3)",
    composition: { Cu: 0.580, Zn: 0.388, Pb: 0.030, Fe: 0.002 },
    pricingMethod: "weighted",
    processingMultiplier: { min: 1.3, max: 1.6, default: 1.4 },
    standard: "EN 12164:2016",
  },
  {
    code: "CuSn8",
    werkstoffNr: "2.1030",
    din: "CuSn8",
    category: "copper_alloy",
    nameDE: "Zinnbronze CuSn8",
    nameEN: "Tin Bronze CuSn8",
    nameRU: "Оловянная бронза CuSn8",
    composition: { Cu: 0.915, Sn: 0.080, Zn: 0.002, Ni: 0.002 },
    pricingMethod: "weighted",
    processingMultiplier: { min: 1.5, max: 2.5, default: 1.8 },
    standard: "EN 1982:2017",
  },
  {
    code: "CuAl10Ni5Fe4",
    werkstoffNr: "2.0966",
    din: "CuAl10Ni5Fe4",
    category: "copper_alloy",
    nameDE: "Aluminiumbronze CuAl10Ni5Fe4",
    nameEN: "Aluminum Bronze CuAl10Ni5Fe4",
    nameRU: "Алюминиевая бронза CuAl10Ni5Fe4",
    composition: { Cu: 0.800, Al: 0.100, Ni: 0.050, Fe: 0.040, Mn: 0.010 },
    pricingMethod: "weighted",
    processingMultiplier: { min: 1.4, max: 2.0, default: 1.6 },
    standard: "EN 1982:2017",
  },

  // ===== ALUMINUM ALLOYS (EN 573-3) ==========================================
  {
    code: "EN AW-6060",
    werkstoffNr: "3.3206",
    din: "AlMgSi0.5",
    category: "aluminum_alloy",
    nameDE: "Aluminium 6060 (Profile)",
    nameEN: "Aluminum 6060 (Extrusions)",
    nameRU: "Алюминий 6060 (профили)",
    composition: { Al: 0.982, Mg: 0.005, Si: 0.005, Fe: 0.002, Mn: 0.001 },
    pricingMethod: "weighted",
    processingMultiplier: { min: 1.8, max: 3.0, default: 2.2 },
    standard: "EN 573-3:2019",
  },
  {
    code: "EN AW-5754",
    werkstoffNr: "3.3535",
    din: "AlMg3",
    category: "aluminum_alloy",
    nameDE: "Aluminium 5754 (Blech)",
    nameEN: "Aluminum 5754 (Sheet)",
    nameRU: "Алюминий 5754 (лист)",
    // CRITICAL FIX: Mg was 0.003 (0.3%) — correct is 0.031 (3.1%)
    composition: { Al: 0.953, Mg: 0.031, Mn: 0.003, Si: 0.002, Fe: 0.002 },
    pricingMethod: "weighted",
    processingMultiplier: { min: 1.5, max: 2.5, default: 1.8 },
    standard: "EN 573-3:2019",
  },
  {
    code: "EN AW-2024",
    werkstoffNr: "3.1355",
    din: "AlCuMg1",
    category: "aluminum_alloy",
    nameDE: "Aluminium 2024 (Hochfest)",
    nameEN: "Aluminum 2024 (High-strength)",
    nameRU: "Алюминий 2024 (высокопрочный)",
    // CRITICAL FIX: Mg was missing entirely — correct is 0.015 (1.5%)
    composition: { Al: 0.930, Cu: 0.044, Mg: 0.015, Mn: 0.006, Si: 0.003, Fe: 0.003 },
    pricingMethod: "weighted",
    processingMultiplier: { min: 2.5, max: 4.0, default: 3.0 },
    standard: "EN 573-3:2019",
  },

  // ===== STRUCTURAL STEEL (EN 10025-2) =======================================
  {
    code: "S235JR",
    werkstoffNr: "1.0038",
    din: "S235JR",
    category: "structural_steel",
    nameDE: "Baustahl S235JR",
    nameEN: "Structural Steel S235JR",
    nameRU: "Конструкционная сталь S235JR",
    composition: { Fe: 0.985, C: 0.0085, Mn: 0.007 },
    pricingMethod: "scrap_based",
    processingMultiplier: { min: 1.8, max: 2.5, default: 2.1 },
    standard: "EN 10025-2:2019",
  },
  {
    code: "S355J2",
    werkstoffNr: "1.0577",
    din: "S355J2",
    category: "structural_steel",
    nameDE: "Baustahl S355J2",
    nameEN: "Structural Steel S355J2",
    nameRU: "Конструкционная сталь S355J2",
    composition: { Fe: 0.980, C: 0.010, Mn: 0.008, Si: 0.003 },
    pricingMethod: "scrap_based",
    processingMultiplier: { min: 1.8, max: 2.5, default: 2.1 },
    standard: "EN 10025-2:2019",
  },
  {
    code: "C45",
    werkstoffNr: "1.0503",
    din: "C45",
    category: "structural_steel",
    nameDE: "Vergütungsstahl C45",
    nameEN: "Quenched & Tempered Steel C45",
    nameRU: "Улучшаемая сталь C45",
    composition: { Fe: 0.978, C: 0.0046, Mn: 0.0065, Si: 0.002 },
    pricingMethod: "scrap_based",
    processingMultiplier: { min: 2.0, max: 3.0, default: 2.3 },
    standard: "EN 10083-2:2006",
  },
];

// --- Product Form Labels -----------------------------------------------------

export const PRODUCT_FORM_LABELS: Record<ProductForm, { de: string; en: string; ru: string }> = {
  blech:             { de: "Blech / Platte", en: "Sheet / Plate", ru: "Лист / Плита" },
  stabstahl:         { de: "Stabstahl / Rundstahl", en: "Bar / Rod", ru: "Прутки / Круг" },
  blankstahl:        { de: "Blankstahl", en: "Bright Steel", ru: "Калиброванная сталь" },
  rohr_geschweisst:  { de: "Rohr geschweißt", en: "Welded Tube", ru: "Сварная труба" },
  rohr_nahtlos:      { de: "Rohr nahtlos", en: "Seamless Tube", ru: "Бесшовная труба" },
  profil:            { de: "Profil / Winkel", en: "Profile / Angle", ru: "Профиль / Уголок" },
  draht:             { de: "Draht", en: "Wire", ru: "Проволока" },
  guss:              { de: "Guss", en: "Casting", ru: "Литьё" },
};

// --- Default product forms per category --------------------------------------

export const DEFAULT_FORMS: Record<AlloyCategory, ProductForm[]> = {
  stainless_steel: ["blech", "stabstahl", "blankstahl", "rohr_geschweisst", "rohr_nahtlos", "profil", "draht"],
  copper_alloy: ["stabstahl", "blech", "rohr_nahtlos", "draht", "guss"],
  aluminum_alloy: ["profil", "blech", "stabstahl", "rohr_nahtlos", "draht"],
  structural_steel: ["blech", "stabstahl", "profil", "rohr_geschweisst"],
};

// --- Calculation Engine ------------------------------------------------------

/** Calculate raw metal value (Metallwert) in EUR/tonne */
function calcMetallwert(alloy: Alloy): {
  total: number;
  breakdown: Array<{ element: string; fraction: number; pricePerTonne: number; contribution: number }>;
} {
  const breakdown: Array<{ element: string; fraction: number; pricePerTonne: number; contribution: number }> = [];
  let total = 0;

  for (const [element, fraction] of Object.entries(alloy.composition)) {
    if (fraction < 0.0005) continue; // skip trace elements < 0.05%
    const metal = BASE_METALS[element];
    if (!metal) continue;

    const contribution = fraction * metal.priceEurPerTonne;
    total += contribution;
    breakdown.push({
      element,
      fraction,
      pricePerTonne: metal.priceEurPerTonne,
      contribution: Math.round(contribution),
    });
  }

  // Sort by contribution descending
  breakdown.sort((a, b) => b.contribution - a.contribution);

  return { total: Math.round(total), breakdown };
}

// LZ formula uses BSSA/Metal Bulletin benchmark prices, NOT ferroalloy prices.
// These differ from BASE_METALS because LZ benchmarks are per lb of pure element content.
const LZ_CURRENT_PRICES: Record<string, number> = {
  Ni: 14_720,  // LME 3-month, same as BASE_METALS
  Cr: 2_901,   // BSSA Q4 benchmark: 155 USc/lb Cr → $3,417/t ÷ 1.178 = 2,901 EUR/t
  Mo: 37_385,  // Same as BASE_METALS (per tonne Mo content)
};

/** Calculate Legierungszuschlag using reverse-engineered formula */
function calcLZ(alloy: Alloy, form: ProductForm): number {
  const formFactor = LZ_FORM_FACTORS[form] || 1.50;
  let lzSum = 0;

  for (const [element, refValue] of Object.entries(LZ_REFERENCE_VALUES)) {
    const fraction = alloy.composition[element] || 0;
    if (fraction <= 0) continue;

    const currentPrice = LZ_CURRENT_PRICES[element] || 0;
    const delta = Math.max(0, currentPrice - refValue);
    lzSum += delta * fraction;
  }

  return Math.round(lzSum * formFactor);
}

/** Get published LZ value (Feb 2026) if available */
function getPublishedLZ(code: string, form: ProductForm): number | undefined {
  return PUBLISHED_LZ[code]?.[form];
}

/** Main calculation function */
export function calculateAlloyPrice(
  alloyCode: string,
  productForm: ProductForm = "blech",
  weightKg: number = 1000
): PriceResult | null {
  const alloy = ALLOYS.find((a) => a.code === alloyCode);
  if (!alloy) return null;

  const { total: metallwert, breakdown } = calcMetallwert(alloy);

  let result: PriceResult;

  if (alloy.pricingMethod === "legierungszuschlag") {
    // Stainless steel: Basispreis + Legierungszuschlag
    const calculatedLZ = calcLZ(alloy, productForm);
    const publishedLZ = getPublishedLZ(alloy.code, productForm);
    // Prefer published LZ (more accurate), fall back to calculated
    const lz = publishedLZ || calculatedLZ;
    const basis = STAINLESS_BASE_PRICES[alloy.code] || { min: 2_000, max: 2_400 };

    const totalMin = basis.min + lz;
    const totalMax = basis.max + lz;
    const totalDefault = Math.round((totalMin + totalMax) / 2);

    result = {
      alloy,
      productForm,
      weightKg,
      metallwert,
      elementBreakdown: breakdown,
      processingMultiplier: 1, // Not used for LZ method
      totalPerTonneMin: totalMin,
      totalPerTonneMax: totalMax,
      totalPerTonneDefault: totalDefault,
      totalForWeight: Math.round((totalDefault / 1000) * weightKg),
      legierungszuschlag: lz,
      basispreis: basis,
      publishedLZ: publishedLZ,
      disclaimer: "stainless",
    };
  } else if (alloy.pricingMethod === "scrap_based") {
    // Carbon steel: Scrap-based pricing with actual composition breakdown
    const scrapPrice = BASE_METALS.Fe.priceEurPerTonne;
    const { total: metallwertCalc, breakdown: scrapBreakdown } = calcMetallwert(alloy);
    const { min, max, default: def } = alloy.processingMultiplier;

    const totalMin = Math.round(scrapPrice * min);
    const totalMax = Math.round(scrapPrice * max);
    const totalDefault = Math.round(scrapPrice * def);

    result = {
      alloy,
      productForm,
      weightKg,
      metallwert: metallwertCalc,
      elementBreakdown: scrapBreakdown,
      processingMultiplier: def,
      totalPerTonneMin: totalMin,
      totalPerTonneMax: totalMax,
      totalPerTonneDefault: totalDefault,
      totalForWeight: Math.round((totalDefault / 1000) * weightKg),
      scrapBasis: scrapPrice,
      disclaimer: "carbon_steel",
    };
  } else {
    // Copper / Aluminum: Weighted metal value
    const { min, max, default: def } = alloy.processingMultiplier;

    // Adjust multiplier based on product form
    const formAdjust = getFormAdjustment(productForm);
    const adjMin = min * formAdjust;
    const adjMax = max * formAdjust;
    const adjDef = def * formAdjust;

    const totalMin = Math.round(metallwert * adjMin);
    const totalMax = Math.round(metallwert * adjMax);
    const totalDefault = Math.round(metallwert * adjDef);

    result = {
      alloy,
      productForm,
      weightKg,
      metallwert,
      elementBreakdown: breakdown,
      processingMultiplier: adjDef,
      totalPerTonneMin: totalMin,
      totalPerTonneMax: totalMax,
      totalPerTonneDefault: totalDefault,
      totalForWeight: Math.round((totalDefault / 1000) * weightKg),
      disclaimer: "weighted",
    };
  }

  return result;
}

/** Product form adjustment for processing multiplier */
function getFormAdjustment(form: ProductForm): number {
  const adjustments: Record<ProductForm, number> = {
    blech: 1.0,
    stabstahl: 0.95,
    blankstahl: 1.05,
    rohr_geschweisst: 1.15,
    rohr_nahtlos: 1.30,
    profil: 1.10,
    draht: 1.20,
    guss: 1.25,
  };
  return adjustments[form] || 1.0;
}

/** Calculate price for a custom user-defined composition */
export function calculateCustomPrice(
  composition: Record<string, number>,
  name: string,
  productForm: ProductForm = "blech",
  weightKg: number = 1000
): PriceResult | null {
  // Build a virtual alloy
  const customAlloy: Alloy = {
    code: "custom",
    werkstoffNr: "custom",
    din: name,
    category: "copper_alloy",
    nameDE: name,
    nameEN: name,
    nameRU: name,
    composition,
    pricingMethod: "weighted",
    processingMultiplier: { min: 1.2, max: 1.8, default: 1.4 },
    standard: "Benutzerdefiniert",
  };

  // Use the weighted calculation
  const { total: metallwert, breakdown } = calcMetallwert(customAlloy);
  const formAdjust = getFormAdjustment(productForm);
  const { min, max, default: def } = customAlloy.processingMultiplier;
  const adjMin = min * formAdjust;
  const adjMax = max * formAdjust;
  const adjDef = def * formAdjust;

  return {
    alloy: customAlloy,
    productForm,
    weightKg,
    metallwert,
    elementBreakdown: breakdown,
    processingMultiplier: adjDef,
    totalPerTonneMin: Math.round(metallwert * adjMin),
    totalPerTonneMax: Math.round(metallwert * adjMax),
    totalPerTonneDefault: Math.round(metallwert * adjDef),
    totalForWeight: Math.round((Math.round(metallwert * adjDef) / 1000) * weightKg),
    disclaimer: "custom",
  };
}

/** Get all alloys grouped by category */
export function getAlloysByCategory(): Record<AlloyCategory, Alloy[]> {
  const grouped: Record<AlloyCategory, Alloy[]> = {
    stainless_steel: [],
    copper_alloy: [],
    aluminum_alloy: [],
    structural_steel: [],
  };
  for (const alloy of ALLOYS) {
    grouped[alloy.category].push(alloy);
  }
  return grouped;
}

/** Category labels */
export const CATEGORY_LABELS: Record<AlloyCategory, { de: string; en: string; ru: string }> = {
  stainless_steel:  { de: "Edelstahl", en: "Stainless Steel", ru: "Нержавеющая сталь" },
  copper_alloy:     { de: "Kupferlegierungen", en: "Copper Alloys", ru: "Медные сплавы" },
  aluminum_alloy:   { de: "Aluminiumlegierungen", en: "Aluminum Alloys", ru: "Алюминиевые сплавы" },
  structural_steel: { de: "Baustahl", en: "Structural Steel", ru: "Конструкционная сталь" },
};
