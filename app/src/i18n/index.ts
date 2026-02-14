import de from "./de";
import en from "./en";
import ru from "./ru";

export type Locale = "de" | "en" | "ru";

export const LOCALES: Locale[] = ["de", "en", "ru"];

export const LOCALE_LABELS: Record<Locale, string> = {
  de: "Deutsch",
  en: "English",
  ru: "Русский",
};

export const LOCALE_DATE_MAP: Record<Locale, string> = {
  de: "de-DE",
  en: "en-US",
  ru: "ru-RU",
};

const translations: Record<Locale, Record<string, string>> = { de, en, ru };

export function getTranslations(locale: Locale): Record<string, string> {
  return translations[locale] || translations.de;
}

/**
 * Translate a key with optional parameter interpolation.
 * Parameters in the translation string use {paramName} syntax.
 */
export function t(
  locale: Locale,
  key: string,
  params?: Record<string, string | number>
): string {
  const dict = translations[locale] || translations.de;
  let text = dict[key] || translations.de[key] || key;
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      text = text.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
    }
  }
  return text;
}

/**
 * Russian plural helper. Russian has 3 plural forms:
 * - one: 1, 21, 31... (but not 11)
 * - few: 2-4, 22-24... (but not 12-14)
 * - many: 0, 5-20, 25-30...
 *
 * Keys: key_one, key_few, key_many
 * Falls back to key if suffixed keys not found.
 */
export function tPlural(
  locale: Locale,
  key: string,
  count: number,
  params?: Record<string, string | number>
): string {
  const allParams = { count, ...params };

  if (locale === "ru") {
    const lastTwo = Math.abs(count) % 100;
    const lastOne = Math.abs(count) % 10;
    let suffix = "_many";
    if (lastOne === 1 && lastTwo !== 11) suffix = "_one";
    else if (lastOne >= 2 && lastOne <= 4 && (lastTwo < 12 || lastTwo > 14))
      suffix = "_few";
    const dict = translations[locale];
    if (dict[key + suffix]) return t(locale, key + suffix, allParams);
  }

  return t(locale, key, allParams);
}
