"use client";

import { useState } from "react";
import { useOrg } from "@/lib/hooks/useOrg";
import { useLocale } from "@/i18n/LocaleContext";
import UpgradeCard from "@/components/dashboard/UpgradeCard";

export default function WhatsAppSettingsPage() {
  const { org, loading: orgLoading } = useOrg();
  const { t } = useLocale();
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"input" | "verify" | "connected">("input");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  // Set initial step based on org data
  const isConnected = org?.whatsapp_phone;

  async function handleSendCode() {
    if (!phone.trim()) return;
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/whatsapp/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "send_code", phone: phone.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || t("whatsapp.error.send"));
        return;
      }
      setStep("verify");
    } catch {
      setError(t("common.networkError"));
    } finally {
      setSending(false);
    }
  }

  async function handleVerify() {
    if (!code.trim()) return;
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/whatsapp/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "verify", code: code.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || t("whatsapp.error.verify"));
        return;
      }
      setStep("connected");
    } catch {
      setError(t("common.networkError"));
    } finally {
      setSending(false);
    }
  }

  async function handleDisconnect() {
    setSending(true);
    try {
      await fetch("/api/whatsapp/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "disconnect" }),
      });
      setStep("input");
      setPhone("");
      setCode("");
    } catch {
      setError(t("common.networkError"));
    } finally {
      setSending(false);
    }
  }

  if (orgLoading) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{t("whatsapp.title")}</h1>
          <p className="text-gray-600">{t("whatsapp.subtitle")}</p>
        </div>
        <div className="bg-white rounded-xl border p-8 animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (!org?.features_telegram) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{t("whatsapp.title")}</h1>
          <p className="text-gray-600">{t("whatsapp.subtitle")}</p>
        </div>
        <UpgradeCard feature={t("whatsapp.upgradeFeature")} requiredPlan="Pro" icon="📱" />
      </div>
    );
  }

  if (isConnected && step === "input") {
    return (
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{t("whatsapp.title")}</h1>
          <p className="text-gray-600">{t("whatsapp.subtitle")}</p>
        </div>
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">✅</span>
            <div>
              <p className="font-semibold text-green-700">{t("whatsapp.connected.status")}</p>
              <p className="text-sm text-gray-500">{org.whatsapp_phone}</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            {t("whatsapp.connected.message")}
          </p>
          <button
            onClick={handleDisconnect}
            disabled={sending}
            className="text-red-500 hover:text-red-700 text-sm font-medium"
          >
            {t("whatsapp.connected.disconnect")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t("whatsapp.title")}</h1>
        <p className="text-gray-600">{t("whatsapp.subtitle")}</p>
      </div>

      <div className="bg-white rounded-xl border p-6">
        {step === "input" && (
          <>
            <h2 className="font-semibold mb-3">{t("whatsapp.input.title")}</h2>
            <p className="text-sm text-gray-600 mb-4">
              {t("whatsapp.input.description")}
            </p>
            <div className="flex gap-3">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t("whatsapp.input.placeholder")}
                className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <button
                onClick={handleSendCode}
                disabled={sending || !phone.trim()}
                className="px-4 py-2 rounded-lg bg-brand-600 text-white text-sm font-medium hover:bg-brand-700 disabled:opacity-50 transition"
              >
                {sending ? t("whatsapp.input.sending") : t("whatsapp.input.button")}
              </button>
            </div>
          </>
        )}

        {step === "verify" && (
          <>
            <h2 className="font-semibold mb-3">{t("whatsapp.verify.title")}</h2>
            <p className="text-sm text-gray-600 mb-4">
              {t("whatsapp.verify.description")}
            </p>
            <div className="flex gap-3">
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder={t("whatsapp.verify.placeholder")}
                maxLength={6}
                className="w-32 rounded-lg border border-gray-300 px-3 py-2 text-sm text-center tracking-widest font-mono focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <button
                onClick={handleVerify}
                disabled={sending || code.length !== 6}
                className="px-4 py-2 rounded-lg bg-brand-600 text-white text-sm font-medium hover:bg-brand-700 disabled:opacity-50 transition"
              >
                {sending ? t("whatsapp.verify.confirming") : t("whatsapp.verify.button")}
              </button>
            </div>
            <button
              onClick={() => {
                setStep("input");
                setCode("");
              }}
              className="text-sm text-gray-500 hover:text-gray-700 mt-3"
            >
              {t("whatsapp.verify.otherNumber")}
            </button>
          </>
        )}

        {step === "connected" && (
          <div className="text-center py-4">
            <span className="text-4xl">✅</span>
            <p className="font-semibold text-green-700 mt-3">
              {t("whatsapp.success.title")}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              {t("whatsapp.success.message")}
            </p>
          </div>
        )}

        {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
      </div>
    </div>
  );
}
