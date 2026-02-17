"use client";

import Link from "next/link";
import { useLocale } from "@/i18n/LocaleContext";

export default function MarketingFooter() {
  const { t } = useLocale();

  return (
    <footer className="border-t py-12 px-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-gray-500 text-sm">
          {t("landing.footerCopyright").replace(
            "{year}",
            String(new Date().getFullYear())
          )}
        </p>
        <div className="flex gap-6 text-sm text-gray-500">
          <Link href="/impressum" className="hover:text-gray-900">
            {t("landing.footerImpressum")}
          </Link>
          <Link href="/datenschutz" className="hover:text-gray-900">
            {t("landing.footerDatenschutz")}
          </Link>
          <Link href="/agb" className="hover:text-gray-900">
            {t("landing.footerAgb")}
          </Link>
        </div>
      </div>
    </footer>
  );
}
