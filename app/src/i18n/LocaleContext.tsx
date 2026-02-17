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

/** Read locale from cookie using regex (robust against edge-case formatting). */
function readCookieLocale(): Locale | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(/(?:^|;\s*)locale=([^;]*)/);
  if (!m) return null;
  const val = m[1].trim() as Locale;
  return VALID_LOCALES.includes(val) ? val : null;
}

/** Read locale from localStorage as fallback. */
function readStoredLocale(): Locale | null {
  try {
    const val = localStorage.getItem("locale") as Locale | null;
    return val && VALID_LOCALES.includes(val) ? val : null;
  } catch {
    return null;
  }
}

/** Persist locale to both cookie AND localStorage. */
function persistLocale(locale: Locale) {
  document.cookie = `locale=${locale};path=/;max-age=31536000;SameSite=Lax`;
  try {
    localStorage.setItem("locale", locale);
  } catch {}
}

/** Get the best locale from all available sources. */
function resolveClientLocale(fallback: Locale): Locale {
  return readCookieLocale() || readStoredLocale() || fallback;
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
  const [locale, setLocaleState] = useState<Locale>(() => {
    // On client: prefer cookie → localStorage → server-provided initialLocale.
    if (typeof document !== "undefined") {
      return resolveClientLocale(initialLocale);
    }
    return initialLocale;
  });

  // Sync on mount: ensure cookie/localStorage agree with state.
  // Also handles hydration mismatch (server rendered one locale, client has another).
  useEffect(() => {
    const persisted = resolveClientLocale(locale);
    if (persisted !== locale) {
      setLocaleState(persisted);
    }
    // Ensure both stores have the current locale
    persistLocale(persisted);
    document.documentElement.lang = persisted;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Re-sync when tab becomes visible (catches cross-tab changes)
  useEffect(() => {
    function onVisible() {
      if (document.visibilityState !== "visible") return;
      const persisted = resolveClientLocale(locale);
      if (persisted !== locale) {
        setLocaleState(persisted);
        document.documentElement.lang = persisted;
      }
    }
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [locale]);

  const dict = getTranslations(locale);
  const deDict = getTranslations("de");

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    persistLocale(newLocale);
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
