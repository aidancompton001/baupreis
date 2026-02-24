"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useOrg } from "@/lib/hooks/useOrg";
import { useLocale } from "@/i18n/LocaleContext";
import UpgradeCard from "@/components/dashboard/UpgradeCard";
import TrialFeatureBanner from "@/components/dashboard/TrialFeatureBanner";

interface CategoryData {
  id: string;
  label: { de: string; en: string; ru: string };
  forms: Array<{ id: string; label: { de: string; en: string; ru: string } }>;
  alloys: Array<{
    code: string;
    werkstoffNr: string;
    din: string;
    aisi?: string;
    nameDE: string;
    nameEN: string;
    nameRU: string;
    pricingMethod: string;
    standard: string;
  }>;
}

interface CalcResult {
  alloy: {
    code: string;
    nameDE: string;
    nameEN: string;
    nameRU: string;
    category: string;
    pricingMethod: string;
    standard: string;
    din: string;
    aisi?: string;
  };
  productForm: string;
  weightKg: number;
  metallwert: number;
  elementBreakdown: Array<{
    element: string;
    fraction: number;
    pricePerTonne: number;
    contribution: number;
  }>;
  processingMultiplier: number;
  price: {
    perTonneMin: number;
    perTonneMax: number;
    perTonneDefault: number;
    forWeight: number;
  };
  legierungszuschlag?: number;
  basispreis?: { min: number; max: number };
  publishedLZ?: number;
  scrapBasis?: number;
  disclaimer: string;
  lastPriceUpdate: string;
}

function fmtEur(n: number): string {
  return n.toLocaleString("de-DE", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function fmtPct(n: number): string {
  return (n * 100).toFixed(1) + "%";
}

export default function LegierungsrechnerPage() {
  const { org, loading: orgLoading } = useOrg();
  const { t, locale } = useLocale();

  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedAlloy, setSelectedAlloy] = useState<string>("");
  const [selectedForm, setSelectedForm] = useState<string>("blech");
  const [weightKg, setWeightKg] = useState<string>("1000");
  const [result, setResult] = useState<CalcResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load alloy catalog
  useEffect(() => {
    if (orgLoading || !org || !org.features_forecast) return;
    fetch("/api/alloy-calculator")
      .then((r) => r.json())
      .then((data) => {
        if (data.categories) {
          setCategories(data.categories);
          if (data.categories.length > 0) {
            setSelectedCategory(data.categories[0].id);
            if (data.categories[0].alloys.length > 0) {
              setSelectedAlloy(data.categories[0].alloys[0].code);
            }
            if (data.categories[0].forms.length > 0) {
              setSelectedForm(data.categories[0].forms[0].id);
            }
          }
        }
      })
      .catch(() => setError(t("common.connectionError")))
      .finally(() => setDataLoading(false));
  }, [orgLoading, org, t]);

  // Get current category/alloys
  const currentCategory = categories.find((c) => c.id === selectedCategory);
  const currentAlloys = currentCategory?.alloys || [];
  const currentForms = currentCategory?.forms || [];

  // Calculate price
  const calculate = useCallback(async () => {
    if (!selectedAlloy) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/alloy-calculator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          alloyCode: selectedAlloy,
          productForm: selectedForm,
          weightKg: Number(weightKg) || 1000,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Fehler ${res.status}`);
      }

      const data: CalcResult = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || t("common.connectionError"));
      setResult(null);
    } finally {
      setLoading(false);
    }
  }, [selectedAlloy, selectedForm, weightKg, t]);

  // Auto-calculate when selection changes (debounce weight input)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => {
    if (!selectedAlloy || dataLoading) return;
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      calculate();
    }, 400);
    return () => clearTimeout(debounceRef.current);
  }, [selectedAlloy, selectedForm, weightKg, calculate, dataLoading]);

  // Handle category change
  function onCategoryChange(catId: string) {
    setSelectedCategory(catId);
    setResult(null);
    const cat = categories.find((c) => c.id === catId);
    if (cat) {
      if (cat.alloys.length > 0) setSelectedAlloy(cat.alloys[0].code);
      if (cat.forms.length > 0) setSelectedForm(cat.forms[0].id);
    }
  }

  function getAlloyName(alloy: { nameDE: string; nameEN: string; nameRU: string }): string {
    if (locale === "en") return alloy.nameEN;
    if (locale === "ru") return alloy.nameRU;
    return alloy.nameDE;
  }

  function getLabel(labels: { de: string; en: string; ru: string }): string {
    return labels[locale as "de" | "en" | "ru"] || labels.de;
  }

  // Loading state
  if (orgLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
      </div>
    );
  }

  // Plan gate
  if (org && !org.features_forecast) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{t("alloy.title")}</h1>
          <p className="text-gray-600">{t("alloy.subtitle")}</p>
        </div>
        <div className="mt-8">
          <UpgradeCard
            feature={t("alloy.upgradeFeature")}
            requiredPlan="Pro"
            description={t("alloy.upgradeDescription")}
            icon="⚗️"
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t("alloy.title")}</h1>
        <p className="text-gray-600">{t("alloy.subtitle")}</p>
      </div>

      {org?.plan === "trial" && <TrialFeatureBanner plan="Pro" />}

      {/* Calculator Controls */}
      <div className="bg-white rounded-xl border p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Category */}
          <div>
            <label htmlFor="alloy-category" className="block text-sm font-medium text-gray-700 mb-1">
              {t("alloy.category")}
            </label>
            <select
              id="alloy-category"
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              disabled={dataLoading}
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {getLabel(cat.label)}
                </option>
              ))}
            </select>
          </div>

          {/* Alloy */}
          <div>
            <label htmlFor="alloy-grade" className="block text-sm font-medium text-gray-700 mb-1">
              {t("alloy.grade")}
            </label>
            <select
              id="alloy-grade"
              value={selectedAlloy}
              onChange={(e) => { setSelectedAlloy(e.target.value); setResult(null); }}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              disabled={dataLoading}
            >
              {currentAlloys.map((a) => (
                <option key={a.code} value={a.code}>
                  {a.code} — {a.din}{a.aisi ? ` (${a.aisi})` : ""}
                </option>
              ))}
            </select>
          </div>

          {/* Product Form */}
          <div>
            <label htmlFor="alloy-form" className="block text-sm font-medium text-gray-700 mb-1">
              {t("alloy.productForm")}
            </label>
            <select
              id="alloy-form"
              value={selectedForm}
              onChange={(e) => { setSelectedForm(e.target.value); setResult(null); }}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              disabled={dataLoading}
            >
              {currentForms.map((f) => (
                <option key={f.id} value={f.id}>
                  {getLabel(f.label)}
                </option>
              ))}
            </select>
          </div>

          {/* Weight */}
          <div>
            <label htmlFor="alloy-weight" className="block text-sm font-medium text-gray-700 mb-1">
              {t("alloy.weight")} (kg)
            </label>
            <input
              id="alloy-weight"
              type="number"
              value={weightKg}
              onChange={(e) => setWeightKg(e.target.value)}
              min={1}
              max={1000000}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
            />
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center h-32">
          <div className="w-6 h-6 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
        </div>
      )}

      {/* Results */}
      {result && !loading && (
        <div className="space-y-6">
          {/* Price Card */}
          <div className="bg-white rounded-xl border p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {getAlloyName(result.alloy)}
                </h2>
                <p className="text-sm text-gray-500">
                  {result.alloy.din}{result.alloy.aisi ? ` / AISI ${result.alloy.aisi}` : ""} — {result.alloy.standard}
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-brand-600">
                  {fmtEur(result.price.perTonneMin)} — {fmtEur(result.price.perTonneMax)} <span className="text-lg font-normal text-gray-500">EUR/t</span>
                </div>
                {result.weightKg !== 1000 && (
                  <div className="text-lg text-gray-700 mt-1">
                    {fmtEur(result.price.forWeight)} EUR <span className="text-sm text-gray-500">/ {result.weightKg.toLocaleString("de-DE")} kg</span>
                  </div>
                )}
              </div>
            </div>

            {/* Stainless: LZ breakdown */}
            {result.legierungszuschlag != null && (
              <div className="bg-blue-50 rounded-lg p-4 mb-4">
                <h3 className="text-sm font-semibold text-blue-800 mb-2">{t("alloy.lzSystem")}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                  <div className="bg-white rounded-lg p-3 text-center">
                    <div className="text-gray-500 text-xs">{t("alloy.basispreis")}</div>
                    <div className="font-bold text-gray-900">
                      {result.basispreis ? `${fmtEur(result.basispreis.min)} — ${fmtEur(result.basispreis.max)}` : "—"} EUR/t
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-3 text-center">
                    <div className="text-gray-500 text-xs">Legierungszuschlag</div>
                    <div className="font-bold text-blue-700">
                      {fmtEur(result.legierungszuschlag)} EUR/t
                    </div>
                    {result.publishedLZ && (
                      <div className="text-xs text-green-600 mt-1">{t("alloy.publishedValue")}</div>
                    )}
                  </div>
                  <div className="bg-white rounded-lg p-3 text-center">
                    <div className="text-gray-500 text-xs">{t("alloy.metallwert")}</div>
                    <div className="font-bold text-gray-700">
                      {fmtEur(result.metallwert)} EUR/t
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Carbon steel: Scrap info */}
            {result.scrapBasis != null && (
              <div className="bg-orange-50 rounded-lg p-4 mb-4">
                <h3 className="text-sm font-semibold text-orange-800 mb-2">{t("alloy.scrapBased")}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                  <div className="bg-white rounded-lg p-3 text-center">
                    <div className="text-gray-500 text-xs">{t("alloy.scrapPrice")}</div>
                    <div className="font-bold text-gray-900">{fmtEur(result.scrapBasis)} EUR/t</div>
                  </div>
                  <div className="bg-white rounded-lg p-3 text-center">
                    <div className="text-gray-500 text-xs">{t("alloy.multiplier")}</div>
                    <div className="font-bold text-gray-700">{result.processingMultiplier.toFixed(1)}x</div>
                  </div>
                  <div className="bg-white rounded-lg p-3 text-center">
                    <div className="text-gray-500 text-xs">{t("alloy.estimatedPrice")}</div>
                    <div className="font-bold text-orange-700">{fmtEur(result.price.perTonneDefault)} EUR/t</div>
                  </div>
                </div>
              </div>
            )}

            {/* Element Breakdown */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">{t("alloy.composition")}</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-gray-500">
                      <th className="py-2 pr-4">{t("alloy.element")}</th>
                      <th className="py-2 pr-4 text-right">{t("alloy.share")}</th>
                      <th className="py-2 pr-4 text-right">{t("alloy.metalPrice")}</th>
                      <th className="py-2 text-right">{t("alloy.contribution")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.elementBreakdown.map((el) => (
                      <tr key={el.element} className="border-b border-gray-100">
                        <td className="py-2 pr-4 font-medium">{el.element}</td>
                        <td className="py-2 pr-4 text-right text-gray-600">{fmtPct(el.fraction)}</td>
                        <td className="py-2 pr-4 text-right text-gray-600">{fmtEur(el.pricePerTonne)} EUR/t</td>
                        <td className="py-2 text-right font-medium">{fmtEur(el.contribution)} EUR/t</td>
                      </tr>
                    ))}
                    <tr className="font-bold">
                      <td className="py-2 pr-4">{t("alloy.metallwert")}</td>
                      <td />
                      <td />
                      <td className="py-2 text-right">{fmtEur(result.metallwert)} EUR/t</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="flex gap-3">
              <span className="text-amber-600 text-lg shrink-0">&#x26A0;</span>
              <div className="text-sm text-amber-800">
                <p className="font-semibold mb-1">{t("alloy.disclaimerTitle")}</p>
                <p>{t("alloy.disclaimerText")}</p>
                <p className="mt-1 text-xs text-amber-600">
                  {t("alloy.lastUpdate")}: {result.lastPriceUpdate}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
