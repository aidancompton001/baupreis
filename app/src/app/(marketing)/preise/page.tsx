"use client";

import { useState } from "react";
import Link from "next/link";
import { useLocale } from "@/i18n/LocaleContext";

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
        t("pricing.feat5Materials"),
        t("pricing.feat1User"),
        t("pricing.feat3Alerts"),
        t("pricing.featDailyEmail"),
        t("pricing.feat2xDaily"),
        t("pricing.feat30dHistory"),
      ],
      notIncluded: [
        t("pricing.featNoTelegram"),
        t("pricing.featNoForecast"),
        t("pricing.featNoApi"),
        t("pricing.featNoPdf"),
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
        t("pricing.featAllMaterials"),
        t("pricing.feat1User"),
        t("pricing.featUnlimitedAlerts"),
        t("pricing.featDailyWeekly"),
        t("pricing.feat4xDaily"),
        t("pricing.featTelegram"),
        t("pricing.featAiForecasts"),
        t("pricing.feat90dHistory"),
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
        t("pricing.featAllMaterials"),
        t("pricing.feat5Users"),
        t("pricing.featUnlimitedAlerts"),
        t("pricing.featAllReports"),
        t("pricing.feat4xDaily"),
        t("pricing.featTelegramEmail"),
        t("pricing.featAiForecasts"),
        t("pricing.feat365dHistory"),
        t("pricing.featApi"),
        t("pricing.featDedicatedSupport"),
      ],
      notIncluded: [],
    },
  ];

  return (
    <main className="min-h-screen">
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-center text-gray-900 mb-4">
            {t("pricing.title")}
          </h1>
          <p className="text-center text-lg text-gray-600 mb-8">
            {t("pricing.subtitle")}
          </p>

          <div className="flex justify-center mb-12">
            <div className="bg-gray-100 rounded-lg p-1 inline-flex">
              <button
                onClick={() => setYearly(false)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                  !yearly ? "bg-white shadow text-gray-900" : "text-gray-600"
                }`}
              >
                {t("pricing.monthly")}
              </button>
              <button
                onClick={() => setYearly(true)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                  yearly ? "bg-white shadow text-gray-900" : "text-gray-600"
                }`}
              >
                {t("pricing.yearly")}
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`rounded-2xl p-8 ${
                  plan.popular
                    ? "border-2 border-brand-600 shadow-lg relative"
                    : "border hover:shadow-lg transition"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brand-600 text-white text-sm font-semibold px-4 py-1 rounded-full">
                    {t("pricing.popular")}
                  </div>
                )}
                <h3 className="text-xl font-semibold">{plan.name}</h3>
                <p className="text-sm text-gray-500 mb-4">
                  {plan.description}
                </p>
                <p className="text-4xl font-bold mb-1">
                  €{yearly ? plan.yearlyPrice : plan.monthlyPrice}
                  <span className="text-lg text-gray-500">
                    {yearly ? t("pricing.perYear") : t("pricing.perMonth")}
                  </span>
                </p>
                {yearly && (
                  <p className="text-sm text-green-600 mb-6">
                    {t("pricing.savings", { savings: plan.monthlyPrice * 12 - plan.yearlyPrice })}
                  </p>
                )}

                <ul className="space-y-3 mb-8 mt-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <span className="text-green-500 mt-0.5">&#10003;</span>
                      {f}
                    </li>
                  ))}
                  {plan.notIncluded.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2 text-sm text-gray-400"
                    >
                      <span className="mt-0.5">&#10007;</span>
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/sign-up"
                  className={`block w-full py-3 rounded-lg font-semibold text-center transition ${
                    plan.popular
                      ? "bg-brand-600 text-white hover:bg-brand-700"
                      : "border border-brand-600 text-brand-600 hover:bg-brand-50"
                  }`}
                >
                  {t("pricing.trialDays")}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Price disclaimer */}
      <section className="pb-20 px-4">
        <div className="max-w-3xl mx-auto bg-gray-50 rounded-xl p-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {t("pricing.disclaimerTitle")}
          </h2>
          <p className="text-sm text-gray-700 mb-2 font-medium">
            {t("pricing.disclaimerFinal")}
          </p>
          <div className="space-y-3 text-sm text-gray-600">
            <p>
              <strong>{t("pricing.disclaimerEuBizLabel")}</strong>{" "}
              {t("pricing.disclaimerEuBizText")}
            </p>
            <p>
              <strong>{t("pricing.disclaimerEuPrivLabel")}</strong>{" "}
              {t("pricing.disclaimerEuPrivText")}
            </p>
            <p>
              <strong>{t("pricing.disclaimerNonEuLabel")}</strong>{" "}
              {t("pricing.disclaimerNonEuText")}
            </p>
            <p className="text-gray-500 italic">
              {t("pricing.disclaimerAdvantage")}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
