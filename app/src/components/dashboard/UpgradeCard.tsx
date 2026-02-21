"use client";

import { useState } from "react";
import Link from "next/link";
import { useLocale } from "@/i18n/LocaleContext";
import { useOrg } from "@/lib/hooks/useOrg";
import { usePaddle } from "@/hooks/usePaddle";

const PRICE_IDS: Record<string, { monthly: string; yearly: string }> = {
  pro: {
    monthly: process.env.NEXT_PUBLIC_PADDLE_PRICE_PRO_MONTHLY || "",
    yearly: process.env.NEXT_PUBLIC_PADDLE_PRICE_PRO_YEARLY || "",
  },
  team: {
    monthly: process.env.NEXT_PUBLIC_PADDLE_PRICE_TEAM_MONTHLY || "",
    yearly: process.env.NEXT_PUBLIC_PADDLE_PRICE_TEAM_YEARLY || "",
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
  const paddle = usePaddle();
  const [loading, setLoading] = useState(false);

  const planKey = requiredPlan.toLowerCase();
  const priceIds = PRICE_IDS[planKey];
  const canCheckout = paddle && priceIds?.monthly;

  function handleCheckout() {
    if (!paddle || !priceIds) return;

    setLoading(true);

    paddle.Checkout.open({
      items: [{ priceId: priceIds.monthly, quantity: 1 }],
      customData: { orgId: org?.id },
      settings: {
        locale: "de",
        successUrl: `${window.location.origin}/einstellungen/abo?success=1`,
        displayMode: "overlay",
        theme: "light",
      },
    });

    setTimeout(() => setLoading(false), 2000);
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
