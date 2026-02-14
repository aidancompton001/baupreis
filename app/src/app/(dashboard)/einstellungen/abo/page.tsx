"use client";

import { useEffect, useState } from "react";
import { PLAN_PRICES } from "@/lib/plans";
import { useLocale } from "@/i18n/LocaleContext";

export default function AboPage() {
  const { t, dateFmtLocale } = useLocale();
  const [org, setOrg] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/org")
      .then((r) => r.json())
      .then((data) => {
        setOrg(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function handleManageBilling() {
    const res = await fetch("/api/org", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "manage_billing" }),
    });
    const data = await res.json();
    if (data.portalUrl) {
      window.location.href = data.portalUrl;
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">{t("subscription.loading")}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t("subscription.title")}</h1>
      </div>

      <div className="bg-white rounded-xl border p-6 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-semibold text-lg">
              {t("subscription.currentPlan", { plan: org?.plan?.toUpperCase() || "TRIAL" })}
            </h2>
            {org?.plan === "trial" && (
              <p className="text-sm text-yellow-600 mt-1">
                {t("subscription.trialEnds", { date: new Date(org.trial_ends_at).toLocaleDateString(dateFmtLocale) })}
              </p>
            )}
          </div>
          {org?.stripe_customer_id ? (
            <button
              onClick={handleManageBilling}
              className="bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700 transition text-sm"
            >
              {t("subscription.manage")}
            </button>
          ) : (
            <a
              href="/onboarding"
              className="bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700 transition text-sm"
            >
              {t("subscription.selectPlan")}
            </a>
          )}
        </div>

        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-500">{t("subscription.materials")}</p>
            <p className="font-semibold">{org?.max_materials || 5}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">{t("subscription.users")}</p>
            <p className="font-semibold">{org?.max_users || 1}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">{t("subscription.alerts")}</p>
            <p className="font-semibold">
              {org?.max_alerts >= 999 ? t("common.unlimited") : org?.max_alerts || 3}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">{t("subscription.telegram")}</p>
            <p className="font-semibold">
              {org?.features_telegram ? t("common.yes") : t("common.no")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
