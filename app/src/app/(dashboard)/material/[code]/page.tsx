"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { formatPercent, getTrendArrow, getTrendColor } from "@/lib/utils";
import { SkeletonMaterialDetail } from "@/components/dashboard/Skeleton";
import { useLocale } from "@/i18n/LocaleContext";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Area,
  AreaChart,
} from "recharts";

interface PricePoint {
  timestamp: string;
  price_eur: number;
  source: string;
  name_de: string;
  unit: string;
  code: string;
}

interface Analysis {
  trend: string;
  change_pct_7d: number;
  change_pct_30d: number;
  explanation_de: string;
  recommendation: string;
  forecast_json: any;
  confidence: number;
}

export default function MaterialDetailPage() {
  const params = useParams();
  const { t, dateFmtLocale } = useLocale();
  const code = params.code as string;
  const [prices, setPrices] = useState<PricePoint[]>([]);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [days, setDays] = useState(30);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch(`/api/prices?material=${code}&days=${days}`).then((r) => r.json()),
      fetch(`/api/analysis?material=${code}`).then((r) => r.json()),
    ])
      .then(([priceData, analysisData]) => {
        setPrices(priceData);
        setAnalysis(analysisData[0] || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [code, days]);

  const materialName = prices[0]?.name_de || code;
  const unit = prices[0]?.unit || "EUR";
  const latestPrice = prices[0] ? Number(prices[0].price_eur) : 0;
  const minPrice = prices.length
    ? Math.min(...prices.map((p) => Number(p.price_eur)))
    : 0;
  const maxPrice = prices.length
    ? Math.max(...prices.map((p) => Number(p.price_eur)))
    : 0;

  if (loading) {
    return <SkeletonMaterialDetail />;
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{materialName}</h1>
        <p className="text-gray-600">{unit}</p>
      </div>

      {/* Period Selector + CSV Export */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        {[30, 90, 365].map((d) => (
          <button
            key={d}
            onClick={() => setDays(d)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              days === d
                ? "bg-brand-600 text-white"
                : "bg-white border text-gray-600 hover:bg-gray-50"
            }`}
          >
            {t("material.days", { count: d })}
          </button>
        ))}
        <a
          href={`/api/export/prices?material=${code}&days=${days}`}
          download
          className="ml-auto px-4 py-2 rounded-lg text-sm font-medium bg-white border text-gray-600 hover:bg-gray-50 transition"
        >
          {t("material.csvExport")}
        </a>
      </div>

      {/* Price Stats */}
      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border p-4">
          <p className="text-sm text-gray-500">{t("material.currentPrice")}</p>
          <p className="text-2xl font-bold">
            {latestPrice
              ? `€${latestPrice.toLocaleString(dateFmtLocale, { minimumFractionDigits: 2 })}`
              : "—"}
          </p>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <p className="text-sm text-gray-500">{t("material.minimum")} ({days}T)</p>
          <p className="text-2xl font-bold text-green-600">
            {minPrice
              ? `€${minPrice.toLocaleString(dateFmtLocale, {
                  minimumFractionDigits: 2,
                })}`
              : "—"}
          </p>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <p className="text-sm text-gray-500">{t("material.maximum")} ({days}T)</p>
          <p className="text-2xl font-bold text-red-600">
            {maxPrice
              ? `€${maxPrice.toLocaleString(dateFmtLocale, {
                  minimumFractionDigits: 2,
                })}`
              : "—"}
          </p>
        </div>
      </div>

      {/* Price Chart */}
      <div className="bg-white rounded-xl border p-6 mb-6">
        <h2 className="font-semibold mb-4">{t("material.priceChart")}</h2>
        {prices.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart
              data={[...prices].reverse().map((p) => ({
                date: new Date(p.timestamp).toLocaleDateString(dateFmtLocale, {
                  day: "2-digit",
                  month: "2-digit",
                }),
                fullDate: new Date(p.timestamp).toLocaleDateString(dateFmtLocale, {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                }),
                price: Number(p.price_eur),
              }))}
              margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
            >
              <defs>
                <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12, fill: "#9ca3af" }}
                tickLine={false}
                axisLine={{ stroke: "#e5e7eb" }}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "#9ca3af" }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `€${v.toLocaleString(dateFmtLocale)}`}
                domain={["auto", "auto"]}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
                formatter={(value: number) => [
                  `€${value.toLocaleString(dateFmtLocale, { minimumFractionDigits: 2 })}`,
                  t("material.price"),
                ]}
                labelFormatter={(_, payload) =>
                  payload?.[0]?.payload?.fullDate || ""
                }
              />
              {minPrice > 0 && (
                <ReferenceLine
                  y={minPrice}
                  stroke="#16a34a"
                  strokeDasharray="3 3"
                  strokeOpacity={0.5}
                />
              )}
              {maxPrice > 0 && (
                <ReferenceLine
                  y={maxPrice}
                  stroke="#dc2626"
                  strokeDasharray="3 3"
                  strokeOpacity={0.5}
                />
              )}
              <Area
                type="monotone"
                dataKey="price"
                stroke="#2563eb"
                strokeWidth={2}
                fill="url(#priceGradient)"
                dot={false}
                activeDot={{ r: 5, fill: "#2563eb", strokeWidth: 2, stroke: "#fff" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-64 flex items-center justify-center text-gray-400">
            {t("material.noChartData")}
          </div>
        )}
      </div>

      {/* AI Analysis */}
      {analysis && (
        <div className="bg-white rounded-xl border p-6">
          <h2 className="font-semibold mb-4">{t("material.aiAnalysis")}</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className={`text-2xl ${getTrendColor(analysis.trend)}`}>
                {getTrendArrow(analysis.trend)}
              </span>
              <div>
                <p className="font-medium">
                  {t("material.trend")}:{" "}
                  {analysis.trend === "rising"
                    ? t("material.rising")
                    : analysis.trend === "falling"
                    ? t("material.falling")
                    : t("material.stable")}
                </p>
                <p className="text-sm text-gray-500">
                  7T: {formatPercent(analysis.change_pct_7d)} | 30T:{" "}
                  {formatPercent(analysis.change_pct_30d)}
                </p>
              </div>
            </div>

            {analysis.explanation_de && (
              <p className="text-gray-700">{analysis.explanation_de}</p>
            )}

            {analysis.recommendation && (
              <div className="pt-4 border-t">
                <span
                  className={`text-sm font-medium px-3 py-1.5 rounded-full ${
                    analysis.recommendation === "buy_now"
                      ? "bg-green-100 text-green-700"
                      : analysis.recommendation === "wait"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {t("material.recommendation")}:{" "}
                  {analysis.recommendation === "buy_now"
                    ? t("material.buyNow")
                    : analysis.recommendation === "wait"
                    ? t("material.wait")
                    : t("material.observe")}
                </span>
                {analysis.confidence && (
                  <span className="ml-3 text-sm text-gray-500">
                    {t("material.confidence")}: {analysis.confidence}%
                  </span>
                )}
              </div>
            )}

            {analysis.forecast_json && (
              <div className="pt-4 border-t">
                <h3 className="font-medium mb-2">{t("material.forecast14d")}</h3>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">7 Tage</p>
                    <p className="font-medium">
                      €{Number(analysis.forecast_json["7d"]).toLocaleString(dateFmtLocale, { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">30 Tage</p>
                    <p className="font-medium">
                      €{Number(analysis.forecast_json["30d"]).toLocaleString(dateFmtLocale, { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">90 Tage</p>
                    <p className="font-medium">
                      €{Number(analysis.forecast_json["90d"]).toLocaleString(dateFmtLocale, { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
