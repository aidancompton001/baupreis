"use client";

import { useState } from "react";
import Link from "next/link";
import { useLocale } from "@/i18n/LocaleContext";
import { useOrg } from "@/lib/hooks/useOrg";

const PRICE_IDS: Record<string, { monthly: string; yearly: string }> = {
  pro: {
    monthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY || "",
    yearly: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_YEARLY || "",
  },
  team: {
    monthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_TEAM_MONTHLY || "",
    yearly: process.env.NEXT_PUBLIC_STRIPE_PRICE_TEAM_YEARLY || "",
  },
};

interface UpgradeCardProps {
  feature: string;
  requiredPlan: string;
  description?: string;
  icon: string;
}

export default function UpgradeCard({
  feature,
  requiredPlan,
  description,
  icon,
}: UpgradeCardProps) {
  const { t } = useLocale();
  const { org } = useOrg();
  const [loading, setLoading] = useState(false);

  const planKey = requiredPlan.toLowerCase();
  const priceIds = PRICE_IDS[planKey];
  const canCheckout = !!priceIds?.monthly;

  async function handleCheckout() {
    if (!priceIds) return;
    setLoading(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceId: priceIds.monthly,
          orgId: org?.id,
        }),
      });
      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        setLoading(false);
      }
    } catch {
      setLoading(false);
    }
  }

  return (
    <div className="bg-gradient-to-br from-brand-50 to-white rounded-xl border-2 border-brand-200 p-8 text-center max-w-lg mx-auto">
      <span className="text-4xl block mb-4">{icon}</span>
      <h2 className="text-xl font-semibold text-gray-900 mb-2">
        {t("upgrade.featureFrom", { feature, plan: requiredPlan })}
      </h2>
      <p className="text-gray-600 mb-6">
        {description || t("upgrade.defaultDescription", { plan: requiredPlan, feature })}
      </p>
      {canCheckout ? (
        <button
          onClick={handleCheckout}
          disabled={loading}
          className="inline-block bg-brand-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-brand-700 transition disabled:opacity-50"
        >
          {loading ? t("upgrade.processing") : t("upgrade.button", { plan: requiredPlan })}
        </button>
      ) : (
        <Link
          href={`/einstellungen/abo?plan=${planKey}`}
          className="inline-block bg-brand-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-brand-700 transition"
        >
          {t("upgrade.button", { plan: requiredPlan })}
        </Link>
      )}
    </div>
  );
}
