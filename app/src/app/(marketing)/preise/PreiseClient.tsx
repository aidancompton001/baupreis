"use client";

import { useState } from "react";
import Link from "next/link";
import { useLocale } from "@/i18n/LocaleContext";
import { BauhausOverlay } from "@/components/decorations";
import { TileRedYellowSplit } from "@/components/tiles";

const Check = () => (
  <span className="flex-shrink-0 w-5 h-5 bg-brand-100 flex items-center justify-center">
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#C1292E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
  </span>
);
const XMark = () => (
  <span className="flex-shrink-0 w-5 h-5 bg-gray-100 flex items-center justify-center">
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
  </span>
);

export default function PreisePage() {
  const { t } = useLocale();
  const [yearly, setYearly] = useState(false);

  const plans = [
    {
      id: "basis",
      name: "Basis",
      monthlyPrice: 49,
      yearlyPrice: 470,
      description: t("pricing.basisDesc"),
      features: [
        t("pricing.feat5Materials"), t("pricing.feat1User"), t("pricing.feat3Alerts"),
        t("pricing.featDailyEmail"), t("pricing.feat2xDaily"), t("pricing.feat30dHistory"),
      ],
      notIncluded: [
        t("pricing.featNoTelegram"), t("pricing.featNoForecast"),
        t("pricing.featNoApi"), t("pricing.featNoPdf"),
      ],
    },
    {
      id: "pro",
      name: "Pro",
      monthlyPrice: 149,
      yearlyPrice: 1430,
      popular: true,
      description: t("pricing.proDesc"),
      features: [
        t("pricing.featAllMaterials"), t("pricing.feat1User"), t("pricing.featUnlimitedAlerts"),
        t("pricing.featDailyWeekly"), t("pricing.feat4xDaily"), t("pricing.featTelegram"),
        t("pricing.featAiForecasts"), t("pricing.feat90dHistory"),
      ],
      notIncluded: [t("pricing.featNoApi"), t("pricing.featNoPdf")],
    },
    {
      id: "team",
      name: "Team",
      monthlyPrice: 299,
      yearlyPrice: 2870,
      description: t("pricing.teamDesc"),
      features: [
        t("pricing.featAllMaterials"), t("pricing.feat5Users"), t("pricing.featUnlimitedAlerts"),
        t("pricing.featAllReports"), t("pricing.feat4xDaily"), t("pricing.featTelegramEmail"),
        t("pricing.featAiForecasts"), t("pricing.feat365dHistory"),
        t("pricing.featApi"), t("pricing.featDedicatedSupport"),
      ],
      notIncluded: [],
    },
  ];

  return (
    <main className="min-h-screen">
      {/* ═══ HERO ═══ */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden bg-[#1A1A1A]">
        <BauhausOverlay variant="sparse" opacity={0.06} />
        <div className="absolute top-6 right-6 hidden lg:block opacity-20">
          <TileRedYellowSplit size={120} />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <span className="text-xs font-bold tracking-[0.12em] uppercase text-[#F5C518] mb-4 inline-block font-grotesk">
            {t("landing2.pricingEyebrow")}
          </span>
          <h1 className="font-oswald text-4xl sm:text-5xl lg:text-6xl uppercase text-white mb-4 tracking-wide">
            {t("pricing.title")}
          </h1>
          <p className="text-lg text-white/60 max-w-xl mx-auto font-grotesk">
            {t("pricing.subtitle")}
          </p>

          {/* Toggle */}
          <div className="flex justify-center mt-8">
            <div className="inline-flex border-2 border-white/30">
              <button
                onClick={() => setYearly(false)}
                className={`px-5 py-2.5 font-grotesk text-xs font-bold uppercase tracking-wide transition-colors ${
                  !yearly ? "bg-white text-[#1A1A1A]" : "text-white/60 hover:text-white"
                }`}
              >
                {t("pricing.monthly")}
              </button>
              <button
                onClick={() => setYearly(true)}
                className={`px-5 py-2.5 font-grotesk text-xs font-bold uppercase tracking-wide transition-colors ${
                  yearly ? "bg-white text-[#1A1A1A]" : "text-white/60 hover:text-white"
                }`}
              >
                {t("pricing.yearly")}
              </button>
            </div>
          </div>
        </div>
        {/* Bauhaus color bar */}
        <div className="absolute bottom-0 left-0 right-0 flex h-1">
          <div className="flex-[3] bg-[#C1292E]" />
          <div className="flex-[2] bg-[#F5C518]" />
          <div className="flex-[1] bg-[#BC8279]" />
          <div className="flex-[4] bg-white/10" />
        </div>
      </section>

      {/* ═══ CARDS ═══ */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-[1100px] mx-auto grid md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-white p-8 relative transition-all hover:-translate-y-1 ${
                plan.popular
                  ? "border-[3px] border-[#C1292E] shadow-[6px_6px_0_#C1292E]"
                  : "border-2 border-[#1A1A1A] hover:shadow-[4px_4px_0_#C1292E]"
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#C1292E] text-white text-xs font-bold font-grotesk px-5 py-1.5 uppercase tracking-wide whitespace-nowrap rounded-none">
                  {t("pricing.popular")}
                </span>
              )}
              <h3 className="font-oswald text-2xl uppercase text-[#1A1A1A] mb-1">{plan.name}</h3>
              <p className="text-sm text-[#1A1A1A]/50 mb-6 font-grotesk">{plan.description}</p>
              <div className="mb-6">
                <span className="font-oswald text-5xl text-[#1A1A1A]">
                  €{yearly ? plan.yearlyPrice : plan.monthlyPrice}
                </span>
                <span className="text-base text-[#1A1A1A]/50 font-grotesk ml-1">
                  {yearly ? t("pricing.perYear") : t("pricing.perMonth")}
                </span>
              </div>
              {yearly && (
                <p className="text-sm text-[#C1292E] font-bold mb-6 font-grotesk">
                  {t("pricing.savings", { savings: plan.monthlyPrice * 12 - plan.yearlyPrice })}
                </p>
              )}

              <ul className="space-y-2.5 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-[#1A1A1A] font-grotesk">
                    <Check />{f}
                  </li>
                ))}
                {plan.notIncluded.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-[#1A1A1A]/40 font-grotesk">
                    <XMark />{f}
                  </li>
                ))}
              </ul>

              <Link
                href="/sign-up"
                className={`block w-full text-center py-3.5 font-grotesk font-bold text-sm uppercase tracking-wide transition-all ${
                  plan.popular
                    ? "bg-[#C1292E] text-white shadow-[4px_4px_0_#1A1A1A] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_#1A1A1A]"
                    : "bg-white text-[#1A1A1A] border-2 border-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white"
                }`}
              >
                {t("pricing.trialDays")}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ DISCLAIMER ═══ */}
      <section className="pb-20 px-4">
        <div className="max-w-3xl mx-auto bg-white border-2 border-[#1A1A1A] p-8">
          <h2 className="font-oswald text-lg uppercase text-[#1A1A1A] mb-4">{t("pricing.disclaimerTitle")}</h2>
          <p className="text-sm text-[#1A1A1A]/70 mb-2 font-medium font-grotesk">{t("pricing.disclaimerFinal")}</p>
          <div className="space-y-3 text-sm text-[#1A1A1A]/60 font-grotesk">
            <p><strong>{t("pricing.disclaimerEuBizLabel")}</strong> {t("pricing.disclaimerEuBizText")}</p>
            <p><strong>{t("pricing.disclaimerEuPrivLabel")}</strong> {t("pricing.disclaimerEuPrivText")}</p>
            <p><strong>{t("pricing.disclaimerNonEuLabel")}</strong> {t("pricing.disclaimerNonEuText")}</p>
            <p className="text-[#1A1A1A]/40 italic">{t("pricing.disclaimerAdvantage")}</p>
          </div>
        </div>
      </section>
    </main>
  );
}
