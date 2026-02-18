"use client";

import { useEffect, useState } from "react";
import { useOrg } from "@/lib/hooks/useOrg";
import { useLocale } from "@/i18n/LocaleContext";
import UpgradeCard from "@/components/dashboard/UpgradeCard";
import { SkeletonPrognoseCard } from "@/components/dashboard/Skeleton";

export default function PrognosePage() {
  const { org, loading: orgLoading } = useOrg();
  const { t, locale, dateFmtLocale } = useLocale();
  const [analysis, setAnalysis] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analysis")
      .then((r) => r.json())
      .then((data) => {
        setAnalysis(data.filter((a: any) => a.forecast_json));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const isLoading = loading || orgLoading;

  if (isLoading) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{t("forecast.title")}</h1>
          <p className="text-gray-600">
            {t("forecast.subtitle")}
          </p>
        </div>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonPrognoseCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (org && !org.features_forecast) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{t("forecast.title")}</h1>
          <p className="text-gray-600">
            {t("forecast.subtitle")}
          </p>
        </div>
        <div className="mt-8">
          <UpgradeCard
            feature={t("forecast.upgradeFeature")}
            requiredPlan="Pro"
            description={t("forecast.upgradeDescription")}
            icon="🤖"
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t("forecast.title")}</h1>
        <p className="text-gray-600">
          {t("forecast.subtitle")}
        </p>
      </div>

      {analysis.length > 0 ? (
        <div className="space-y-4">
          {analysis.map((item) => (
            <div key={item.code} className="bg-white rounded-xl border p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg">{item.name_de}</h3>
                  <p className="text-sm text-gray-500">{item.unit}</p>
                </div>
                <span
                  className={`text-sm font-medium px-3 py-1 rounded-full ${
                    item.recommendation === "buy_now"
                      ? "bg-green-100 text-green-700"
                      : item.recommendation === "wait"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {item.recommendation === "buy_now"
                    ? t("forecast.buyNow")
                    : item.recommendation === "wait"
                      ? t("forecast.wait")
                      : t("forecast.observe")}
                </span>
              </div>

              {(item[`explanation_${locale}`] || item.explanation_de) && (
                <p className="text-gray-700 mb-4">
                  {item[`explanation_${locale}`] || item.explanation_de}
                </p>
              )}

              {item.forecast_json && (
                <div className="grid grid-cols-3 gap-4 text-sm bg-gray-50 rounded-lg p-4">
                  <div>
                    <p className="text-gray-500 mb-1">{t("material.days", { count: 7 })}</p>
                    <p className="font-semibold text-green-600">
                      €{Number(item.forecast_json["7d"]).toLocaleString(dateFmtLocale, { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">{t("material.days", { count: 30 })}</p>
                    <p className="font-semibold">
                      €{Number(item.forecast_json["30d"]).toLocaleString(dateFmtLocale, { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">{t("material.days", { count: 90 })}</p>
                    <p className="font-semibold text-red-600">
                      €{Number(item.forecast_json["90d"]).toLocaleString(dateFmtLocale, { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              )}

              {item.confidence && (
                <div className="mt-4 flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-brand-600 h-2 rounded-full"
                      style={{ width: `${item.confidence}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-500">
                    {item.confidence}% {t("forecast.confidence")}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl border">
          <p className="text-gray-500 text-lg">
            {t("forecast.noData")}
          </p>
          <p className="text-gray-400 mt-2">
            {t("forecast.noDataHint")}
          </p>
        </div>
      )}
    </div>
  );
}
