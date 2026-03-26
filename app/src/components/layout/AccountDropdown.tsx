"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale } from "@/i18n/LocaleContext";

export default function AccountDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { t } = useLocale();

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

  async function handleLogout() {
    setOpen(false);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-8 h-8 bg-brand-600 text-white flex items-center justify-center text-xs font-bold font-grotesk cursor-pointer hover:bg-brand-700 transition"
        title={t("nav.account")}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-white border-2 border-[#1A1A1A] shadow-[4px_4px_0_#C1292E] z-50">
          <Link
            href="/einstellungen"
            onClick={() => setOpen(false)}
            className="block px-4 py-3 text-sm font-grotesk uppercase tracking-wide text-[#1A1A1A] hover:bg-gray-100 border-b border-gray-200"
          >
            {t("nav.settings")}
          </Link>
          <Link
            href="/einstellungen/abo"
            onClick={() => setOpen(false)}
            className="block px-4 py-3 text-sm font-grotesk uppercase tracking-wide text-[#1A1A1A] hover:bg-gray-100 border-b border-gray-200"
          >
            {t("nav.subscription") || "Abonnement"}
          </Link>
          <Link
            href="/account"
            onClick={() => setOpen(false)}
            className="block px-4 py-3 text-sm font-grotesk uppercase tracking-wide text-[#1A1A1A] hover:bg-gray-100 border-b border-gray-200"
          >
            {t("nav.account")}
          </Link>
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-3 text-sm font-grotesk uppercase tracking-wide text-brand-600 hover:bg-brand-50 font-bold cursor-pointer"
          >
            {t("nav.logout") || "Abmelden"}
          </button>
        </div>
      )}
    </div>
  );
}
