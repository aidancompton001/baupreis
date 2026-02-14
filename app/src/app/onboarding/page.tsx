"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "@/i18n/LocaleContext";

interface Material {
  id: string;
  code: string;
  name_de: string;
  category: string;
  unit: string;
}

export default function OnboardingPage() {
  const router = useRouter();
  const { t } = useLocale();
  const [step, setStep] = useState(1);
  const [companyName, setCompanyName] = useState("");
  const [materials, setMaterials] = useState<Material[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const maxMaterials = 5;

  const CATEGORY_LABELS: Record<string, string> = {
    metals: t("materials.category.metals"),
    wood: t("materials.category.wood"),
    concrete: t("materials.category.concrete"),
    insulation: t("materials.category.insulation"),
    energy: t("materials.category.energy"),
  };

  useEffect(() => {
    // Load available materials
    fetch("/api/materials")
      .then((r) => r.json())
      .then((data) => {
        if (data.materials) setMaterials(data.materials);
      })
      .catch(() => {});
  }, []);

  function toggleMaterial(id: string) {
    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= maxMaterials) return prev;
      return [...prev, id];
    });
  }

  async function handleFinish() {
    setLoading(true);
    try {
      // Save company name
      if (companyName.trim()) {
        await fetch("/api/org", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: companyName.trim() }),
        });
      }

      // Save material selection
      if (selectedIds.length > 0) {
        await fetch("/api/materials", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ material_ids: selectedIds }),
        });
      }

      router.push("/dashboard");
    } catch {
      router.push("/dashboard");
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

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-2 rounded-full transition-all ${
                s === step
                  ? "w-12 bg-brand-600"
                  : s < step
                  ? "w-8 bg-brand-300"
                  : "w-8 bg-gray-200"
              }`}
            />
          ))}
        </div>

        {/* Step 1: Welcome + Company Name */}
        {step === 1 && (
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {t("onboarding.welcome")}
            </h1>
            <p className="text-gray-600 mb-8">
              {t("onboarding.trialStart")}
            </p>

            <div className="bg-white rounded-2xl border p-8 mb-8 text-left max-w-md mx-auto">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("onboarding.companyLabel")}
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder={t("onboarding.companyPlaceholder")}
                className="w-full border rounded-lg px-4 py-3 text-base focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              />
              <p className="text-xs text-gray-400 mt-2">
                {t("onboarding.companyHint")}
              </p>
            </div>

            <button
              onClick={() => setStep(2)}
              className="bg-brand-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-brand-700 transition"
            >
              {t("common.next")}
            </button>
          </div>
        )}

        {/* Step 2: Material Selection */}
        {step === 2 && (
          <div>
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {t("onboarding.chooseMaterials")}
              </h1>
              <p className="text-gray-600">
                {t("onboarding.chooseMaterialsHint", { max: maxMaterials })}
              </p>
              <div className="mt-3 inline-flex items-center gap-2 bg-brand-50 text-brand-700 text-sm font-medium px-3 py-1.5 rounded-full">
                {t("onboarding.selectedOf", { selected: selectedIds.length, max: maxMaterials })}
              </div>
            </div>

            {Object.entries(grouped).map(([category, mats]) => (
              <div key={category} className="mb-5">
                <h3 className="font-semibold text-gray-700 mb-2 text-sm">
                  {CATEGORY_LABELS[category] || category}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {mats.map((m) => {
                    const isSelected = selectedIds.includes(m.id);
                    const disabled =
                      !isSelected && selectedIds.length >= maxMaterials;
                    return (
                      <button
                        key={m.id}
                        onClick={() => toggleMaterial(m.id)}
                        disabled={disabled}
                        className={`text-left p-3 rounded-xl border-2 transition text-sm ${
                          isSelected
                            ? "border-brand-500 bg-brand-50"
                            : disabled
                            ? "border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed"
                            : "border-gray-200 bg-white hover:border-brand-300"
                        }`}
                      >
                        <p className="font-medium">{m.name_de}</p>
                        <p className="text-xs text-gray-400">{m.unit}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setStep(1)}
                className="flex-1 border rounded-lg py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
              >
                {t("common.back")}
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-1 bg-brand-600 text-white rounded-lg py-3 text-sm font-medium hover:bg-brand-700 transition"
              >
                {t("onboarding.nextWithCount", { count: selectedIds.length, plural: selectedIds.length !== 1 ? "ien" : "" })}
              </button>
            </div>

            <p className="text-xs text-gray-400 text-center mt-3">
              {t("onboarding.selectionChangeHint")}
            </p>
          </div>
        )}

        {/* Step 3: Ready */}
        {step === 3 && (
          <div className="text-center">
            <div className="text-5xl mb-4">🎉</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {t("onboarding.allReady")}
            </h1>
            <p className="text-gray-600 mb-8">
              {t("onboarding.setupHint")}
            </p>

            <div className="bg-white rounded-2xl border p-6 mb-8 text-left max-w-md mx-auto">
              <h3 className="font-semibold mb-3">{t("onboarding.yourSettings")}</h3>
              <div className="space-y-2 text-sm text-gray-600">
                {companyName && (
                  <p>
                    <span className="text-gray-400">{t("onboarding.company")}:</span>{" "}
                    {companyName}
                  </p>
                )}
                <p>
                  <span className="text-gray-400">{t("onboarding.plan")}:</span>{" "}
                  {t("onboarding.planValue")}
                </p>
                <p>
                  <span className="text-gray-400">{t("onboarding.materials")}:</span>{" "}
                  {t("onboarding.selected", { count: selectedIds.length })}
                </p>
              </div>
            </div>

            <div className="flex gap-3 max-w-md mx-auto">
              <button
                onClick={() => setStep(2)}
                className="flex-1 border rounded-lg py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
              >
                {t("common.back")}
              </button>
              <button
                onClick={handleFinish}
                disabled={loading}
                className="flex-1 bg-brand-600 text-white rounded-lg py-3 text-lg font-semibold hover:bg-brand-700 transition disabled:opacity-50"
              >
                {loading ? t("onboarding.settingUp") : t("onboarding.toDashboard")}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
