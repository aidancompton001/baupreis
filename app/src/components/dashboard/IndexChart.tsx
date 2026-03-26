"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useLocale } from "@/i18n/LocaleContext";

interface IndexRow {
  date: string;
  index_value: number;
  change_pct_1d: number | null;
  change_pct_30d: number | null;
}

interface IndexChartProps {
  data: IndexRow[];
}

const BAR_RED = "#C1292E";
const BAR_YELLOW = "#F5C518";

function formatDateLabel(dateStr: string): string {
  const d = new Date(dateStr);
  return `${String(d.getDate()).padStart(2, "0")}.${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export default function IndexChart({ data }: IndexChartProps) {
  const { t } = useLocale();
  const [period, setPeriod] = useState<7 | 30>(30);

  const sorted = [...data]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-period);

  const latest = sorted.length > 0 ? sorted[sorted.length - 1] : null;

  return (
    <div
      data-tour="baupreis-index"
      className="mb-6 bg-white border-2 border-[#1A1A1A] shadow-[6px_6px_0_#C1292E] dash-appear"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-5 pb-0">
        <div>
          <p className="font-grotesk text-[0.6rem] font-bold uppercase tracking-[0.12em] text-[#1A1A1A]/50">
            {t("dashboard.indexLabel")}
          </p>
          {latest && (
            <div className="flex items-baseline gap-3 mt-1">
              <span className="font-oswald text-4xl text-[#1A1A1A]">
                {latest.index_value.toLocaleString("de-DE", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
              {latest.change_pct_30d != null && (
                <span
                  className={`font-grotesk text-sm font-bold ${
                    latest.change_pct_30d > 0
                      ? "text-brand-600"
                      : latest.change_pct_30d < 0
                        ? "text-[#F5C518]"
                        : "text-gray-500"
                  }`}
                >
                  {latest.change_pct_30d > 0 ? "+" : ""}
                  {latest.change_pct_30d.toFixed(2)}% (30d)
                </span>
              )}
              {latest.change_pct_1d != null && (
                <span
                  className={`font-grotesk text-xs font-medium ${
                    latest.change_pct_1d > 0
                      ? "text-brand-600"
                      : latest.change_pct_1d < 0
                        ? "text-[#F5C518]"
                        : "text-gray-500"
                  }`}
                >
                  {latest.change_pct_1d > 0 ? "+" : ""}
                  {latest.change_pct_1d.toFixed(2)}% {t("dashboard.today")}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Period toggle */}
        <div className="flex gap-0 border-2 border-[#1A1A1A]">
          {([7, 30] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 font-grotesk text-[0.6rem] font-bold uppercase tracking-wide transition-colors ${
                period === p
                  ? "bg-[#1A1A1A] text-white"
                  : "bg-white text-[#1A1A1A]/60 hover:bg-gray-50"
              }`}
            >
              {p} {t("dashboard.days")}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="px-3 pb-4 pt-2">
        <ResponsiveContainer width="100%" height={360}>
          <BarChart data={sorted} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
            <XAxis
              dataKey="date"
              tickFormatter={formatDateLabel}
              tick={{ fontSize: 10, fill: "#9CA3AF", fontFamily: "Space Grotesk" }}
              axisLine={{ stroke: "#1A1A1A", strokeWidth: 2 }}
              tickLine={false}
              interval={period === 7 ? 0 : "preserveStartEnd"}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "#9CA3AF", fontFamily: "Space Grotesk" }}
              axisLine={false}
              tickLine={false}
              domain={["auto", "auto"]}
              tickFormatter={(v: number) => v.toFixed(0)}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const d = payload[0].payload as IndexRow;
                return (
                  <div className="bg-[#1A1A1A] text-white px-3 py-2 border-2 border-[#C1292E] text-xs font-grotesk">
                    <p className="font-bold">{formatDateLabel(d.date)}</p>
                    <p>
                      Index:{" "}
                      <span className="font-oswald text-sm">
                        {d.index_value.toLocaleString("de-DE", {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </p>
                    {d.change_pct_1d != null && (
                      <p className={d.change_pct_1d > 0 ? "text-brand-200" : "text-[#F5C518]"}>
                        {d.change_pct_1d > 0 ? "+" : ""}
                        {d.change_pct_1d.toFixed(2)}%
                      </p>
                    )}
                  </div>
                );
              }}
            />
            <Bar dataKey="index_value" radius={[0, 0, 0, 0]} maxBarSize={period === 7 ? 40 : 16}>
              {sorted.map((entry, i) => (
                <Cell
                  key={i}
                  fill={
                    entry.change_pct_1d != null && entry.change_pct_1d >= 0
                      ? BAR_RED
                      : BAR_YELLOW
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <p className="px-5 pb-4 text-[#1A1A1A]/40 text-[0.6rem] font-grotesk">
        {t("dashboard.indexDescription")}
      </p>
    </div>
  );
}
