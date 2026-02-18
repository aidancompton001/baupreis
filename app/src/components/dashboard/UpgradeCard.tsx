"use client";

import Link from "next/link";
import { useLocale } from "@/i18n/LocaleContext";

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

  return (
    <div className="bg-gradient-to-br from-brand-50 to-white rounded-xl border-2 border-brand-200 p-8 text-center max-w-lg mx-auto">
      <span className="text-4xl block mb-4">{icon}</span>
      <h2 className="text-xl font-semibold text-gray-900 mb-2">
        {t("upgrade.featureFrom", { feature, plan: requiredPlan })}
      </h2>
      <p className="text-gray-600 mb-6">
        {description || t("upgrade.defaultDescription", { plan: requiredPlan, feature })}
      </p>
      <Link
        href={`/einstellungen/abo?plan=${requiredPlan.toLowerCase()}`}
        className="inline-block bg-brand-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-brand-700 transition"
      >
        {t("upgrade.button", { plan: requiredPlan })}
      </Link>
    </div>
  );
}
