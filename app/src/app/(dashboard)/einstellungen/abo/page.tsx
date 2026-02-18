"use client";

import { useEffect, useState, useCallback } from "react";
import { PLAN_PRICES } from "@/lib/plans";
import { useLocale } from "@/i18n/LocaleContext";
import { usePaddle } from "@/hooks/usePaddle";

const PRICE_IDS: Record<string, { monthly: string; yearly: string }> = {
  basis: {
    monthly: process.env.NEXT_PUBLIC_PADDLE_PRICE_BASIS_MONTHLY || "",
    yearly: process.env.NEXT_PUBLIC_PADDLE_PRICE_BASIS_YEARLY || "",
  },
  pro: {
    monthly: process.env.NEXT_PUBLIC_PADDLE_PRICE_PRO_MONTHLY || "",
    yearly: process.env.NEXT_PUBLIC_PADDLE_PRICE_PRO_YEARLY || "",
  },
  team: {
    monthly: process.env.NEXT_PUBLIC_PADDLE_PRICE_TEAM_MONTHLY || "",
    yearly: process.env.NEXT_PUBLIC_PADDLE_PRICE_TEAM_YEARLY || "",
  },
};

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
  const paddle = usePaddle();
  const [org, setOrg] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [yearly, setYearly] = useState(false);
  const [subscribing, setSubscribing] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const reloadOrg = useCallback(() => {
    fetch("/api/org")
      .then((r) => r.json())
      .then((data) => setOrg(data));
  }, []);

  useEffect(() => {
    fetch("/api/org")
      .then((r) => r.json())
      .then((data) => {
        setOrg(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Check for success param (after Paddle checkout redirect)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("success") === "1") {
      setSuccessMessage(t("subscription.activated"));
      reloadOrg();
      window.history.replaceState({}, "", "/einstellungen/abo");
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function handleSubscribe(planId: string) {
    if (!paddle) {
      setErrorMessage("Paddle nicht geladen. Bitte Seite neu laden.");
      return;
    }

    const priceIds = PRICE_IDS[planId];
    const priceId = yearly ? priceIds?.yearly : priceIds?.monthly;

    if (!priceId) {
      setErrorMessage("Preis-ID nicht gefunden.");
      return;
    }

    setSubscribing(planId);
    setErrorMessage(null);

    paddle.Checkout.open({
      items: [{ priceId, quantity: 1 }],
      customData: { orgId: org?.id },
      settings: {
        locale: "de",
        successUrl: `${window.location.origin}/einstellungen/abo?success=1`,
        displayMode: "overlay",
        theme: "light",
      },
      customer: {
        email: org?.email || undefined,
      },
    });

    // Paddle overlay handles its own UI, reset subscribing state
    setTimeout(() => setSubscribing(null), 2000);
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

      {/* Success / Error messages */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-4 mb-6">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-6">
          {errorMessage}
          <button
            onClick={() => setErrorMessage(null)}
            className="ml-2 text-red-600 hover:text-red-800 font-medium"
          >
            &#10005;
          </button>
        </div>
      )}

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
            {currentPlan === "basis" && !org?.paddle_subscription_id && org?.trial_ends_at && (
              <div className="mt-1">
                <p className="text-sm text-red-600 font-medium">
                  {t("trial.expired")}
                </p>
                <p className="text-sm text-gray-500">
                  {t("trial.expiredHint")}
                </p>
              </div>
            )}
          </div>
          {org?.paddle_subscription_id && (
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
          const isSubscribing = subscribing === plan.id;

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
                &euro;{price}
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
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={!!subscribing}
                  className={`w-full py-2.5 rounded-lg text-sm font-semibold transition ${
                    isSubscribing
                      ? "bg-gray-200 text-gray-500 cursor-wait"
                      : plan.popular
                        ? "bg-brand-600 text-white hover:bg-brand-700"
                        : "border border-brand-600 text-brand-600 hover:bg-brand-50"
                  }`}
                >
                  {isSubscribing
                    ? t("subscription.activating")
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
