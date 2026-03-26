"use client";

import Link from "next/link";
import { useLocale } from "@/i18n/LocaleContext";
import PlanBadge from "./PlanBadge";

interface TrialFeatureBannerProps {
  plan: "Pro" | "Team";
}

export default function TrialFeatureBanner({ plan }: TrialFeatureBannerProps) {
  const { t } = useLocale();

  return (
    <div className="bg-gradient-to-r from-brand-50 to-[#F5C518]/10 border border-brand-200 rounded-none px-4 py-3 mb-6 flex items-center justify-between">
      <div className="flex items-center gap-2 text-sm">
        <span>★</span>
        <PlanBadge plan={plan} />
        <span className="text-gray-700">
          {t("trial.featureBanner", { plan })}
        </span>
      </div>
      <Link
        href="/einstellungen/abo"
        className="text-sm font-semibold text-brand-600 hover:text-brand-700 transition"
      >
        {t("trial.featureBannerCta")} →
      </Link>
    </div>
  );
}
