"use client";

import Link from "next/link";
import MobileNav from "@/components/MobileNav";
import LanguageSwitcher from "@/i18n/LanguageSwitcher";
import { useLocale } from "@/i18n/LocaleContext";

export default function MarketingHeader() {
  const { t } = useLocale();

  return (
    <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b-[3px] border-brand-600 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <Link href="/" className="font-grotesk text-xl font-bold text-gray-900 flex items-center gap-2.5">
          <svg width="32" height="32" viewBox="0 0 64 64" fill="none"><rect x="2" y="2" width="28" height="28" rx="3" fill="#C1292E"/><rect x="34" y="2" width="28" height="28" rx="3" fill="#C1292E"/><rect x="2" y="34" width="28" height="28" rx="3" fill="#C1292E"/><rect x="14" y="14" width="16" height="16" rx="2" fill="white"/><rect x="38" y="6" width="10" height="10" rx="1" fill="white"/><polyline points="10,48 22,40 32,52" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
          Bau<span className="text-brand-600">Preis</span> AI
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <Link href="/preise" className="text-gray-600 hover:text-gray-900">
            {t("nav.pricing")}
          </Link>
          <Link
            href="/ueber-uns"
            className="text-gray-600 hover:text-gray-900"
          >
            {t("nav.aboutUs")}
          </Link>
          <Link
            href="/kontakt"
            className="text-gray-600 hover:text-gray-900"
          >
            {t("nav.contact")}
          </Link>
          <Link
            href="/sign-in"
            className="text-gray-600 hover:text-gray-900"
          >
            {t("nav.signIn")}
          </Link>
          <Link
            href="/sign-up"
            className="bg-brand-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold font-grotesk uppercase tracking-wide hover:bg-brand-700 transition shadow-[3px_3px_0_#1A1A1A]"
          >
            {t("nav.freeTrial")}
          </Link>
          <LanguageSwitcher />
        </div>
        <MobileNav />
      </div>
    </nav>
  );
}
