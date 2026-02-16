"use client";

import { useEffect, useState } from "react";
import { PLAN_PRICES } from "@/lib/plans";
import { useLocale } from "@/i18n/LocaleContext";

const PLANS = [
  {
    id: "basis",
    name: "Basis",
    features: [
      "pricing.feat5Materials",
      "pricing.feat1User",
      "pricing.feat3Alerts",
      "pricing.featDailyEmail",
    ],
    notIncluded: [
      "pricing.featNoTelegram",
      "pricing.featNoForecast",
      "pricing.featNoApi",
      "pricing.featNoPdf",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    popular: true,
    features: [
      "pricing.featAllMaterials",
      "pricing.feat1User",
      "pricing.featUnlimitedAlerts",
      "pricing.featTelegram",
      "pricing.featAiForecasts",
    ],
    notIncluded: ["pricing.featNoApi", "pricing.featNoPdf"],
  },
  {
    id: "team",
    name: "Team",
    features: [
      "pricing.featAllMaterials",
      "pricing.feat5Users",
      "pricing.featUnlimitedAlerts",
      "pricing.featTelegramEmail",
      "pricing.featAiForecasts",
      "pricing.featApi",
      "pricing.featDedicatedSupport",
    ],
    notIncluded: [],
  },
];

export default function AboPage() {
  const { t, dateFmtLocale } = useLocale();
  const [org, setOrg] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [yearly, setYearly] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/org")
      .then((r) => r.json())
      .then((data) => {
        setOrg(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function handleCheckout(planId: string) {
    setCheckoutLoading(planId);
    try {
      const res = await fetch("/api/org", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: planId,
          billingPeriod: yearly ? "yearly" : "monthly",
        }),
      });
      const data = await res.json();
      if (data.approveUrl) {
        window.location.href = data.approveUrl;
      }
    } catch {
      setCheckoutLoading(null);
    }
  }

  async function handleManageBilling() {
    const res = await fetch("/api/org", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "manage_billing" }),
    });
    const data = await res.json();
    if (data.portalUrl) {
      window.open(data.portalUrl, "_blank");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">{t("subscription.loading")}</p>
      </div>
    );
  }

  const currentPlan = org?.plan || "trial";

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {t("subscription.title")}
        </h1>
      </div>

      {/* Current plan info */}
      <div className="bg-white rounded-xl border p-6 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-semibold text-lg">
              {t("subscription.currentPlan", {
                plan: currentPlan.toUpperCase(),
              })}
            </h2>
            {currentPlan === "trial" && org?.trial_ends_at && (
              <p className="text-sm text-yellow-600 mt-1">
                {t("subscription.trialEnds", {
                  date: new Date(org.trial_ends_at).toLocaleDateString(
                    dateFmtLocale
                  ),
                })}
              </p>
            )}
          </div>
          {org?.paypal_subscription_id && (
            <button
              onClick={handleManageBilling}
              className="bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700 transition text-sm"
            >
              {t("subscription.manage")}
            </button>
          )}
        </div>

        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-500">
              {t("subscription.materials")}
            </p>
            <p className="font-semibold">{org?.max_materials || 5}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">{t("subscription.users")}</p>
            <p className="font-semibold">{org?.max_users || 1}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">{t("subscription.alerts")}</p>
            <p className="font-semibold">
              {org?.max_alerts >= 999
                ? t("common.unlimited")
                : org?.max_alerts || 3}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">
              {t("subscription.telegram")}
            </p>
            <p className="font-semibold">
              {org?.features_telegram ? t("common.yes") : t("common.no")}
            </p>
          </div>
        </div>
      </div>

      {/* Billing period toggle */}
      <div className="flex justify-center mb-8">
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

      {/* Plan cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {PLANS.map((plan) => {
          const prices =
            PLAN_PRICES[plan.id as keyof typeof PLAN_PRICES];
          const price = yearly ? prices.yearly : prices.monthly;
          const isCurrentPlan = currentPlan === plan.id;
          const isUpgrade =
            currentPlan === "trial" || currentPlan === "cancelled" || currentPlan === "suspended";

          return (
            <div
              key={plan.id}
              className={`rounded-2xl p-6 ${
                plan.popular
                  ? "border-2 border-brand-600 shadow-lg relative"
                  : "border hover:shadow-lg transition"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  {t("pricing.popular")}
                </div>
              )}

              <h3 className="text-lg font-semibold">{plan.name}</h3>
              <p className="text-3xl font-bold mt-2">
                €{price}
                <span className="text-sm text-gray-500 font-normal">
                  {yearly ? t("pricing.perYear") : t("pricing.perMonth")}
                </span>
              </p>
              {yearly && (
                <p className="text-xs text-green-600 mt-1">
                  {t("pricing.savings", {
                    savings: prices.monthly * 12 - prices.yearly,
                  })}
                </p>
              )}

              <ul className="space-y-2 mt-4 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <span className="text-green-500 mt-0.5">&#10003;</span>
                    {t(f)}
                  </li>
                ))}
                {plan.notIncluded.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2 text-sm text-gray-400"
                  >
                    <span className="mt-0.5">&#10007;</span>
                    {t(f)}
                  </li>
                ))}
              </ul>

              {isCurrentPlan ? (
                <button
                  disabled
                  className="w-full py-2.5 rounded-lg text-sm font-semibold bg-gray-100 text-gray-400 cursor-not-allowed"
                >
                  {t("subscription.currentPlanBadge")}
                </button>
              ) : (
                <button
                  onClick={() => handleCheckout(plan.id)}
                  disabled={checkoutLoading !== null}
                  className={`w-full py-2.5 rounded-lg text-sm font-semibold transition ${
                    plan.popular
                      ? "bg-brand-600 text-white hover:bg-brand-700"
                      : "border border-brand-600 text-brand-600 hover:bg-brand-50"
                  } ${checkoutLoading ? "opacity-50 cursor-wait" : ""}`}
                >
                  {checkoutLoading === plan.id
                    ? t("subscription.redirecting")
                    : isUpgrade
                      ? t("subscription.upgrade")
                      : t("subscription.upgrade")}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
