"use client";

import { useState, useEffect } from "react";
import { useLocale } from "@/i18n/LocaleContext";

export default function KontaktPage() {
  const { t } = useLocale();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll(".animate-on-scroll").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

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
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative pt-32 pb-16 px-4 overflow-hidden bg-gradient-to-br from-brand-600 via-brand-700 to-purple-800">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="relative max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold font-grotesk text-white mb-4 tracking-tight">
            {t("contact.heading")}
          </h1>
          <p className="text-lg text-brand-100 max-w-xl mx-auto">
            {t("contact.subtitle")}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto grid gap-8 lg:grid-cols-3">
          {/* Contact info card */}
          <div className="animate-on-scroll anim-delay-1 lg:col-span-1">
            <div className="bg-white rounded-xl p-8 border border-gray-100 shadow-sm h-full">
              <div className="mb-6 inline-flex items-center justify-center w-14 h-14 rounded-xl bg-brand-50">
                <svg className="w-8 h-8 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-sm text-gray-500 mb-1">{t("contact.emailLabel")}</p>
              <a
                href="mailto:pashchenkoh@gmail.com"
                className="text-brand-600 font-semibold hover:underline text-lg"
              >
                pashchenkoh@gmail.com
              </a>
            </div>
          </div>

          {/* Contact form card */}
          <div className="animate-on-scroll anim-delay-2 lg:col-span-2">
            <div className="bg-white rounded-xl p-8 border border-gray-100 shadow-lg">
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
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition bg-gray-50 focus:bg-white"
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
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition bg-gray-50 focus:bg-white"
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
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition resize-vertical bg-gray-50 focus:bg-white"
                    placeholder={t("contact.messagePlaceholder")}
                  />
                </div>

                {/* Result message */}
                {result && (
                  <div
                    className={`p-4 rounded-xl text-sm font-medium ${
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
                  className="w-full bg-brand-600 text-white px-6 py-3.5 rounded-xl hover:bg-brand-700 transition-all duration-200 disabled:opacity-50 font-semibold text-lg shadow-md hover:shadow-lg"
                >
                  {sending ? t("contact.sending") : t("contact.send")}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
