"use client";

import { useState } from "react";
import Link from "next/link";
import { useOrg } from "@/lib/hooks/useOrg";
import { useLocale } from "@/i18n/LocaleContext";

const PLAN_BADGE_COLORS: Record<string, string> = {
  trial: "bg-[#F5C518]/20 text-[#1A1A1A]",
  basis: "bg-gray-200 text-[#1A1A1A]",
  pro: "bg-brand-100 text-brand-800",
  team: "bg-[#F5C518] text-[#1A1A1A]",
  cancelled: "bg-brand-100 text-brand-800",
  suspended: "bg-brand-100 text-brand-800",
};

export default function BillingPage() {
  const { t, dateFmtLocale } = useLocale();
  const { org, loading } = useOrg();

  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelMessage, setCancelMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [manageLoading, setManageLoading] = useState(false);

  async function handleManageBilling() {
    setManageLoading(true);
    try {
      const res = await fetch("/api/org", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "manage_billing" }),
      });
      const data = await res.json();
      if (data.portalUrl) {
        window.open(data.portalUrl, "_blank");
      } else if (data.error) {
        setCancelMessage({ type: "error", text: data.error });
      }
    } catch {
      setCancelMessage({
        type: "error",
        text: t("account.billing.errorGeneric"),
      });
    } finally {
      setManageLoading(false);
    }
  }

  async function handleCancelSubscription() {
    const confirmed = window.confirm(t("account.billing.cancelConfirm"));
    if (!confirmed) return;

    setCancelLoading(true);
    setCancelMessage(null);
    try {
      const res = await fetch("/api/org", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "cancel_subscription" }),
      });
      const data = await res.json();
      if (data.success) {
        setCancelMessage({
          type: "success",
          text: t("account.billing.cancelSuccess"),
        });
      } else {
        setCancelMessage({
          type: "error",
          text: data.error || t("account.billing.errorGeneric"),
        });
      }
    } catch {
      setCancelMessage({
        type: "error",
        text: t("account.billing.errorGeneric"),
      });
    } finally {
      setCancelLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600" />
      </div>
    );
  }

  const plan = org?.plan || "trial";
  const badgeColor = PLAN_BADGE_COLORS[plan] || PLAN_BADGE_COLORS.trial;
  const isTrial = plan === "trial";
  const hasSubscription = !!org?.stripe_subscription_id;

  return (
    <div className="space-y-6">
      {/* Section 1: Aktueller Plan */}
      <div className="bg-white rounded-none border border-gray-200 p-6 hover:shadow-md transition-all duration-300">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {t("account.billing.currentPlan")}
        </h2>

        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <span
              className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold ${badgeColor}`}
            >
              {plan.charAt(0).toUpperCase() + plan.slice(1)}
            </span>
          </div>
          <Link
            href="/einstellungen/abo"
            className="bg-brand-600 text-white px-6 py-2.5 rounded-none hover:bg-brand-700 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 text-sm font-medium"
          >
            {t("account.billing.changePlan")}
          </Link>
        </div>

        <div className="mt-4 space-y-1">
          {isTrial && org?.trial_ends_at && (
            <p className="text-sm text-[#F5C518]">
              {t("account.billing.trialEnds", {
                date: new Date(org.trial_ends_at).toLocaleDateString(
                  dateFmtLocale
                ),
              })}
            </p>
          )}
          {!isTrial && (
            <p className="text-sm text-gray-500">
              {t("account.billing.nextPayment")}: —
            </p>
          )}
        </div>
      </div>

      {/* Section 2: Zahlungsmethode */}
      <div className="bg-white rounded-none border border-gray-200 p-6 hover:shadow-md transition-all duration-300">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {t("account.billing.paymentMethod")}
        </h2>

        {hasSubscription ? (
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-[#F5C518]/10 rounded-none p-2.5">
                <svg
                  className="w-6 h-6 text-[#1A1A1A]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Stripe</p>
                <p className="text-xs text-gray-500">
                  ID: ...{org.stripe_subscription_id!.slice(-6)}
                </p>
              </div>
            </div>
            <button
              onClick={handleManageBilling}
              disabled={manageLoading}
              className="border border-gray-200 text-gray-700 px-6 py-2.5 rounded-none hover:bg-gray-50 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 text-sm font-medium disabled:opacity-50 disabled:cursor-wait"
            >
              {manageLoading
                ? t("common.loading")
                : t("account.billing.change")}
            </button>
          </div>
        ) : (
          <p className="text-sm text-gray-500">
            {t("account.billing.noPayment")}
          </p>
        )}
      </div>

      {/* Section 3: Rechnungen */}
      <div className="bg-white rounded-none border border-gray-200 p-6 hover:shadow-md transition-all duration-300">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {t("account.billing.invoices")}
        </h2>
        <p className="text-sm text-gray-500">
          {t("account.billing.noInvoices")}
        </p>
      </div>

      {/* Section 4: Vertrag widerrufen */}
      {hasSubscription && (
        <div className="bg-white rounded-none border border-gray-200 p-6 hover:shadow-md transition-all duration-300">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {t("account.billing.cancelSection")}
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            {t("account.billing.cancelDescription")}
          </p>

          <button
            onClick={handleCancelSubscription}
            disabled={cancelLoading}
            className="border-2 border-red-500 text-red-600 px-6 py-2.5 rounded-none hover:bg-red-50 shadow-sm hover:-translate-y-0.5 transition-all duration-300 text-sm font-semibold disabled:opacity-50 disabled:cursor-wait"
          >
            {cancelLoading
              ? t("common.loading")
              : t("account.billing.cancelContract")}
          </button>

          {cancelMessage && (
            <div
              className={`mt-4 p-3 rounded-none text-sm ${
                cancelMessage.type === "success"
                  ? "bg-[#FEF9C3] text-[#1A1A1A] border border-[#F5C518]/30"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {cancelMessage.text}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
