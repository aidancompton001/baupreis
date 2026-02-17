"use client";

import { useState, useEffect, useCallback } from "react";
import { useLocale } from "@/i18n/LocaleContext";
import {
  readConsent,
  writeConsent,
  removeGaCookies,
  CONSENT_VERSION,
  type ConsentData,
} from "@/lib/consent";

declare global {
  interface Window {
    __openCookieSettings?: () => void;
    gtag?: (...args: unknown[]) => void;
  }
}

export default function CookieConsent() {
  const { t } = useLocale();
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [analyticsChecked, setAnalyticsChecked] = useState(false);

  const updateConsentMode = useCallback((analytics: boolean) => {
    if (typeof window.gtag === "function") {
      window.gtag("consent", "update", {
        analytics_storage: analytics ? "granted" : "denied",
      });
    }
  }, []);

  const dispatchConsentEvent = useCallback((analytics: boolean) => {
    window.dispatchEvent(
      new CustomEvent("consent-update", { detail: { analytics } })
    );
  }, []);

  const saveConsent = useCallback(
    (analytics: boolean) => {
      const data: ConsentData = {
        analytics,
        timestamp: new Date().toISOString(),
        version: CONSENT_VERSION,
      };
      writeConsent(data);
      updateConsentMode(analytics);
      dispatchConsentEvent(analytics);
      if (!analytics) removeGaCookies();
      setVisible(false);
      setShowDetails(false);
    },
    [updateConsentMode, dispatchConsentEvent]
  );

  useEffect(() => {
    const existing = readConsent();
    if (!existing) {
      setVisible(true);
    } else {
      updateConsentMode(existing.analytics);
      dispatchConsentEvent(existing.analytics);
    }

    window.__openCookieSettings = () => {
      const c = readConsent();
      setAnalyticsChecked(c?.analytics ?? false);
      setShowDetails(true);
      setVisible(true);
    };

    return () => {
      delete window.__openCookieSettings;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] p-4 md:p-6">
      <div className="max-w-2xl mx-auto bg-white border border-gray-200 rounded-2xl shadow-2xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {t("cookie.title")}
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          {t("cookie.description")}{" "}
          <a
            href="/datenschutz"
            className="text-brand-600 underline hover:text-brand-700"
          >
            {t("cookie.privacyLink")}
          </a>
        </p>

        {showDetails && (
          <div className="mb-4 space-y-3 border-t pt-4">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked
                disabled
                className="w-4 h-4 accent-brand-600"
              />
              <span className="text-sm text-gray-900 font-medium">
                {t("cookie.necessary")}
              </span>
              <span className="text-xs text-gray-500 ml-auto">
                {t("cookie.alwaysActive")}
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={analyticsChecked}
                onChange={(e) => setAnalyticsChecked(e.target.checked)}
                className="w-4 h-4 accent-brand-600"
              />
              <div>
                <span className="text-sm text-gray-900 font-medium">
                  {t("cookie.analytics")}
                </span>
                <p className="text-xs text-gray-500">
                  {t("cookie.analyticsDesc")}
                </p>
              </div>
            </label>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={() => saveConsent(true)}
            className="flex-1 bg-brand-600 text-white py-2.5 px-4 rounded-lg text-sm font-semibold hover:bg-brand-700 transition"
          >
            {t("cookie.acceptAll")}
          </button>
          <button
            onClick={() => saveConsent(false)}
            className="flex-1 border border-gray-300 text-gray-700 py-2.5 px-4 rounded-lg text-sm font-semibold hover:bg-gray-50 transition"
          >
            {t("cookie.necessaryOnly")}
          </button>
          {!showDetails ? (
            <button
              onClick={() => setShowDetails(true)}
              className="flex-1 text-gray-500 py-2.5 px-4 rounded-lg text-sm hover:text-gray-900 hover:bg-gray-50 transition"
            >
              {t("cookie.details")}
            </button>
          ) : (
            <button
              onClick={() => saveConsent(analyticsChecked)}
              className="flex-1 border border-brand-600 text-brand-600 py-2.5 px-4 rounded-lg text-sm font-semibold hover:bg-brand-50 transition"
            >
              {t("cookie.saveSettings")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
