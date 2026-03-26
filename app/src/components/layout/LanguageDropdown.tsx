"use client";

import { useState, useEffect, useRef } from "react";
import { useLocale } from "@/i18n/LocaleContext";
import { LOCALES, LOCALE_LABELS, type Locale } from "@/i18n";

export default function LanguageDropdown() {
  const { locale, setLocale } = useLocale();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  /* Click outside to close */
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const SHORT_LABELS: Record<Locale, string> = {
    de: "DE",
    en: "EN",
    ru: "RU",
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="text-white/70 text-xs font-grotesk uppercase tracking-wide hover:text-white transition cursor-pointer flex items-center gap-1"
      >
        {SHORT_LABELS[locale]}
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-36 bg-white border-2 border-[#1A1A1A] shadow-[4px_4px_0_#F5C518] z-50">
          {LOCALES.map((l) => (
            <button
              key={l}
              onClick={() => {
                setLocale(l);
                setOpen(false);
              }}
              className={`block w-full text-left px-4 py-2.5 text-sm font-grotesk uppercase tracking-wide cursor-pointer transition ${
                locale === l
                  ? "bg-[#F5C518] text-[#1A1A1A] font-bold"
                  : "text-[#1A1A1A] hover:bg-gray-100"
              }`}
            >
              {LOCALE_LABELS[l]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
