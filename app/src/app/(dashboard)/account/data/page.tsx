"use client";

import { useState, useEffect } from "react";
import { useLocale } from "@/i18n/LocaleContext";

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}.${month}.${year}`;
}

export default function DataPage() {
  const { t } = useLocale();
  const [exporting, setExporting] = useState(false);
  const [consentDate, setConsentDate] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetch("/api/org")
      .then((res) => res.json())
      .then((data) => {
        if (data.created_at) {
          setConsentDate(formatDate(data.created_at));
        }
      })
      .catch(() => {});
  }, []);

  const handleExport = async () => {
    setExporting(true);
    try {
      const res = await fetch("/api/account/export", { method: "POST" });
      const data = await res.json();
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const today = new Date().toISOString().split("T")[0];
      a.href = url;
      a.download = `baupreis-export-${today}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      // silent
    } finally {
      setExporting(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(t("account.data.deleteConfirm"));
    if (!confirmed) return;

    setDeleting(true);
    try {
      const res = await fetch("/api/account/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirm: "DELETE" }),
      });
      if (res.ok) {
        window.location.href = "/";
      }
    } catch {
      // silent
    } finally {
      setDeleting(false);
    }
  };

  const handleOpenCookieSettings = () => {
    (window as any).__openCookieSettings?.();
  };

  return (
    <div className="space-y-6">
      {/* Export */}
      <div className="bg-white rounded-xl border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          <span className="mr-2">&#128229;</span>
          {t("account.data.exportTitle")}
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          {t("account.data.exportDesc")}
        </p>
        <button
          onClick={handleExport}
          disabled={exporting}
          className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50 transition"
        >
          {exporting && (
            <svg
              className="animate-spin h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          )}
          {t("account.data.exportButton")}
        </button>
      </div>

      {/* Consents */}
      <div className="bg-white rounded-xl border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          <span className="mr-2">&#128203;</span>
          {t("account.data.consentsTitle")}
        </h2>
        <div className="space-y-3">
          {/* Privacy Policy */}
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <div>
              <p className="text-sm font-medium text-gray-900">
                {t("account.data.privacyPolicy")}
              </p>
              {consentDate && (
                <p className="text-xs text-gray-500">{consentDate}</p>
              )}
            </div>
          </div>

          {/* Terms of Service */}
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <div>
              <p className="text-sm font-medium text-gray-900">
                {t("account.data.termsOfService")}
              </p>
              {consentDate && (
                <p className="text-xs text-gray-500">{consentDate}</p>
              )}
            </div>
          </div>

          {/* Marketing Emails */}
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium text-gray-900">
                {t("account.data.marketingEmails")}
              </p>
              {consentDate && (
                <p className="text-xs text-gray-500">{consentDate}</p>
              )}
            </div>
            <button className="text-sm text-red-600 hover:text-red-700 font-medium transition">
              {t("account.data.revoke")}
            </button>
          </div>
        </div>
      </div>

      {/* Cookie Settings */}
      <div className="bg-white rounded-xl border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          <span className="mr-2">&#127850;</span>
          {t("account.data.cookieTitle")}
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          {t("account.data.cookieDesc")}
        </p>
        <button
          onClick={handleOpenCookieSettings}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
        >
          {t("account.data.openSettings")}
        </button>
      </div>

      {/* Delete Account */}
      <div className="bg-red-50 rounded-xl border border-red-200 p-6">
        <h2 className="text-lg font-semibold text-red-800 mb-2">
          <span className="mr-2">&#9888;&#65039;</span>
          {t("account.data.deleteAccount")}
        </h2>
        <p className="text-sm text-red-700 mb-4">
          {t("account.data.deleteWarning")}
        </p>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50 transition"
        >
          {deleting && (
            <svg
              className="animate-spin h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          )}
          {t("account.data.deleteButton")}
        </button>
      </div>
    </div>
  );
}
