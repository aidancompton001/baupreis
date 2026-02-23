"use client";

import Link from "next/link";
import MobileNav from "@/components/MobileNav";
import LanguageSwitcher from "@/i18n/LanguageSwitcher";
import { useLocale } from "@/i18n/LocaleContext";

export default function MarketingHeader() {
  const { t } = useLocale();

  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <Link href="/" className="text-xl font-bold text-brand-600">
          BauPreis AI
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
            className="bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700 transition"
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
