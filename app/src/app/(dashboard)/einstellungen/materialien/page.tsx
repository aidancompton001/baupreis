"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/i18n/LocaleContext";

interface Material {
  id: string;
  code: string;
  name_de: string;
  category: string;
  unit: string;
  selected: boolean;
}

export default function MaterialienPage() {
  const { t } = useLocale();

  const CATEGORY_LABELS: Record<string, string> = {
    steel: t("materials.category.steel"),
    metal: t("materials.category.metal"),
    wood: t("materials.category.wood"),
    concrete: t("materials.category.concrete"),
    insulation: t("materials.category.insulation"),
    energy: t("materials.category.energy"),
  };

  const [materials, setMaterials] = useState<Material[]>([]);
  const [maxMaterials, setMaxMaterials] = useState(16);
  const [plan, setPlan] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    fetch("/api/materials")
      .then((r) => r.json())
      .then((data) => {
        setMaterials(data.materials || []);
        setMaxMaterials(data.max_materials || 16);
        setPlan(data.plan || "");
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const selectedCount = materials.filter((m) => m.selected).length;
  const isLimited = plan === "basis";

  function toggleMaterial(id: string) {
    setMaterials((prev) =>
      prev.map((m) => {
        if (m.id !== id) return m;
        // Prevent selecting more than max
        if (!m.selected && isLimited && selectedCount >= maxMaterials) return m;
        return { ...m, selected: !m.selected };
      })
    );
    setMessage("");
  }

  async function save() {
    setSaving(true);
    setMessage("");
    try {
      const ids = materials.filter((m) => m.selected).map((m) => m.id);
      const res = await fetch("/api/materials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ material_ids: ids }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || t("materials.error.save"));
        setIsError(true);
      } else {
        setMessage(t("materials.success.saved", { count: ids.length }));
        setIsError(false);
      }
    } catch {
      setMessage(t("materials.error.connection"));
      setIsError(true);
    } finally {
      setSaving(false);
    }
  }

  // Group materials by category
  const grouped = materials.reduce(
    (acc, m) => {
      const cat = m.category || "other";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(m);
      return acc;
    },
    {} as Record<string, Material[]>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">{t("materials.loading")}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t("materials.title")}</h1>
        <p className="text-gray-500 text-sm mt-1">
          {t("materials.subtitle")}
        </p>
        {isLimited && (
          <div className="mt-2 inline-flex items-center gap-2 bg-brand-50 text-brand-700 text-sm font-medium px-3 py-1.5 rounded-full">
            {t("materials.selectedCount", { selected: selectedCount, max: maxMaterials })}
          </div>
        )}
      </div>

      {Object.entries(grouped).map(([category, mats]) => (
        <div key={category} className="mb-6">
          <h2 className="font-semibold text-gray-700 mb-3">
            {CATEGORY_LABELS[category] || category}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {mats.map((m) => {
              const disabled = !m.selected && isLimited && selectedCount >= maxMaterials;
              return (
                <button
                  key={m.id}
                  onClick={() => toggleMaterial(m.id)}
                  disabled={disabled}
                  className={`text-left p-4 rounded-none border-2 transition-all duration-300 ${
                    m.selected
                      ? "border-brand-500 bg-brand-50 shadow-sm"
                      : disabled
                      ? "border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed"
                      : "border-gray-200 bg-white hover:border-brand-300 hover:shadow-md hover:-translate-y-0.5"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{m.name_de}</p>
                      <p className="text-xs text-gray-500">{m.unit}</p>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        m.selected
                          ? "border-brand-500 bg-brand-500"
                          : "border-gray-300"
                      }`}
                    >
                      {m.selected && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {message && (
        <div
          className={`mb-4 text-sm p-3 rounded-none ${
            isError
              ? "bg-red-50 text-red-700"
              : "bg-[#FEF9C3] text-[#1A1A1A]"
          }`}
        >
          {message}
        </div>
      )}

      <button
        onClick={save}
        disabled={saving}
        className="bg-brand-600 text-white px-6 py-2.5 rounded-none hover:bg-brand-700 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 font-medium disabled:opacity-50"
      >
        {saving ? t("materials.saving") : t("materials.save")}
      </button>

      {isLimited && (
        <p className="mt-4 text-sm text-gray-500">
          {t("materials.planLimit", { plan: "Basis", max: maxMaterials })}{" "}
          <a href="/einstellungen/abo" className="text-brand-600 hover:underline">
            {t("materials.upgrade")}
          </a>
        </p>
      )}
    </div>
  );
}
