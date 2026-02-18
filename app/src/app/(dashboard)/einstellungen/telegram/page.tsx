"use client";

import { useState } from "react";
import { useOrg } from "@/lib/hooks/useOrg";
import { useLocale } from "@/i18n/LocaleContext";
import UpgradeCard from "@/components/dashboard/UpgradeCard";
import TrialFeatureBanner from "@/components/dashboard/TrialFeatureBanner";

export default function TelegramPage() {
  const { org, loading: orgLoading } = useOrg();
  const { t } = useLocale();
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  async function handleConnect() {
    setStatus("loading");
    try {
      const res = await fetch("/api/telegram/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      if (res.ok) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (orgLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (org && !org.features_telegram) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {t("telegram.title")}
          </h1>
          <p className="text-gray-600">
            {t("telegram.subtitle")}
          </p>
        </div>
        <div className="mt-8">
          <UpgradeCard
            feature={t("telegram.upgradeFeature")}
            requiredPlan="Pro"
            description={t("telegram.upgradeDescription")}
            icon="📱"
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {t("telegram.title")}
        </h1>
        <p className="text-gray-600">
          {t("telegram.subtitle")}
        </p>
      </div>

      {org?.plan === "trial" && <TrialFeatureBanner plan="Pro" />}

      <div className="bg-white rounded-xl border p-6 max-w-lg">
        <h2 className="font-semibold mb-4">Schritt-für-Schritt</h2>
        <ol className="space-y-3 text-sm text-gray-700 mb-6">
          <li>
            {t("telegram.step1")}{" "}
            <strong>{t("telegram.botHandle")}</strong>
          </li>
          <li>
            {t("telegram.step2")}
          </li>
          <li>{t("telegram.step3")}</li>
          <li>{t("telegram.step4")}</li>
        </ol>

        <div className="flex gap-2">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder={t("telegram.placeholder")}
            className="flex-1 border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <button
            onClick={handleConnect}
            disabled={!code || status === "loading"}
            className="bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700 transition text-sm font-medium disabled:opacity-50"
          >
            {status === "loading" ? t("telegram.connecting") : t("telegram.connect")}
          </button>
        </div>

        {status === "success" && (
          <p className="mt-3 text-green-600 text-sm">
            {t("telegram.success")}
          </p>
        )}
        {status === "error" && (
          <p className="mt-3 text-red-600 text-sm">
            {t("telegram.error")}
          </p>
        )}
      </div>
    </div>
  );
}
