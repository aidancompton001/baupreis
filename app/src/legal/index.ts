import type { Locale } from "@/i18n";

export interface LegalSection {
  title: string;
  content: string;
}

export interface LegalContent {
  heading: string;
  date: string;
  sections: LegalSection[];
}

type LegalPage = "agb" | "datenschutz" | "impressum";

// Lazy imports to avoid loading all texts upfront
const loaders: Record<LegalPage, Record<Locale, () => Promise<LegalContent>>> = {
  agb: {
    de: () => import("./agb-de").then((m) => m.default),
    en: () => import("./agb-en").then((m) => m.default),
    ru: () => import("./agb-ru").then((m) => m.default),
  },
  datenschutz: {
    de: () => import("./datenschutz-de").then((m) => m.default),
    en: () => import("./datenschutz-en").then((m) => m.default),
    ru: () => import("./datenschutz-ru").then((m) => m.default),
  },
  impressum: {
    de: () => import("./impressum-de").then((m) => m.default),
    en: () => import("./impressum-en").then((m) => m.default),
    ru: () => import("./impressum-ru").then((m) => m.default),
  },
};

/** Get legal page content for a given page and locale. */
export async function getLegalContent(
  page: LegalPage,
  locale: Locale
): Promise<LegalContent> {
  const loader = loaders[page]?.[locale] || loaders[page].de;
  return loader();
}
