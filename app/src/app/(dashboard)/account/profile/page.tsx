"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/i18n/LocaleContext";

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  company: string;
  vatId: string;
  billingStreet: string;
  billingCity: string;
  billingZip: string;
  billingCountry: string;
}

const EMPTY_PROFILE: ProfileData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  position: "",
  company: "",
  vatId: "",
  billingStreet: "",
  billingCity: "",
  billingZip: "",
  billingCountry: "Deutschland",
};

export default function ProfilePage() {
  const { t } = useLocale();
  const [form, setForm] = useState<ProfileData>(EMPTY_PROFILE);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    fetch("/api/account/profile")
      .then((r) => r.json())
      .then((data) => {
        setForm({
          firstName: data.firstName ?? "",
          lastName: data.lastName ?? "",
          email: data.email ?? "",
          phone: data.phone ?? "",
          position: data.position ?? "",
          company: data.company ?? "",
          vatId: data.vatId ?? "",
          billingStreet: data.billingStreet ?? "",
          billingCity: data.billingCity ?? "",
          billingZip: data.billingZip ?? "",
          billingCountry: data.billingCountry || "Deutschland",
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  function handleChange(field: keyof ProfileData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (message) setMessage(null);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/account/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setMessage({ type: "success", text: t("account.profile.saved") });
      } else {
        const data = await res.json().catch(() => ({}));
        setMessage({
          type: "error",
          text: data.error || t("account.profile.saveError"),
        });
      }
    } catch {
      setMessage({ type: "error", text: t("account.profile.saveError") });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">{t("common.loading")}</p>
      </div>
    );
  }

  const inputClass =
    "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-2xl">
      {/* Success / Error Message */}
      {message && (
        <div
          className={`px-4 py-3 rounded-lg text-sm ${
            message.type === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Section: Personal Data */}
      <div className="bg-white rounded-xl border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {t("account.profile.personalData")}
        </h2>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className={labelClass}>
                {t("account.profile.firstName")}
              </label>
              <input
                id="firstName"
                type="text"
                value={form.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="lastName" className={labelClass}>
                {t("account.profile.lastName")}
              </label>
              <input
                id="lastName"
                type="text"
                value={form.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className={labelClass}>
              {t("account.profile.email")}
            </label>
            <input
              id="email"
              type="email"
              value={form.email}
              disabled
              className={`${inputClass} bg-gray-50 text-gray-500 cursor-not-allowed`}
            />
            <p className="text-xs text-gray-400 mt-1">
              {t("account.profile.emailHint")}
            </p>
          </div>

          <div>
            <label htmlFor="phone" className={labelClass}>
              {t("account.profile.phone")}
            </label>
            <input
              id="phone"
              type="tel"
              value={form.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="position" className={labelClass}>
              {t("account.profile.position")}
            </label>
            <input
              id="position"
              type="text"
              value={form.position}
              onChange={(e) => handleChange("position", e.target.value)}
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* Section: Company */}
      <div className="bg-white rounded-xl border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {t("account.profile.companySection")}
        </h2>

        <div className="space-y-4">
          <div>
            <label htmlFor="company" className={labelClass}>
              {t("account.profile.company")}
            </label>
            <input
              id="company"
              type="text"
              value={form.company}
              onChange={(e) => handleChange("company", e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="vatId" className={labelClass}>
              {t("account.profile.vatId")}
            </label>
            <input
              id="vatId"
              type="text"
              value={form.vatId}
              onChange={(e) => handleChange("vatId", e.target.value)}
              placeholder="DE123456789"
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* Section: Billing Address */}
      <div className="bg-white rounded-xl border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {t("account.profile.billingAddress")}
        </h2>

        <div className="space-y-4">
          <div>
            <label htmlFor="billingStreet" className={labelClass}>
              {t("account.profile.street")}
            </label>
            <input
              id="billingStreet"
              type="text"
              value={form.billingStreet}
              onChange={(e) => handleChange("billingStreet", e.target.value)}
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="billingZip" className={labelClass}>
                {t("account.profile.zip")}
              </label>
              <input
                id="billingZip"
                type="text"
                value={form.billingZip}
                onChange={(e) => handleChange("billingZip", e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="billingCity" className={labelClass}>
                {t("account.profile.city")}
              </label>
              <input
                id="billingCity"
                type="text"
                value={form.billingCity}
                onChange={(e) => handleChange("billingCity", e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label htmlFor="billingCountry" className={labelClass}>
              {t("account.profile.country")}
            </label>
            <input
              id="billingCountry"
              type="text"
              value={form.billingCountry}
              onChange={(e) => handleChange("billingCountry", e.target.value)}
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className={`px-6 py-2.5 rounded-lg text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 transition ${
            saving ? "opacity-50 cursor-wait" : ""
          }`}
        >
          {saving ? t("common.saving") : t("account.profile.save")}
        </button>
      </div>
    </form>
  );
}
