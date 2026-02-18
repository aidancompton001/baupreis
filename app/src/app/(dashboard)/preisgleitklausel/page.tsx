"use client";

import { useState } from "react";
import { useOrg } from "@/lib/hooks/useOrg";
import { useLocale } from "@/i18n/LocaleContext";
import UpgradeCard from "@/components/dashboard/UpgradeCard";
import TrialFeatureBanner from "@/components/dashboard/TrialFeatureBanner";

interface MaterialRow {
  code: string;
  label: string;
  share: number; // 0-1, Stoffkostenanteil
  basePrice: number | null;
  currentPrice: number | null;
}

const MATERIAL_OPTIONS = [
  { code: "steel_rebar", label: "Bewehrungsstahl BSt 500" },
  { code: "steel_beam", label: "Stahlträger HEB/IPE" },
  { code: "copper_lme", label: "Kupfer (LME)" },
  { code: "aluminum_lme", label: "Aluminium (LME)" },
  { code: "zinc_lme", label: "Zink (LME)" },
  { code: "nickel_lme", label: "Nickel (LME)" },
  { code: "concrete_c25", label: "Transportbeton C25/30" },
  { code: "cement_cem2", label: "Zement CEM II/B-LL" },
  { code: "wood_kvh", label: "Konstruktionsvollholz C24" },
  { code: "wood_bsh", label: "Brettschichtholz GL24h" },
  { code: "wood_osb", label: "OSB/3 Platten 18mm" },
  { code: "insulation_eps", label: "EPS WLG 035" },
  { code: "insulation_xps", label: "XPS 300kPa" },
  { code: "insulation_mw", label: "Mineralwolle WLG 035" },
  { code: "diesel", label: "Diesel (Großhandel)" },
  { code: "electricity", label: "Industriestrom" },
];

function formatEur(n: number): string {
  return n.toLocaleString("de-DE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function PreisgleitklauselPage() {
  const { org, loading: orgLoading } = useOrg();
  const { t } = useLocale();
  const [baseAmount, setBaseAmount] = useState<string>("100000");
  const [baseDate, setBaseDate] = useState<string>("");
  const [currentDate, setCurrentDate] = useState<string>(
    new Date().toISOString().slice(0, 10)
  );
  const [festanteil, setFestanteil] = useState<string>("0.40");
  const [materials, setMaterials] = useState<MaterialRow[]>([
    {
      code: "steel_rebar",
      label: "Bewehrungsstahl BSt 500",
      share: 0.3,
      basePrice: null,
      currentPrice: null,
    },
    {
      code: "concrete_c25",
      label: "Transportbeton C25/30",
      share: 0.3,
      basePrice: null,
      currentPrice: null,
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [calculated, setCalculated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const f = parseFloat(festanteil) || 0;
  const totalShares = materials.reduce((sum, m) => sum + m.share, 0);
  const sharesValid = Math.abs(f + totalShares - 1.0) < 0.005;

  function addMaterial() {
    const used = new Set(materials.map((m) => m.code));
    const next = MATERIAL_OPTIONS.find((o) => !used.has(o.code));
    if (!next) return;
    setMaterials([
      ...materials,
      { code: next.code, label: next.label, share: 0, basePrice: null, currentPrice: null },
    ]);
    setCalculated(false);
  }

  function removeMaterial(idx: number) {
    setMaterials(materials.filter((_, i) => i !== idx));
    setCalculated(false);
  }

  function updateMaterial(idx: number, field: string, value: any) {
    setMaterials(
      materials.map((m, i) => {
        if (i !== idx) return m;
        if (field === "code") {
          const opt = MATERIAL_OPTIONS.find((o) => o.code === value);
          return {
            ...m,
            code: value,
            label: opt?.label || value,
            basePrice: null,
            currentPrice: null,
          };
        }
        return { ...m, [field]: value };
      })
    );
    setCalculated(false);
  }

  async function calculate() {
    if (!baseDate || !currentDate) {
      setError(t("escalation.errorBothDates"));
      return;
    }
    if (!sharesValid) {
      setError(
        t("escalation.sharesMustEqual", { f: f.toFixed(2), s: totalShares.toFixed(2), total: (f + totalShares).toFixed(2) })
      );
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const codes = materials.map((m) => m.code).join(",");

      const [baseRes, currentRes] = await Promise.all([
        fetch(
          `/api/prices/at-date?date=${baseDate}&materials=${codes}`
        ).then((r) => r.json()),
        fetch(
          `/api/prices/at-date?date=${currentDate}&materials=${codes}`
        ).then((r) => r.json()),
      ]);

      if (!Array.isArray(baseRes) || !Array.isArray(currentRes)) {
        throw new Error(t("escalation.errorLoading"));
      }

      const baseMap = new Map<string, number>();
      for (const row of baseRes) {
        baseMap.set(row.code, parseFloat(row.price_eur));
      }
      const currentMap = new Map<string, number>();
      for (const row of currentRes) {
        currentMap.set(row.code, parseFloat(row.price_eur));
      }

      setMaterials(
        materials.map((m) => ({
          ...m,
          basePrice: baseMap.get(m.code) ?? null,
          currentPrice: currentMap.get(m.code) ?? null,
        }))
      );
      setCalculated(true);
    } catch (err: any) {
      setError(err.message || t("escalation.errorLoading"));
    } finally {
      setLoading(false);
    }
  }

  // VHB Formblatt 225: P_adjusted = P_base * (f + Σ(s_i * I_current_i / I_base_i))
  const base = parseFloat(baseAmount) || 0;
  let adjustmentFactor = f;
  let allPricesAvailable = true;
  for (const m of materials) {
    if (m.basePrice && m.currentPrice) {
      adjustmentFactor += m.share * (m.currentPrice / m.basePrice);
    } else if (m.share > 0) {
      allPricesAvailable = false;
    }
  }
  const adjustedAmount = base * adjustmentFactor;
  const difference = adjustedAmount - base;
  const diffPercent = base > 0 ? ((difference / base) * 100) : 0;

  function exportCsv() {
    const BOM = "\uFEFF";
    let csv = BOM;
    csv += "Preisgleitklausel-Berechnung (VHB Formblatt 225)\n\n";
    csv += `Basisbetrag;${formatEur(base)} EUR\n`;
    csv += `Vertragsdatum;${baseDate}\n`;
    csv += `Berechnungsdatum;${currentDate}\n`;
    csv += `Festanteil (f);${formatEur(f)}\n\n`;
    csv += "Material;Anteil (s);Basispreis (EUR);Aktueller Preis (EUR);Index (I_aktuell/I_basis)\n";
    for (const m of materials) {
      const index =
        m.basePrice && m.currentPrice
          ? formatEur(m.currentPrice / m.basePrice)
          : "—";
      csv += `${m.label};${formatEur(m.share)};${m.basePrice ? formatEur(m.basePrice) : "—"};${m.currentPrice ? formatEur(m.currentPrice) : "—"};${index}\n`;
    }
    csv += `\nAngepasster Betrag;${formatEur(adjustedAmount)} EUR\n`;
    csv += `Differenz;${formatEur(difference)} EUR (${diffPercent >= 0 ? "+" : ""}${formatEur(diffPercent)}%)\n`;

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `preisgleitklausel_${currentDate}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (orgLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (org && !org.features_forecast) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {t("escalation.title")}
          </h1>
          <p className="text-gray-600">
            {t("escalation.subtitle")}
          </p>
        </div>
        <div className="mt-8">
          <UpgradeCard
            feature={t("escalation.upgradeFeature")}
            requiredPlan="Pro"
            description={t("escalation.upgradeDescription")}
            icon="📐"
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {t("escalation.title")}
        </h1>
        <p className="text-gray-600">
          {t("escalation.subtitle")}
        </p>
      </div>

      {org?.plan === "trial" && <TrialFeatureBanner plan="Pro" />}

      <div className="bg-white rounded-xl border p-6 mb-6">
        <h2 className="font-semibold mb-4">{t("escalation.contractData")}</h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              {t("escalation.baseAmount")}
            </label>
            <input
              type="number"
              value={baseAmount}
              onChange={(e) => {
                setBaseAmount(e.target.value);
                setCalculated(false);
              }}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              {t("escalation.contractDate")}
            </label>
            <input
              type="date"
              value={baseDate}
              onChange={(e) => {
                setBaseDate(e.target.value);
                setCalculated(false);
              }}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              {t("escalation.calculationDate")}
            </label>
            <input
              type="date"
              value={currentDate}
              onChange={(e) => {
                setCurrentDate(e.target.value);
                setCalculated(false);
              }}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              {t("escalation.fixedShare")}
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              max="1"
              value={festanteil}
              onChange={(e) => {
                setFestanteil(e.target.value);
                setCalculated(false);
              }}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>

        <h2 className="font-semibold mb-3">{t("escalation.materialShares")}</h2>
        <div className="space-y-3 mb-4">
          {materials.map((m, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <select
                value={m.code}
                onChange={(e) => updateMaterial(idx, "code", e.target.value)}
                className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                {MATERIAL_OPTIONS.map((opt) => (
                  <option key={opt.code} value={opt.code}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <div className="w-24">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                  value={m.share}
                  onChange={(e) =>
                    updateMaterial(idx, "share", parseFloat(e.target.value) || 0)
                  }
                  placeholder={t("escalation.share")}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <button
                onClick={() => removeMaterial(idx)}
                className="text-gray-400 hover:text-red-500 text-lg px-2"
                title={t("escalation.remove")}
              >
                &times;
              </button>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between mb-4">
          <button
            onClick={addMaterial}
            className="text-brand-600 hover:text-brand-700 text-sm font-medium"
          >
            {t("escalation.addMaterial")}
          </button>
          <span
            className={`text-sm ${sharesValid ? "text-green-600" : "text-red-600"}`}
          >
            {sharesValid
              ? t("escalation.sharesValid", { value: (f + totalShares).toFixed(2) })
              : `f + s = ${(f + totalShares).toFixed(2)} (${t("escalation.sharesMustBeOne")})`}
          </span>
        </div>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
            {error}
          </div>
        )}

        <button
          onClick={calculate}
          disabled={loading || !baseDate || !currentDate}
          className="bg-brand-600 text-white px-6 py-2 rounded-lg hover:bg-brand-700 transition text-sm font-medium disabled:opacity-50"
        >
          {loading ? t("escalation.calculating") : t("escalation.calculate")}
        </button>
      </div>

      {/* Results */}
      {calculated && allPricesAvailable && (
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-start justify-between mb-4">
            <h2 className="font-semibold">{t("escalation.result")}</h2>
            <button
              onClick={exportCsv}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-white border text-gray-600 hover:bg-gray-50 transition"
            >
              {t("escalation.resultExport")}
            </button>
          </div>

          {/* Summary Cards */}
          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500">{t("escalation.resultBaseAmount")}</p>
              <p className="text-xl font-bold">€{formatEur(base)}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500">{t("escalation.resultAdjustedAmount")}</p>
              <p className="text-xl font-bold">€{formatEur(adjustedAmount)}</p>
            </div>
            <div
              className={`rounded-lg p-4 ${difference > 0 ? "bg-red-50" : difference < 0 ? "bg-green-50" : "bg-gray-50"}`}
            >
              <p className="text-sm text-gray-500">{t("escalation.resultDifference")}</p>
              <p
                className={`text-xl font-bold ${difference > 0 ? "text-red-600" : difference < 0 ? "text-green-600" : ""}`}
              >
                {difference >= 0 ? "+" : ""}€{formatEur(difference)}
                <span className="text-sm font-normal ml-2">
                  ({diffPercent >= 0 ? "+" : ""}
                  {diffPercent.toFixed(2)}%)
                </span>
              </p>
            </div>
          </div>

          {/* Detail Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-gray-500">
                  <th className="pb-2 font-medium">{t("escalation.tableMaterial")}</th>
                  <th className="pb-2 font-medium">{t("escalation.tableShare")}</th>
                  <th className="pb-2 font-medium">{t("escalation.tableBasePrice")}</th>
                  <th className="pb-2 font-medium">{t("escalation.tableCurrent")}</th>
                  <th className="pb-2 font-medium">{t("escalation.tableIndex")}</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr className="text-gray-600">
                  <td className="py-2 italic">{t("escalation.fixedShareRow")}</td>
                  <td className="py-2">{formatEur(f)}</td>
                  <td className="py-2">—</td>
                  <td className="py-2">—</td>
                  <td className="py-2">1,00</td>
                </tr>
                {materials.map((m) => {
                  const index =
                    m.basePrice && m.currentPrice
                      ? m.currentPrice / m.basePrice
                      : null;
                  return (
                    <tr key={m.code}>
                      <td className="py-2">{m.label}</td>
                      <td className="py-2">{formatEur(m.share)}</td>
                      <td className="py-2">
                        {m.basePrice ? `€${formatEur(m.basePrice)}` : "—"}
                      </td>
                      <td className="py-2">
                        {m.currentPrice
                          ? `€${formatEur(m.currentPrice)}`
                          : "—"}
                      </td>
                      <td
                        className={`py-2 font-medium ${
                          index
                            ? index > 1
                              ? "text-red-600"
                              : index < 1
                                ? "text-green-600"
                                : ""
                            : ""
                        }`}
                      >
                        {index ? formatEur(index) : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-4 pt-4 border-t">
            <p className="text-xs text-gray-400">
              {t("escalation.formula")}
            </p>
          </div>
        </div>
      )}

      {calculated && !allPricesAvailable && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
          <p className="text-yellow-700">
            {t("escalation.missingPriceData")}
          </p>
        </div>
      )}
    </div>
  );
}
