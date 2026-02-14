"use client";

import { useEffect, useState } from "react";
import { useOrg } from "@/lib/hooks/useOrg";
import { useLocale } from "@/i18n/LocaleContext";
import UpgradeCard from "@/components/dashboard/UpgradeCard";
import { formatDate } from "@/lib/utils";

interface ApiKey {
  id: string;
  name: string;
  key_prefix: string;
  last_used_at: string | null;
  is_active: boolean;
  created_at: string;
}

export default function ApiSettingsPage() {
  const { org, loading: orgLoading } = useOrg();
  const { t } = useLocale();
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [newKeyName, setNewKeyName] = useState("");
  const [createdKey, setCreatedKey] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (orgLoading) return;
    if (!org?.features_api) {
      setLoading(false);
      return;
    }
    fetch("/api/api-keys")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setKeys(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [org, orgLoading]);

  async function handleCreate() {
    if (!newKeyName.trim()) return;
    setCreating(true);
    setError("");
    setCreatedKey(null);
    try {
      const res = await fetch("/api/api-keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newKeyName.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || t("api.createError"));
        return;
      }
      setCreatedKey(data.key);
      setNewKeyName("");
      // Refresh list
      const listRes = await fetch("/api/api-keys");
      const listData = await listRes.json();
      if (Array.isArray(listData)) setKeys(listData);
    } catch {
      setError(t("common.networkError"));
    } finally {
      setCreating(false);
    }
  }

  async function handleRevoke(id: string) {
    await fetch(`/api/api-keys?id=${id}`, { method: "DELETE" });
    setKeys((prev) => prev.filter((k) => k.id !== id));
  }

  if (orgLoading || loading) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{t("api.title")}</h1>
          <p className="text-gray-600">{t("api.subtitle")}</p>
        </div>
        <div className="bg-white rounded-xl border p-8 animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (!org?.features_api) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{t("api.title")}</h1>
          <p className="text-gray-600">{t("api.subtitle")}</p>
        </div>
        <UpgradeCard feature={t("api.upgradeFeature")} requiredPlan="Team" icon="🔑" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t("api.title")}</h1>
        <p className="text-gray-600">
          {t("api.subtitle")}
        </p>
      </div>

      {/* Create key */}
      <div className="bg-white rounded-xl border p-6 mb-6">
        <h2 className="font-semibold mb-3">{t("api.createSection")}</h2>
        <div className="flex gap-3">
          <input
            type="text"
            value={newKeyName}
            onChange={(e) => setNewKeyName(e.target.value)}
            placeholder={t("api.createPlaceholder")}
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            maxLength={100}
          />
          <button
            onClick={handleCreate}
            disabled={creating || !newKeyName.trim()}
            className="px-4 py-2 rounded-lg bg-brand-600 text-white text-sm font-medium hover:bg-brand-700 disabled:opacity-50 transition"
          >
            {creating ? t("api.creating") : t("api.createButton")}
          </button>
        </div>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>

      {/* Newly created key (show once) */}
      {createdKey && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
          <h3 className="font-semibold text-green-800 mb-2">
            {t("api.createdTitle")}
          </h3>
          <p className="text-sm text-green-700 mb-3">
            {t("api.createdHint")}
          </p>
          <code className="block bg-white border rounded-lg p-3 text-xs font-mono break-all select-all">
            {createdKey}
          </code>
          <button
            onClick={() => {
              navigator.clipboard.writeText(createdKey);
            }}
            className="mt-3 px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition"
          >
            {t("api.copy")}
          </button>
        </div>
      )}

      {/* Key list */}
      <div className="bg-white rounded-xl border">
        <div className="p-4 border-b">
          <h2 className="font-semibold">{t("api.activeKeys")}</h2>
        </div>
        {keys.length > 0 ? (
          <div className="divide-y">
            {keys.map((k) => (
              <div key={k.id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium">{k.name}</p>
                  <p className="text-sm text-gray-500 font-mono">{k.key_prefix}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {t("api.created", { date: formatDate(k.created_at) })}
                    {k.last_used_at && ` · ${t("api.lastUsed", { date: formatDate(k.last_used_at) })}`}
                  </p>
                </div>
                <button
                  onClick={() => handleRevoke(k.id)}
                  className="text-red-500 hover:text-red-700 text-sm font-medium"
                >
                  {t("api.revoke")}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">
            {t("api.noKeys")}
          </div>
        )}
      </div>

      {/* API docs hint */}
      <div className="mt-6 bg-gray-50 rounded-xl border p-6">
        <h3 className="font-semibold mb-2">{t("api.docsSection")}</h3>
        <div className="space-y-2 text-sm text-gray-700 font-mono">
          <p>GET /api/v1/prices?material=steel_rebar&days=30</p>
          <p>GET /api/v1/analysis?material=copper_lme</p>
          <p>GET /api/v1/materials?category=steel</p>
        </div>
        <p className="text-sm text-gray-500 mt-3">
          {t("api.authLabel")} <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">{t("api.authScheme")}</code>
        </p>
        <p className="text-sm text-gray-500 mt-1">
          {t("api.rateLimit")}
        </p>
      </div>
    </div>
  );
}
