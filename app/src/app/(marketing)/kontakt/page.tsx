"use client";

import { useState } from "react";
import { useLocale } from "@/i18n/LocaleContext";

export default function KontaktPage() {
  const { t } = useLocale();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  function handleChange(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (result) setResult(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setResult(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setResult({
          type: "error",
          text: data.errorKey ? t(data.errorKey) : (data.error || t("contact.error")),
        });
      } else {
        setResult({ type: "success", text: t("contact.success") });
        setForm({ name: "", email: "", message: "" });
      }
    } catch {
      setResult({ type: "error", text: t("common.networkError") });
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="pt-32 pb-20 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {t("contact.heading")}
        </h1>
        <p className="text-gray-600 mb-8">{t("contact.subtitle")}</p>

        {/* Contact email */}
        <div className="mb-8 p-4 bg-gray-50 rounded-lg border">
          <p className="text-sm text-gray-600">{t("contact.emailLabel")}</p>
          <a
            href="mailto:pashchenkoh@gmail.com"
            className="text-brand-600 font-medium hover:underline"
          >
            pashchenkoh@gmail.com
          </a>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label
              htmlFor="contact-name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {t("contact.name")} *
            </label>
            <input
              id="contact-name"
              type="text"
              required
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              placeholder={t("contact.namePlaceholder")}
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="contact-email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {t("contact.email")} *
            </label>
            <input
              id="contact-email"
              type="email"
              required
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              placeholder={t("contact.emailPlaceholder")}
            />
          </div>

          {/* Message */}
          <div>
            <label
              htmlFor="contact-message"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {t("contact.message")} *
            </label>
            <textarea
              id="contact-message"
              required
              rows={5}
              value={form.message}
              onChange={(e) => handleChange("message", e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 resize-vertical"
              placeholder={t("contact.messagePlaceholder")}
            />
          </div>

          {/* Result message */}
          {result && (
            <div
              className={`p-3 rounded-lg text-sm ${
                result.type === "success"
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {result.text}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={sending}
            className="bg-brand-600 text-white px-6 py-3 rounded-lg hover:bg-brand-700 transition disabled:opacity-50 font-medium"
          >
            {sending ? t("contact.sending") : t("contact.send")}
          </button>
        </form>
      </div>
    </main>
  );
}
