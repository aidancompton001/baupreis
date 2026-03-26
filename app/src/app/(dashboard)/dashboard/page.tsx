"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { SkeletonDashboardGrid } from "@/components/dashboard/Skeleton";
import { useLocale } from "@/i18n/LocaleContext";

const IndexChart = dynamic(() => import("@/components/dashboard/IndexChart"), {
  ssr: false,
  loading: () => <div className="h-[420px] bg-gray-50 border-2 border-gray-200 animate-pulse" />,
});

interface AnalysisItem {
  code: string;
  name_de: string;
  unit: string;
  category: string;
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
  source?: string;
}

interface IndexRow {
  date: string;
  index_value: number;
  change_pct_1d: number | null;
  change_pct_30d: number | null;
}

export default function DashboardPage() {
  const { t } = useLocale();
  const [analysis, setAnalysis] = useState<AnalysisItem[]>([]);
  const [priceMap, setPriceMap] = useState<Map<string, PricePoint>>(new Map());
  const [indexHistory, setIndexHistory] = useState<IndexRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/analysis").then((res) => res.json()),
      fetch("/api/prices?days=1").then((res) => res.json()),
      fetch("/api/index?days=30").then((res) => res.json()).catch(() => []),
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
        if (Array.isArray(indexRows)) setIndexHistory(indexRows);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{t("dashboard.title")}</h1>
          <p className="text-gray-600">{t("dashboard.subtitle")}</p>
        </div>
        <SkeletonDashboardGrid />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A] font-oswald uppercase">{t("dashboard.title")}</h1>
          <p className="text-[#1A1A1A]/60 text-sm mt-1">{t("dashboard.subtitle")}</p>
        </div>
        <a
          href="/api/export/prices?days=30"
          download
          className="px-4 py-2 rounded-none text-sm font-medium font-grotesk uppercase tracking-wide bg-white border-2 border-[#1A1A1A] text-gray-600 hover:bg-white hover:shadow-md transition-all duration-200 whitespace-nowrap"
        >
          {t("dashboard.csvExport")}
        </a>
      </div>

      {/* ═══ BAUPREIS INDEX CHART ═══ */}
      {indexHistory.length > 0 && <IndexChart data={indexHistory} />}

      {/* ═══ YELLOW KPI BLOCKS (top materials) ═══ */}
      {analysis.length > 0 && (() => {
        const steelItem = analysis.find((a) => a.category === "steel");
        const woodItem = analysis.find((a) => a.category === "wood");
        const steelPrice = steelItem ? priceMap.get(steelItem.code) : null;
        const woodPrice = woodItem ? priceMap.get(woodItem.code) : null;
        const blocks = [
          steelItem ? { label: steelItem.name_de, value: `${Number(steelItem.change_pct_30d || 0) > 0 ? "+" : ""}${Number(steelItem.change_pct_30d || 0).toFixed(1)}%` } : null,
          steelPrice ? { label: steelPrice.name_de, value: `€${Number(steelPrice.price_eur).toLocaleString("de-DE", { minimumFractionDigits: 2 })}` } : null,
          woodItem ? { label: woodItem.name_de, value: `${Number(woodItem.change_pct_30d || 0) > 0 ? "+" : ""}${Number(woodItem.change_pct_30d || 0).toFixed(1)}%` } : null,
          woodPrice ? { label: woodPrice.name_de, value: `€${Number(woodPrice.price_eur).toLocaleString("de-DE", { minimumFractionDigits: 2 })}` } : null,
        ].filter(Boolean);
        return blocks.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {blocks.map((b, i) => (
              <div key={i} className="bg-[#F5C518] border-2 border-[#1A1A1A] p-6">
                <p className="font-grotesk text-[0.6rem] uppercase tracking-wide text-[#1A1A1A]/70 font-bold mb-1">{b!.label}</p>
                <p className="font-oswald text-4xl text-[#1A1A1A]">{b!.value}</p>
              </div>
            ))}
          </div>
        ) : null;
      })()}

      {indexHistory.length === 0 && analysis.length === 0 && !loading && (
        <div className="text-center py-12 dash-card">
          <p className="text-[#1A1A1A]/60 text-lg">{t("dashboard.noData")}</p>
          <p className="text-[#1A1A1A]/50 mt-2">{t("dashboard.noDataHint")}</p>
        </div>
      )}
    </div>
  );
}
