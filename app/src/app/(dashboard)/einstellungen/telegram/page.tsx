"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useOrg } from "@/lib/hooks/useOrg";
import { useLocale } from "@/i18n/LocaleContext";
import UpgradeCard from "@/components/dashboard/UpgradeCard";
import TrialFeatureBanner from "@/components/dashboard/TrialFeatureBanner";

export default function TelegramPage() {
  const { org, loading: orgLoading } = useOrg();
  const { t } = useLocale();
  const [connected, setConnected] = useState(false);
  const [status, setStatus] = useState<
    "idle" | "generating" | "waiting" | "success" | "error"
  >("idle");
  const [deepLink, setDeepLink] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (org?.telegram_chat_id) {
      setConnected(true);
    }
  }, [org]);

  useEffect(() => {
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  const stopPolling = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  }, []);

  async function handleConnect() {
    setStatus("generating");
    setErrorMsg("");

    try {
      const res = await fetch("/api/telegram/connect", { method: "POST" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setErrorMsg(data.errorKey ? t(data.errorKey) : (data.error || t("telegram.error")));
        setStatus("error");
        return;
      }

      const data = await res.json();
      setDeepLink(data.deepLink);
      setStatus("waiting");

      // Open deep link in new tab
      window.open(data.deepLink, "_blank");

      // Start polling every 3 seconds
      stopPolling();
      pollingRef.current = setInterval(async () => {
        try {
          const r = await fetch("/api/telegram/status");
          if (r.ok) {
            const s = await r.json();
            if (s.connected) {
              stopPolling();
              setConnected(true);
              setStatus("success");
            }
          }
        } catch {
          /* ignore polling errors */
        }
      }, 3000);

      // Auto-stop polling after 5 minutes
      setTimeout(() => stopPolling(), 5 * 60 * 1000);
    } catch {
      setErrorMsg(t("common.networkError"));
      setStatus("error");
    }
  }

  async function handleDisconnect() {
    try {
      const res = await fetch("/api/telegram/connect", { method: "DELETE" });
      if (res.ok) {
        setConnected(false);
        setStatus("idle");
        setDeepLink("");
      }
    } catch {
      /* ignore */
    }
  }

  // Loading
  if (orgLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
      </div>
    );
  }

  // Plan gate
  if (org && !org.features_telegram) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {t("telegram.title")}
          </h1>
          <p className="text-gray-600">{t("telegram.subtitle")}</p>
        </div>
        <div className="mt-8">
          <UpgradeCard
            feature={t("telegram.upgradeFeature")}
            requiredPlan="Pro"
            description={t("telegram.upgradeDescription")}
            icon="📱"
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {t("telegram.title")}
        </h1>
        <p className="text-gray-600">{t("telegram.subtitle")}</p>
      </div>

      {org?.plan === "trial" && <TrialFeatureBanner plan="Pro" />}

      <div className="bg-white rounded-xl border p-6 max-w-lg">
        {connected ? (
          <>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <h2 className="font-semibold text-green-700">
                {t("telegram.connectedTitle")}
              </h2>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              {t("telegram.connectedDesc")}
            </p>
            <button
              onClick={handleDisconnect}
              className="text-sm text-red-600 hover:text-red-700 font-medium"
            >
              {t("telegram.disconnect")}
            </button>
          </>
        ) : (
          <>
            <h2 className="font-semibold mb-4">{t("telegram.howTo")}</h2>
            <ol className="space-y-3 text-sm text-gray-700 mb-6">
              <li>{t("telegram.newStep1")}</li>
              <li>{t("telegram.newStep2")}</li>
              <li>{t("telegram.newStep3")}</li>
            </ol>

            {status === "waiting" ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-brand-600">
                  <div className="w-4 h-4 border-2 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
                  {t("telegram.waiting")}
                </div>
                {deepLink && (
                  <a
                    href={deepLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-brand-600 hover:underline"
                  >
                    {t("telegram.openAgain")}
                  </a>
                )}
              </div>
            ) : (
              <button
                onClick={handleConnect}
                disabled={status === "generating"}
                className="bg-[#0088cc] text-white px-6 py-2.5 rounded-lg hover:bg-[#0077b5] transition text-sm font-medium disabled:opacity-50 flex items-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                </svg>
                {status === "generating"
                  ? t("telegram.connecting")
                  : t("telegram.openTelegram")}
              </button>
            )}

            {status === "success" && (
              <p className="mt-3 text-green-600 text-sm">
                {t("telegram.success")}
              </p>
            )}
            {status === "error" && (
              <p className="mt-3 text-red-600 text-sm">
                {errorMsg || t("telegram.error")}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
