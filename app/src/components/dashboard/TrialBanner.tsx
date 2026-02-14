"use client";

import { useState } from "react";
import Link from "next/link";
import { useOrg } from "@/lib/hooks/useOrg";
import { useLocale } from "@/i18n/LocaleContext";

export default function TrialBanner() {
  const { org, loading } = useOrg();
  const { t, tPlural } = useLocale();
  const [dismissed, setDismissed] = useState(false);

  if (loading || dismissed || !org) return null;
  if (org.plan !== "trial") return null;
  if (!org.trial_ends_at) return null;

  const daysLeft = Math.max(
    0,
    Math.ceil(
      (new Date(org.trial_ends_at).getTime() - Date.now()) /
        (1000 * 60 * 60 * 24)
    )
  );

  const isUrgent = daysLeft <= 3;

  return (
    <div
      className={`rounded-lg px-4 py-3 mb-6 flex items-center justify-between ${
        isUrgent
          ? "bg-red-50 border border-red-200 text-red-800"
          : "bg-yellow-50 border border-yellow-200 text-yellow-800"
      }`}
    >
      <div className="flex items-center gap-3">
        <span className="text-lg">{isUrgent ? "⚠️" : "⏳"}</span>
        <p className="text-sm font-medium">
          {daysLeft === 0
            ? t("trial.endsToday")
            : daysLeft === 1
              ? t("trial.oneDay")
              : tPlural("trial.daysLeft", daysLeft)}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Link
          href="/einstellungen/abo"
          className={`text-sm font-semibold px-3 py-1.5 rounded-lg transition ${
            isUrgent
              ? "bg-red-600 text-white hover:bg-red-700"
              : "bg-yellow-600 text-white hover:bg-yellow-700"
          }`}
        >
          {t("trial.choosePlan")}
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
  );
}
