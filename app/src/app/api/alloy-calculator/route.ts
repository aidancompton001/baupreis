import { requireOrg, canAccess } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";
import { NextRequest, NextResponse } from "next/server";
import {
  ALLOYS,
  BASE_METALS,
  LAST_PRICE_UPDATE,
  calculateAlloyPrice,
  calculateCustomPrice,
  getAlloysByCategory,
  CATEGORY_LABELS,
  DEFAULT_FORMS,
  PRODUCT_FORM_LABELS,
  type ProductForm,
  type AlloyCategory,
} from "@/lib/alloys";

/** GET: List all alloys with categories */
export async function GET() {
  try {
    const org = await requireOrg();

    if (!canAccess(org, "forecast")) {
      return NextResponse.json(
        { error: "Legierungsrechner ist ab dem Pro-Plan verfügbar." },
        { status: 403 }
      );
    }

    const grouped = getAlloysByCategory();
    const categories = (Object.keys(grouped) as AlloyCategory[]).map((cat) => ({
      id: cat,
      label: CATEGORY_LABELS[cat],
      forms: DEFAULT_FORMS[cat].map((f) => ({
        id: f,
        label: PRODUCT_FORM_LABELS[f],
      })),
      alloys: grouped[cat].map((a) => ({
        code: a.code,
        werkstoffNr: a.werkstoffNr,
        din: a.din,
        aisi: a.aisi,
        nameDE: a.nameDE,
        nameEN: a.nameEN,
        nameRU: a.nameRU,
        pricingMethod: a.pricingMethod,
        standard: a.standard,
      })),
    }));

    return NextResponse.json({
      categories,
      lastPriceUpdate: LAST_PRICE_UPDATE,
      metalCount: Object.keys(BASE_METALS).length,
      alloyCount: ALLOYS.length,
    });
  } catch (error: any) {
    if (
      error.message === "No organization found" ||
      error.message === "Trial expired" ||
      error.message === "Subscription cancelled"
    ) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    return NextResponse.json(
      { error: "Interner Serverfehler" },
      { status: 500 }
    );
  }
}

/** POST: Calculate alloy price */
export async function POST(req: NextRequest) {
  try {
    const org = await requireOrg();

    if (!canAccess(org, "forecast")) {
      return NextResponse.json(
        { error: "Legierungsrechner ist ab dem Pro-Plan verfügbar." },
        { status: 403 }
      );
    }

    if (!checkRateLimit(`alloy:${org.id}`, 30, 60_000)) {
      return NextResponse.json(
        { error: "Zu viele Anfragen. Bitte warten Sie eine Minute." },
        { status: 429 }
      );
    }

    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Ungültiges JSON-Format." },
        { status: 400 }
      );
    }
    const { alloyCode, customComposition, customName, productForm = "blech", weightKg = 1000 } = body;

    if (!alloyCode && !customComposition) {
      return NextResponse.json(
        { error: "alloyCode oder customComposition ist erforderlich." },
        { status: 400 }
      );
    }

    const validForms = ["blech", "stabstahl", "blankstahl", "rohr_geschweisst", "rohr_nahtlos", "profil", "draht", "guss"];
    const form = validForms.includes(productForm) ? productForm : "blech";
    const weight = Math.max(1, Math.min(1_000_000, Number(weightKg) || 1000));

    let result;

    if (customComposition && typeof customComposition === "object") {
      // Calculate from custom composition
      result = calculateCustomPrice(customComposition, customName || "Eigene Legierung", form as ProductForm, weight);
    } else {
      result = calculateAlloyPrice(alloyCode, form as ProductForm, weight);
    }

    if (!result) {
      return NextResponse.json(
        { error: "Legierung nicht gefunden." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      alloy: {
        code: result.alloy.code,
        werkstoffNr: result.alloy.werkstoffNr,
        din: result.alloy.din,
        aisi: result.alloy.aisi,
        nameDE: result.alloy.nameDE,
        nameEN: result.alloy.nameEN,
        nameRU: result.alloy.nameRU,
        category: result.alloy.category,
        pricingMethod: result.alloy.pricingMethod,
        standard: result.alloy.standard,
      },
      productForm: result.productForm,
      weightKg: result.weightKg,
      metallwert: result.metallwert,
      elementBreakdown: result.elementBreakdown,
      processingMultiplier: result.processingMultiplier,
      price: {
        perTonneMin: result.totalPerTonneMin,
        perTonneMax: result.totalPerTonneMax,
        perTonneDefault: result.totalPerTonneDefault,
        forWeight: result.totalForWeight,
      },
      // Stainless-specific
      legierungszuschlag: result.legierungszuschlag,
      basispreis: result.basispreis,
      publishedLZ: result.publishedLZ,
      // Carbon steel-specific
      scrapBasis: result.scrapBasis,
      disclaimer: result.disclaimer,
      lastPriceUpdate: LAST_PRICE_UPDATE,
    });
  } catch (error: any) {
    if (
      error.message === "No organization found" ||
      error.message === "Trial expired" ||
      error.message === "Subscription cancelled"
    ) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    return NextResponse.json(
      { error: "Interner Serverfehler" },
      { status: 500 }
    );
  }
}
