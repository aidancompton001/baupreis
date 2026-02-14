"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  formatPrice,
  formatPercent,
  getTrendArrow,
  getTrendColor,
} from "@/lib/utils";
import { SkeletonDashboardGrid } from "@/components/dashboard/Skeleton";
import { useLocale } from "@/i18n/LocaleContext";

interface AnalysisItem {
  code: string;
  name_de: string;
  unit: string;
  trend: string;
  change_pct_7d: number;
  change_pct_30d: number;
  recommendation: string;
  explanation_de: string;
}

interface PricePoint {
  code: string;
  name_de: string;
  unit: string;
  price_eur: number;
  timestamp: string;
}

interface IndexData {
  date: string;
  index_value: number;
  change_pct_1d: number | null;
  change_pct_30d: number | null;
}

export default function DashboardPage() {
  const { t } = useLocale();
  const [analysis, setAnalysis] = useState<AnalysisItem[]>([]);
  const [priceMap, setPriceMap] = useState<Map<string, PricePoint>>(new Map());
  const [indexData, setIndexData] = useState<IndexData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/analysis").then((res) => res.json()),
      fetch("/api/prices?days=1").then((res) => res.json()),
      fetch("/api/index?days=1").then((res) => res.json()).catch(() => []),
    ])
      .then(([analysisData, priceData, indexRows]) => {
        if (Array.isArray(analysisData)) setAnalysis(analysisData);
        const map = new Map<string, PricePoint>();
        if (Array.isArray(priceData)) {
          for (const p of priceData) {
            if (!map.has(p.code)) {
              map.set(p.code, p);
            }
          }
        }
        setPriceMap(map);
        if (Array.isArray(indexRows) && indexRows.length > 0) {
          setIndexData(indexRows[0]);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{t("dashboard.title")}</h1>
          <p className="text-gray-600">
            {t("dashboard.subtitle")}
          </p>
        </div>
        <SkeletonDashboardGrid />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t("dashboard.title")}</h1>
          <p className="text-gray-600">
            {t("dashboard.subtitle")}
          </p>
        </div>
        <a
          href="/api/export/prices?days=30"
          download
          className="px-4 py-2 rounded-lg text-sm font-medium bg-white border text-gray-600 hover:bg-gray-50 transition whitespace-nowrap"
        >
          {t("dashboard.csvExport")}
        </a>
      </div>

      {indexData && (
        <div className="mb-6 bg-gradient-to-r from-brand-600 to-brand-700 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-brand-100 text-sm font-medium">{t("dashboard.indexLabel")}</p>
              <p className="text-3xl font-bold mt-1">
                {parseFloat(String(indexData.index_value)).toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <div className="text-right">
              {indexData.change_pct_30d !== null && (
                <div>
                  <p className="text-brand-100 text-xs">{t("dashboard.days30")}</p>
                  <p className={`text-lg font-semibold ${
                    indexData.change_pct_30d > 0 ? "text-red-200" : indexData.change_pct_30d < 0 ? "text-green-200" : "text-white"
                  }`}>
                    {indexData.change_pct_30d > 0 ? "+" : ""}{parseFloat(String(indexData.change_pct_30d)).toFixed(2)}%
                  </p>
                </div>
              )}
              {indexData.change_pct_1d !== null && (
                <div className="mt-1">
                  <p className="text-brand-100 text-xs">{t("dashboard.today")}</p>
                  <p className={`text-sm font-medium ${
                    indexData.change_pct_1d > 0 ? "text-red-200" : indexData.change_pct_1d < 0 ? "text-green-200" : "text-white"
                  }`}>
                    {indexData.change_pct_1d > 0 ? "+" : ""}{parseFloat(String(indexData.change_pct_1d)).toFixed(2)}%
                  </p>
                </div>
              )}
            </div>
          </div>
          <p className="text-brand-200 text-xs mt-3">
            {t("dashboard.indexDescription")}
          </p>
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {analysis.map((item) => {
          const latestPrice = priceMap.get(item.code);
          return (
            <Link
              key={item.code}
              href={`/material/${item.code}`}
              className="bg-white rounded-xl border p-4 hover:shadow-md transition"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-medium text-sm text-gray-900 leading-tight">
                  {item.name_de}
                </h3>
                <span className={`text-lg ${getTrendColor(item.trend)}`}>
                  {getTrendArrow(item.trend)}
                </span>
              </div>

              {latestPrice && (
                <p className="text-lg font-bold text-gray-900 mb-2">
                  {formatPrice(latestPrice.price_eur, latestPrice.unit)}
                </p>
              )}

              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">{t("dashboard.days7")}</span>
                  <span
                    className={
                      item.change_pct_7d > 0
                        ? "text-red-600"
                        : item.change_pct_7d < 0
                          ? "text-green-600"
                          : "text-gray-600"
                    }
                  >
                    {formatPercent(item.change_pct_7d)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">{t("dashboard.days30")}</span>
                  <span
                    className={
                      item.change_pct_30d > 0
                        ? "text-red-600"
                        : item.change_pct_30d < 0
                          ? "text-green-600"
                          : "text-gray-600"
                    }
                  >
                    {formatPercent(item.change_pct_30d)}
                  </span>
                </div>
              </div>

              {item.recommendation && (
                <div className="mt-3 pt-3 border-t">
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${
                      item.recommendation === "buy_now"
                        ? "bg-green-100 text-green-700"
                        : item.recommendation === "wait"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {item.recommendation === "buy_now"
                      ? t("dashboard.buyNow")
                      : item.recommendation === "wait"
                        ? t("dashboard.wait")
                        : t("dashboard.observe")}
                  </span>
                </div>
              )}
            </Link>
          );
        })}
      </div>

      {analysis.length === 0 && !loading && (
        <div className="text-center py-12 bg-white rounded-xl border">
          <p className="text-gray-500 text-lg">
            {t("dashboard.noData")}
          </p>
          <p className="text-gray-400 mt-2">
            {t("dashboard.noDataHint")}
          </p>
        </div>
      )}
    </div>
  );
}
