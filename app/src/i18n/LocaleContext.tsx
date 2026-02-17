"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import {
  type Locale,
  LOCALE_DATE_MAP,
  getTranslations,
  tPlural as tPluralFn,
} from "./index";

const VALID_LOCALES: Locale[] = ["de", "en", "ru"];

/** Read locale cookie on the client. Returns null on server or if missing. */
function readCookieLocale(): Locale | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith("locale="));
  if (!match) return null;
  const val = match.split("=")[1] as Locale;
  return VALID_LOCALES.includes(val) ? val : null;
}

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
  // On client, always prefer the cookie value over server-provided initialLocale.
  // This prevents the locale from resetting when server renders with a stale cookie
  // or when middleware/Accept-Language header disagrees with user's choice.
  const [locale, setLocaleState] = useState<Locale>(() => {
    const cookieLocale = readCookieLocale();
    return cookieLocale || initialLocale;
  });

  // Sync on mount: if cookie was set by LanguageSwitcher but server
  // rendered with a different initialLocale, correct it immediately.
  useEffect(() => {
    const cookieLocale = readCookieLocale();
    if (cookieLocale && cookieLocale !== locale) {
      setLocaleState(cookieLocale);
      document.documentElement.lang = cookieLocale;
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
