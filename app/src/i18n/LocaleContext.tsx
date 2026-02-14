"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import {
  type Locale,
  LOCALE_DATE_MAP,
  getTranslations,
  tPlural as tPluralFn,
} from "./index";

interface LocaleContextValue {
  locale: Locale;
  dateFmtLocale: string;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  tPlural: (
    key: string,
    count: number,
    params?: Record<string, string | number>
  ) => string;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({
  children,
  initialLocale = "de",
}: {
  children: ReactNode;
  initialLocale?: Locale;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  const dict = getTranslations(locale);
  const deDict = getTranslations("de");

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    document.cookie = `locale=${newLocale};path=/;max-age=31536000;SameSite=Lax`;
    document.documentElement.lang = newLocale;
  }, []);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>) => {
      let text = dict[key] || deDict[key] || key;
      if (params) {
        for (const [k, v] of Object.entries(params)) {
          text = text.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
        }
      }
      return text;
    },
    [dict, deDict]
  );

  const tPlural = useCallback(
    (
      key: string,
      count: number,
      params?: Record<string, string | number>
    ) => {
      return tPluralFn(locale, key, count, params);
    },
    [locale]
  );

  return (
    <LocaleContext.Provider
      value={{
        locale,
        dateFmtLocale: LOCALE_DATE_MAP[locale],
        setLocale,
        t,
        tPlural,
      }}
    >
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within <LocaleProvider>");
  return ctx;
}
