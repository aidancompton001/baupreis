"use client";

import { useEffect, useState } from "react";
import { formatDate } from "@/lib/utils";
import { SkeletonListRow } from "@/components/dashboard/Skeleton";
import { useLocale } from "@/i18n/LocaleContext";

export default function AlertsPage() {
  const { t } = useLocale();

  const RULE_TYPE_LABELS: Record<string, string> = {
    price_change: t("alerts.ruleType.priceChange"),
    price_above: t("alerts.ruleType.priceAbove"),
    price_below: t("alerts.ruleType.priceBelow"),
    daily_summary: t("alerts.ruleType.dailySummary"),
  };

  const CHANNEL_LABELS: Record<string, string> = {
    email: t("alerts.channel.email"),
    telegram: t("alerts.channel.telegram"),
    whatsapp: t("alerts.channel.whatsapp"),
    both: t("alerts.channel.both"),
    all: t("alerts.channel.all"),
  };

  const PRIORITY_LABELS: Record<string, string> = {
    low: t("alerts.priority.low"),
    medium: t("alerts.priority.medium"),
    high: t("alerts.priority.high"),
  };

  const TIME_WINDOW_LABELS: Record<string, string> = {
    "1h": t("alerts.timeWindow.1h"),
    "6h": t("alerts.timeWindow.6h"),
    "24h": t("alerts.timeWindow.24h"),
    "7d": t("alerts.timeWindow.7d"),
    "30d": t("alerts.timeWindow.30d"),
  };
  const [rules, setRules] = useState<any[]>([]);
  const [sent, setSent] = useState<any[]>([]);
  const [materials, setMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Form state
  const [ruleType, setRuleType] = useState("price_change");
  const [materialId, setMaterialId] = useState("");
  const [threshold, setThreshold] = useState("5");
  const [channel, setChannel] = useState("email");
  const [timeWindow, setTimeWindow] = useState("24h");
  const [priority, setPriority] = useState("medium");

  useEffect(() => {
    Promise.all([
      fetch("/api/alerts").then((r) => r.json()),
      fetch("/api/prices?days=1").then((r) => r.json()),
    ])
      .then(([alertData, priceData]) => {
        setRules(alertData.rules || []);
        setSent(alertData.sent || []);
        // Extract unique materials from price data
        const seen = new Set();
        const mats: any[] = [];
        if (Array.isArray(priceData)) {
          for (const p of priceData) {
            if (!seen.has(p.code)) {
              seen.add(p.code);
              mats.push({ id: p.material_id, code: p.code, name_de: p.name_de });
            }
          }
        }
        setMaterials(mats);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function deleteRule(id: string) {
    await fetch(`/api/alerts?id=${id}`, { method: "DELETE" });
    setRules(rules.filter((r) => r.id !== id));
    setDeleteConfirm(null);
  }

  async function createRule() {
    setFormError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rule_type: ruleType,
          material_id: materialId || null,
          threshold_pct: parseFloat(threshold),
          channel,
          time_window: timeWindow,
          priority,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setFormError(data.errorKey ? t(data.errorKey) : (data.error || t("alerts.error.create")));
        return;
      }
      // Refresh rules list
      const refreshed = await fetch("/api/alerts").then((r) => r.json());
      setRules(refreshed.rules || []);
      setShowForm(false);
      resetForm();
    } catch {
      setFormError(t("alerts.error.connection"));
    } finally {
      setSubmitting(false);
    }
  }

  function resetForm() {
    setRuleType("price_change");
    setMaterialId("");
    setThreshold("5");
    setChannel("email");
    setTimeWindow("24h");
    setPriority("medium");
    setFormError("");
  }

  if (loading) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t("alerts.title")}</h1>
            <p className="text-gray-600">{t("alerts.subtitle")}</p>
          </div>
          <div className="bg-gray-200 rounded-lg animate-pulse h-10 w-28" />
        </div>
        <div className="bg-white rounded-xl border">
          <div className="p-4 border-b">
            <div className="bg-gray-200 rounded animate-pulse h-5 w-32" />
          </div>
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonListRow key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t("alerts.title")}</h1>
          <p className="text-gray-600">
            {t("alerts.subtitle")}
          </p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700 transition text-sm font-medium"
        >
          {t("alerts.addButton")}
        </button>
      </div>

      {/* Active Rules */}
      <div className="bg-white rounded-xl border mb-6">
        <div className="p-4 border-b">
          <h2 className="font-semibold">{t("alerts.activeRules", { count: rules.length })}</h2>
        </div>
        {rules.length > 0 ? (
          <div className="divide-y">
            {rules.map((rule) => (
              <div
                key={rule.id}
                className="p-4 flex items-center justify-between"
              >
                <div>
                  <p className="font-medium">
                    {rule.name_de || t("alerts.modal.allMaterials")}
                  </p>
                  <p className="text-sm text-gray-500">
                    {RULE_TYPE_LABELS[rule.rule_type] || rule.rule_type}
                    {rule.threshold_pct ? ` > ${rule.threshold_pct}%` : ""}
                    {" · "}
                    {CHANNEL_LABELS[rule.channel] || rule.channel}
                    {rule.time_window ? ` · ${TIME_WINDOW_LABELS[rule.time_window] || rule.time_window}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      rule.is_active
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {rule.is_active ? t("alerts.active") : t("alerts.inactive")}
                  </span>
                  {deleteConfirm === rule.id ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => deleteRule(rule.id)}
                        className="text-red-600 hover:text-red-800 text-xs font-medium"
                      >
                        {t("alerts.deleteConfirm")}
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="text-gray-500 hover:text-gray-700 text-xs"
                      >
                        {t("common.cancel")}
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirm(rule.id)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      {t("common.delete")}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">
            {t("alerts.noRules")}
          </div>
        )}
      </div>

      {/* Sent Alerts Log */}
      <div className="bg-white rounded-xl border">
        <div className="p-4 border-b">
          <h2 className="font-semibold">{t("alerts.sentAlarms")}</h2>
        </div>
        {sent.length > 0 ? (
          <div className="divide-y">
            {sent.map((alert) => (
              <div key={alert.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-sm">
                      {alert.name_de || alert.code}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {alert.message_text}
                    </p>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    <p>{formatDate(alert.sent_at)}</p>
                    <p className="text-xs">{alert.channel}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">
            {t("alerts.noSentAlarms")}
          </div>
        )}
      </div>

      {/* Create Alert Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">{t("alerts.modal.title")}</h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                &times;
              </button>
            </div>

            <div className="space-y-4">
              {/* Material */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("alerts.modal.material")}
                </label>
                <select
                  value={materialId}
                  onChange={(e) => setMaterialId(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                >
                  <option value="">{t("alerts.modal.allMaterials")}</option>
                  {materials.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name_de}
                    </option>
                  ))}
                </select>
              </div>

              {/* Rule Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("alerts.modal.alarmType")}
                </label>
                <select
                  value={ruleType}
                  onChange={(e) => setRuleType(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                >
                  {Object.entries(RULE_TYPE_LABELS).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>

              {/* Threshold */}
              {ruleType !== "daily_summary" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("alerts.modal.threshold")}
                    {ruleType === "price_change" ? " (%)" : " (€)"}
                  </label>
                  <input
                    type="number"
                    value={threshold}
                    onChange={(e) => setThreshold(e.target.value)}
                    min="0"
                    max="100"
                    step="0.5"
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                    placeholder={ruleType === "price_change" ? t("alerts.modal.thresholdPlaceholderPct") : t("alerts.modal.thresholdPlaceholderEur")}
                  />
                  {ruleType === "price_change" && (
                    <p className="text-xs text-gray-400 mt-1">
                      {t("alerts.modal.thresholdHint", { threshold: threshold || "..." })}
                    </p>
                  )}
                </div>
              )}

              {/* Time Window */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("alerts.modal.timeWindow")}
                </label>
                <select
                  value={timeWindow}
                  onChange={(e) => setTimeWindow(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                >
                  {Object.entries(TIME_WINDOW_LABELS).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>

              {/* Channel */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("alerts.modal.channel")}
                </label>
                <div className="flex gap-2">
                  {Object.entries(CHANNEL_LABELS).map(([k, v]) => (
                    <button
                      key={k}
                      type="button"
                      onClick={() => setChannel(k)}
                      className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition border ${
                        channel === k
                          ? "bg-brand-50 border-brand-500 text-brand-700"
                          : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("alerts.modal.priority")}
                </label>
                <div className="flex gap-2">
                  {Object.entries(PRIORITY_LABELS).map(([k, v]) => (
                    <button
                      key={k}
                      type="button"
                      onClick={() => setPriority(k)}
                      className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition border ${
                        priority === k
                          ? "bg-brand-50 border-brand-500 text-brand-700"
                          : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              {/* Error */}
              {formError && (
                <div className="bg-red-50 text-red-700 text-sm p-3 rounded-lg">
                  {formError}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowForm(false)}
                  className="flex-1 border rounded-lg py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
                >
                  {t("common.cancel")}
                </button>
                <button
                  onClick={createRule}
                  disabled={submitting}
                  className="flex-1 bg-brand-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-brand-700 transition disabled:opacity-50"
                >
                  {submitting ? t("alerts.modal.creating") : t("alerts.modal.create")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
