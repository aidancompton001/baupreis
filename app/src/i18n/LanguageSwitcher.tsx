"use client";

import { useLocale } from "./LocaleContext";
import { LOCALES, LOCALE_LABELS, type Locale } from "./index";

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();

  return (
    <select
      value={locale}
      onChange={(e) => setLocale(e.target.value as Locale)}
      className="text-sm border rounded-lg px-2 py-1.5 bg-white text-gray-700 cursor-pointer focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
      aria-label="Language"
    >
      {LOCALES.map((l) => (
        <option key={l} value={l}>
          {LOCALE_LABELS[l]}
        </option>
      ))}
    </select>
  );
}
