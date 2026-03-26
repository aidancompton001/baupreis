"use client";

import Link from "next/link";
import { useLocale } from "@/i18n/LocaleContext";

export default function GuestOverlay() {
  const { t } = useLocale();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ top: "7rem" }}>
      {/* Blur backdrop */}
      <div className="absolute inset-0 bg-white/70 backdrop-blur-sm" />

      {/* CTA Card */}
      <div className="relative bg-white border-2 border-[#1A1A1A] shadow-[8px_8px_0_#C1292E] p-10 max-w-md mx-4 text-center">
        {/* Lock icon */}
        <div className="inline-flex items-center justify-center w-16 h-16 bg-[#1A1A1A] mb-6">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="3" y="11" width="18" height="11" rx="0" fill="#F5C518" />
            <path d="M7 11V7a5 5 0 0110 0v4" stroke="#FFFFFF" strokeWidth="2.5" fill="none" />
          </svg>
        </div>

        <p className="font-grotesk text-xs font-bold uppercase tracking-[0.12em] text-[#F5C518] mb-2">
          Dashboard Preview
        </p>
        <h2 className="font-oswald text-2xl sm:text-3xl uppercase text-[#1A1A1A] mb-3">
          {t("guest.title")}
        </h2>
        <p className="text-[#1A1A1A]/60 font-grotesk text-sm mb-8 leading-relaxed">
          {t("guest.description")}
        </p>

        <div className="flex flex-col gap-3">
          <Link
            href="/sign-up"
            className="block w-full py-3.5 bg-[#C1292E] text-white font-grotesk font-bold text-sm uppercase tracking-wide shadow-[4px_4px_0_#1A1A1A] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_#1A1A1A] transition-all text-center"
          >
            {t("guest.register")}
          </Link>
          <Link
            href="/sign-in"
            className="block w-full py-3.5 bg-white text-[#1A1A1A] font-grotesk font-bold text-sm uppercase tracking-wide border-2 border-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white transition-all text-center"
          >
            {t("guest.login")}
          </Link>
        </div>
      </div>
    </div>
  );
}
