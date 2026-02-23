"use client";

import { useState } from "react";
// @ts-expect-error — @types/react-dom not installed
import { createPortal } from "react-dom";
import Link from "next/link";
import { useLocale } from "@/i18n/LocaleContext";
import LanguageSwitcher from "@/i18n/LanguageSwitcher";

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const { t } = useLocale();

  return (
    <>
      {/* Hamburger button — visible on mobile only */}
      <button
        onClick={() => setOpen(!open)}
        className="md:hidden flex flex-col gap-1.5 p-2"
        aria-label={t("nav.menuOpen")}
      >
        <span
          className={`block w-6 h-0.5 bg-gray-700 transition-transform ${
            open ? "rotate-45 translate-y-2" : ""
          }`}
        />
        <span
          className={`block w-6 h-0.5 bg-gray-700 transition-opacity ${
            open ? "opacity-0" : ""
          }`}
        />
        <span
          className={`block w-6 h-0.5 bg-gray-700 transition-transform ${
            open ? "-rotate-45 -translate-y-2" : ""
          }`}
        />
      </button>

      {/* Mobile menu overlay — portaled to body to escape header's backdrop-filter containing block */}
      {open &&
        createPortal(
          <div className="md:hidden fixed inset-0 top-16 bg-white z-40">
            <div className="flex flex-col p-6 gap-4">
              <Link
                href="/preise"
                onClick={() => setOpen(false)}
                className="text-lg text-gray-700 hover:text-brand-600 py-2 border-b"
              >
                {t("nav.pricing")}
              </Link>
              <Link
                href="/ueber-uns"
                onClick={() => setOpen(false)}
                className="text-lg text-gray-700 hover:text-brand-600 py-2 border-b"
              >
                {t("nav.aboutUs")}
              </Link>
              <Link
                href="/kontakt"
                onClick={() => setOpen(false)}
                className="text-lg text-gray-700 hover:text-brand-600 py-2 border-b"
              >
                {t("nav.contact")}
              </Link>
              <Link
                href="/sign-in"
                onClick={() => setOpen(false)}
                className="text-lg text-gray-700 hover:text-brand-600 py-2 border-b"
              >
                {t("nav.signIn")}
              </Link>
              <Link
                href="/sign-up"
                onClick={() => setOpen(false)}
                className="bg-brand-600 text-white text-center px-6 py-3 rounded-lg text-lg font-semibold hover:bg-brand-700 transition mt-2"
              >
                {t("nav.freeTrial")}
              </Link>
              <div className="pt-4 border-t mt-2">
                <LanguageSwitcher />
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
