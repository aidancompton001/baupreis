"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useOrg } from "@/lib/hooks/useOrg";
import { useLocale } from "@/i18n/LocaleContext";
import UpgradeCard from "@/components/dashboard/UpgradeCard";
import TrialFeatureBanner from "@/components/dashboard/TrialFeatureBanner";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

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
  const [historyData, setHistoryData] = useState<Array<{ date: string; price: number }>>([]);
  const [historyDays, setHistoryDays] = useState(90);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"catalog" | "custom">("catalog");
  const [customName, setCustomName] = useState("");
  const [customElements, setCustomElements] = useState<Array<{ element: string; pct: string }>>([
    { element: "Cu", pct: "63" },
    { element: "Zn", pct: "37" },
  ]);
  const [savedFormulas, setSavedFormulas] = useState<Array<{ id: string; name: string; composition: Record<string, number> }>>([]);
  const [customResult, setCustomResult] = useState<CalcResult | null>(null);
  const [customLoading, setCustomLoading] = useState(false);

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

  // Fetch price history for chart
  const fetchHistory = useCallback(async (code: string, days: number) => {
    setHistoryLoading(true);
    try {
      const res = await fetch(`/api/alloy-calculator/history?code=${encodeURIComponent(code)}&days=${days}`);
      if (res.ok) {
        const data = await res.json();
        setHistoryData(
          (data.dataPoints || []).map((p: any) => ({
            date: new Date(p.date).toLocaleDateString(locale === "en" ? "en-GB" : locale === "ru" ? "ru-RU" : "de-DE", { day: "2-digit", month: "2-digit" }),
            price: p.price,
          }))
        );
      }
    } catch { /* ignore */ }
    setHistoryLoading(false);
  }, [locale]);

  // Fetch AI analysis
  const fetchAiAnalysis = useCallback(async (code: string) => {
    setAiLoading(true);
    try {
      const res = await fetch(`/api/alloy-calculator/analysis?code=${encodeURIComponent(code)}`);
      if (res.ok) {
        const data = await res.json();
        setAiAnalysis(data);
      }
    } catch { /* ignore */ }
    setAiLoading(false);
  }, []);

  // Load history and AI when alloy changes
  useEffect(() => {
    if (selectedAlloy && !dataLoading) {
      fetchHistory(selectedAlloy, historyDays);
      fetchAiAnalysis(selectedAlloy);
    }
  }, [selectedAlloy, historyDays, fetchHistory, fetchAiAnalysis, dataLoading]);

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

  // Load saved formulas
  useEffect(() => {
    if (orgLoading || !org || !org.features_forecast) return;
    fetch("/api/alloy-calculator/formulas")
      .then((r) => r.json())
      .then((data) => {
        if (data.formulas) setSavedFormulas(data.formulas);
      })
      .catch(() => {});
  }, [orgLoading, org]);

  const AVAILABLE_ELEMENTS = ["Cu", "Al", "Zn", "Ni", "Sn", "Pb", "Fe", "Cr", "Mo", "Mn", "Si", "Mg", "Ti"];

  function addElement() {
    const used = customElements.map((e) => e.element);
    const next = AVAILABLE_ELEMENTS.find((el) => !used.includes(el));
    if (next) setCustomElements([...customElements, { element: next, pct: "0" }]);
  }

  function removeElement(idx: number) {
    if (customElements.length <= 2) return;
    setCustomElements(customElements.filter((_, i) => i !== idx));
  }

  async function calculateCustom() {
    const composition: Record<string, number> = {};
    for (const { element, pct } of customElements) {
      const val = Number(pct) / 100;
      if (val > 0) composition[element] = val;
    }

    setCustomLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/alloy-calculator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customComposition: composition,
          customName: customName || t("alloy.customDefault"),
          productForm: selectedForm,
          weightKg: Number(weightKg) || 1000,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Fehler ${res.status}`);
      }
      const data: CalcResult = await res.json();
      setCustomResult(data);
    } catch (err: any) {
      setError(err.message);
      setCustomResult(null);
    }
    setCustomLoading(false);
  }

  async function saveFormula() {
    const composition: Record<string, number> = {};
    for (const { element, pct } of customElements) {
      const val = Number(pct) / 100;
      if (val > 0) composition[element] = val;
    }

    try {
      const res = await fetch("/api/alloy-calculator/formulas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: customName || t("alloy.customDefault"), composition }),
      });
      if (res.ok) {
        const data = await res.json();
        setSavedFormulas([data.formula, ...savedFormulas]);
      } else {
        const err = await res.json().catch(() => ({}));
        setError(err.error || "Fehler beim Speichern");
      }
    } catch { setError("Verbindungsfehler"); }
  }

  async function deleteFormula(id: string) {
    await fetch(`/api/alloy-calculator/formulas?id=${id}`, { method: "DELETE" });
    setSavedFormulas(savedFormulas.filter((f) => f.id !== id));
  }

  function loadFormula(formula: { name: string; composition: Record<string, number> }) {
    setCustomName(formula.name);
    setCustomElements(
      Object.entries(formula.composition).map(([element, fraction]) => ({
        element,
        pct: (fraction * 100).toFixed(1),
      }))
    );
    setActiveTab("custom");
  }

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

      {/* Tabs */}
      <div className="flex gap-1 mb-4 bg-gray-100 rounded-lg p-1 w-fit">
        <button
          onClick={() => setActiveTab("catalog")}
          className={`px-4 py-2 text-sm font-medium rounded-md transition ${
            activeTab === "catalog" ? "bg-white text-brand-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
          }`}
        >
          {t("alloy.tabCatalog")}
        </button>
        <button
          onClick={() => setActiveTab("custom")}
          className={`px-4 py-2 text-sm font-medium rounded-md transition ${
            activeTab === "custom" ? "bg-white text-brand-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
          }`}
        >
          {t("alloy.tabCustom")}
        </button>
      </div>

      {/* Custom Formula Constructor */}
      {activeTab === "custom" && (
        <div className="bg-white rounded-xl border p-6 mb-6">
          <div className="mb-4">
            <label htmlFor="custom-name" className="block text-sm font-medium text-gray-700 mb-1">{t("alloy.formulaName")}</label>
            <input
              id="custom-name"
              type="text"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder={t("alloy.customDefault")}
              className="w-full max-w-sm border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="space-y-2 mb-4">
            {customElements.map((el, idx) => {
              const totalPct = customElements.reduce((s, e) => s + (Number(e.pct) || 0), 0);
              return (
                <div key={idx} className="flex items-center gap-2">
                  <select
                    value={el.element}
                    onChange={(e) => {
                      const updated = [...customElements];
                      updated[idx] = { ...updated[idx], element: e.target.value };
                      setCustomElements(updated);
                    }}
                    className="border rounded-lg px-2 py-1.5 text-sm w-24"
                  >
                    {AVAILABLE_ELEMENTS.map((sym) => (
                      <option key={sym} value={sym} disabled={customElements.some((ce, i) => ce.element === sym && i !== idx)}>
                        {sym}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    value={el.pct}
                    onChange={(e) => {
                      const updated = [...customElements];
                      updated[idx] = { ...updated[idx], pct: e.target.value };
                      setCustomElements(updated);
                    }}
                    min={0}
                    max={100}
                    step={0.1}
                    className="border rounded-lg px-2 py-1.5 text-sm w-24 text-right"
                  />
                  <span className="text-sm text-gray-500">%</span>
                  {customElements.length > 2 && (
                    <button onClick={() => removeElement(idx)} className="text-red-400 hover:text-red-600 text-sm px-1">✕</button>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-2 mb-4">
            <span className={`text-sm font-medium ${
              Math.abs(customElements.reduce((s, e) => s + (Number(e.pct) || 0), 0) - 100) <= 2 ? "text-green-600" : "text-red-600"
            }`}>
              Σ = {customElements.reduce((s, e) => s + (Number(e.pct) || 0), 0).toFixed(1)}%
            </span>
            {customElements.length < 10 && (
              <button onClick={addElement} className="text-xs text-brand-600 hover:text-brand-700 font-medium">+ {t("alloy.addElement")}</button>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={calculateCustom}
              disabled={customLoading}
              className="px-4 py-2 text-sm font-medium bg-brand-600 text-white rounded-lg hover:bg-brand-700 disabled:opacity-50 transition"
            >
              {customLoading ? "..." : t("alloy.calculate")}
            </button>
            <button
              onClick={saveFormula}
              className="px-4 py-2 text-sm font-medium border border-brand-600 text-brand-600 rounded-lg hover:bg-brand-50 transition"
            >
              {t("alloy.saveFormula")}
            </button>
          </div>

          {/* Custom Result */}
          {customResult && !customLoading && (
            <div className="mt-4 bg-blue-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-brand-600">
                {fmtEur(customResult.price.perTonneMin)} — {fmtEur(customResult.price.perTonneMax)} <span className="text-sm font-normal text-gray-500">EUR/t</span>
              </div>
              <div className="text-sm text-gray-600 mt-1">{t("alloy.metallwert")}: {fmtEur(customResult.metallwert)} EUR/t</div>
            </div>
          )}

          {/* Saved Formulas */}
          {savedFormulas.length > 0 && (
            <div className="mt-6 border-t pt-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">{t("alloy.savedFormulas")}</h3>
              <div className="space-y-1">
                {savedFormulas.map((f) => (
                  <div key={f.id} className="flex items-center justify-between text-sm py-1">
                    <button onClick={() => loadFormula(f)} className="text-brand-600 hover:underline">{f.name}</button>
                    <button onClick={() => deleteFormula(f.id)} className="text-red-400 hover:text-red-600 text-xs">✕</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Catalog Calculator Controls */}
      <div className={`bg-white rounded-xl border p-6 mb-6 ${activeTab !== "catalog" ? "hidden" : ""}`}>
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
                <button
                  onClick={() => {
                    const url = `/api/alloy-calculator/export?code=${encodeURIComponent(result.alloy.code)}&form=${result.productForm}&weight=${result.weightKg}`;
                    window.open(url, "_blank");
                  }}
                  className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-brand-700 bg-brand-50 hover:bg-brand-100 rounded-lg transition"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  {t("alloy.exportPdf")}
                </button>
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

          {/* AI Trend Analysis */}
          {aiAnalysis?.hasAnalysis && !aiLoading && (
            <div className="bg-white rounded-xl border p-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">{t("alloy.aiAnalysis")}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-4">
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <div className="text-xs text-gray-500">{t("alloy.trend")}</div>
                  <div className={`text-lg font-bold ${
                    aiAnalysis.trend === "rising" ? "text-green-600" :
                    aiAnalysis.trend === "falling" ? "text-red-600" : "text-gray-600"
                  }`}>
                    {aiAnalysis.trend === "rising" ? "↑" : aiAnalysis.trend === "falling" ? "↓" : "→"}{" "}
                    {aiAnalysis.trend === "rising" ? t("alloy.trendRising") :
                     aiAnalysis.trend === "falling" ? t("alloy.trendFalling") : t("alloy.trendStable")}
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <div className="text-xs text-gray-500">7 {t("alloy.days")}</div>
                  <div className={`text-lg font-bold ${aiAnalysis.change7d > 0 ? "text-green-600" : aiAnalysis.change7d < 0 ? "text-red-600" : "text-gray-600"}`}>
                    {aiAnalysis.change7d > 0 ? "+" : ""}{aiAnalysis.change7d}%
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <div className="text-xs text-gray-500">30 {t("alloy.days")}</div>
                  <div className={`text-lg font-bold ${aiAnalysis.change30d > 0 ? "text-green-600" : aiAnalysis.change30d < 0 ? "text-red-600" : "text-gray-600"}`}>
                    {aiAnalysis.change30d > 0 ? "+" : ""}{aiAnalysis.change30d}%
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <div className="text-xs text-gray-500">{t("alloy.confidence")}</div>
                  <div className="text-lg font-bold text-gray-700">{aiAnalysis.confidence}%</div>
                </div>
              </div>
              {aiAnalysis.insight && (
                <div className="bg-purple-50 rounded-lg p-3 text-sm text-purple-800">
                  <span className="font-medium">KI: </span>
                  {locale === "en" ? aiAnalysis.insight.en : locale === "ru" ? aiAnalysis.insight.ru : aiAnalysis.insight.de}
                </div>
              )}
              {aiAnalysis.elementTrends?.length > 0 && (
                <div className="mt-3 text-xs text-gray-500">
                  {aiAnalysis.elementTrends.map((et: any) => (
                    <span key={et.element} className="inline-flex items-center gap-1 mr-3">
                      <span className="font-medium">{et.element}</span>
                      <span className={et.change7d > 0 ? "text-green-600" : et.change7d < 0 ? "text-red-600" : ""}>
                        {et.change7d > 0 ? "+" : ""}{et.change7d}%
                      </span>
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
          {aiLoading && (
            <div className="bg-white rounded-xl border p-6 flex items-center justify-center h-24">
              <div className="w-5 h-5 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
              <span className="ml-2 text-sm text-gray-500">{t("alloy.aiLoading")}</span>
            </div>
          )}

          {/* Price History Chart */}
          {historyData.length > 2 && (
            <div className="bg-white rounded-xl border p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-700">{t("alloy.priceHistory")}</h3>
                <div className="flex gap-1">
                  {[30, 90, 365].map((d) => (
                    <button
                      key={d}
                      onClick={() => setHistoryDays(d)}
                      className={`px-2.5 py-1 text-xs rounded-md transition ${
                        historyDays === d
                          ? "bg-brand-600 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {d}d
                    </button>
                  ))}
                </div>
              </div>
              {historyLoading ? (
                <div className="flex items-center justify-center h-48">
                  <div className="w-5 h-5 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={historyData}>
                    <defs>
                      <linearGradient id="alloyGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#9ca3af" }} tickLine={false} axisLine={{ stroke: "#e5e7eb" }} />
                    <YAxis
                      tickFormatter={(v: number) => `€${v.toLocaleString("de-DE")}`}
                      tick={{ fontSize: 11, fill: "#9ca3af" }}
                      tickLine={false}
                      axisLine={{ stroke: "#e5e7eb" }}
                      domain={["auto", "auto"]}
                    />
                    <Tooltip
                      contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "12px" }}
                      formatter={(v: number) => [`€${v.toLocaleString("de-DE")}`, t("alloy.metallwert")]}
                    />
                    <ReferenceLine
                      y={Math.min(...historyData.map((d) => d.price))}
                      stroke="#16a34a"
                      strokeDasharray="3 3"
                      strokeOpacity={0.5}
                    />
                    <ReferenceLine
                      y={Math.max(...historyData.map((d) => d.price))}
                      stroke="#dc2626"
                      strokeDasharray="3 3"
                      strokeOpacity={0.5}
                    />
                    <Area
                      type="monotone"
                      dataKey="price"
                      stroke="#2563eb"
                      strokeWidth={2}
                      fill="url(#alloyGradient)"
                      dot={false}
                      activeDot={{ r: 5, fill: "#2563eb", strokeWidth: 2, stroke: "#fff" }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          )}

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
