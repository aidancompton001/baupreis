"use client";

import { useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { useLocale } from "@/i18n/LocaleContext";

function getTourSteps(t: (key: string) => string) {
  return [
    {
      title: t("onboarding.welcome"),
      description: t("tour.step1.description"),
      selector: "[data-tour='dashboard-grid']",
    },
    {
      title: t("tour.step2.title"),
      description: t("tour.step2.description"),
      selector: "[data-tour='baupreis-index']",
    },
    {
      title: t("tour.step3.title"),
      description: t("tour.step3.description"),
      selector: "[data-tour='nav-prognose']",
    },
    {
      title: t("tour.step4.title"),
      description: t("tour.step4.description"),
      selector: "[data-tour='nav-alerts']",
    },
    {
      title: t("tour.step5.title"),
      description: t("tour.step5.description"),
      selector: "[data-tour='nav-berichte']",
    },
    {
      title: t("tour.step6.title"),
      description: t("tour.step6.description"),
      selector: "[data-tour='nav-einstellungen']",
    },
  ];
}

export default function WelcomeTour() {
  const { t } = useLocale();
  const [step, setStep] = useState(0);
  const [show, setShow] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number; below: boolean }>({ top: 0, left: 0, below: true });

  useEffect(() => {
    fetch("/api/user/preferences")
      .then((r) => r.json())
      .then((data) => {
        if (!data.preferences?.tour_completed) {
          setShow(true);
        }
      })
      .catch(() => {});
  }, []);

  const tourSteps = getTourSteps(t);

  const updatePosition = useCallback((stepIdx: number) => {
    const sel = tourSteps[stepIdx]?.selector;
    if (!sel) return;
    const el = document.querySelector(sel);
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const below = rect.top < window.innerHeight / 2;
    setPos({
      top: below ? rect.bottom + 12 : rect.top - 12,
      left: Math.max(16, Math.min(rect.left, window.innerWidth - 340)),
      below,
    });
  }, [tourSteps]);

  useEffect(() => {
    if (show) updatePosition(step);
  }, [show, step, updatePosition]);

  const finish = useCallback(() => {
    setShow(false);
    fetch("/api/user/preferences", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tour_completed: true }),
    }).catch(() => {});
  }, []);

  if (!show) return null;

  const current = tourSteps[step];
  const isLast = step === tourSteps.length - 1;

  return createPortal(
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/40 z-[998]" onClick={finish} />

      {/* Tour Card */}
      <div
        className="fixed z-[999] w-80 bg-white rounded-xl shadow-2xl p-5 border border-gray-100"
        style={{
          top: pos.below ? pos.top : undefined,
          bottom: pos.below ? undefined : window.innerHeight - pos.top,
          left: pos.left,
        }}
      >
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-gray-900 text-sm">{current.title}</h3>
          <span className="text-xs text-gray-400">{step + 1} / {tourSteps.length}</span>
        </div>
        <p className="text-sm text-gray-600 mb-4">{current.description}</p>
        <div className="flex items-center justify-between">
          <button
            onClick={finish}
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            {t("common.skip")}
          </button>
          <button
            onClick={() => isLast ? finish() : setStep((s) => s + 1)}
            className="bg-brand-600 text-white text-sm font-medium px-4 py-1.5 rounded-lg hover:bg-brand-700 transition-colors"
          >
            {isLast ? t("common.done") : t("common.next")}
          </button>
        </div>
      </div>
    </>,
    document.body
  );
}
