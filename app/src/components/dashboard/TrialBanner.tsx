"use client";

import { useState } from "react";
import Link from "next/link";
import { useOrg } from "@/lib/hooks/useOrg";
import { useLocale } from "@/i18n/LocaleContext";

export default function TrialBanner() {
  const { org, loading } = useOrg();
  const { t } = useLocale();
  const [dismissed, setDismissed] = useState(false);

  if (loading || dismissed || !org) return null;
  if (org.plan !== "trial") return null;
  if (!org.trial_ends_at) return null;

  const totalDays = 7;
  const daysLeft = Math.max(
    0,
    Math.ceil(
      (new Date(org.trial_ends_at).getTime() - Date.now()) /
        (1000 * 60 * 60 * 24)
    )
  );
  const daysUsed = totalDays - daysLeft;
  const progress = Math.min(100, Math.round((daysUsed / totalDays) * 100));

  const isUrgent = daysLeft <= 2;

  return (
    <div
      className={`rounded-lg px-4 py-3 mb-6 ${
        isUrgent
          ? "bg-red-50 border border-red-200 text-red-800"
          : "bg-brand-50 border border-brand-200 text-brand-800"
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-sm">{isUrgent ? "⚠️" : "★"}</span>
          <p className="text-sm font-semibold">
            {daysLeft === 0
              ? t("trial.endsToday")
              : daysLeft === 1
                ? t("trial.fullAccess_one")
                : t("trial.fullAccess", { count: daysLeft })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/einstellungen/abo"
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition ${
              isUrgent
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-brand-600 text-white hover:bg-brand-700"
            }`}
          >
            {isUrgent ? t("trial.keepAccess") : t("trial.choosePlan")}
          </Link>
          <button
            onClick={() => setDismissed(true)}
            className="text-current opacity-60 hover:opacity-100 transition"
            aria-label={t("trial.closeBanner")}
          >
            &times;
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="flex items-center gap-2">
        <div className={`flex-1 rounded-full h-1.5 ${isUrgent ? "bg-red-200" : "bg-brand-200"}`}>
          <div
            className={`h-1.5 rounded-full transition-all ${isUrgent ? "bg-red-500" : "bg-brand-500"}`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-[10px] opacity-70">
          {daysUsed}/{totalDays}
        </span>
      </div>
    </div>
  );
}
