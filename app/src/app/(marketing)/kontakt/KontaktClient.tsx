"use client";

import { useState, useEffect } from "react";
import { useLocale } from "@/i18n/LocaleContext";
import { BauhausOverlay } from "@/components/decorations";
import { TileCircleOnYellow } from "@/components/tiles";

export default function KontaktPage() {
  const { t } = useLocale();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("is-visible");
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
        setResult({ type: "error", text: data.errorKey ? t(data.errorKey) : (data.error || t("contact.error")) });
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
      {/* ═══ HERO ═══ */}
      <section className="relative pt-32 pb-16 px-4 overflow-hidden bg-[#1A1A1A]">
        <BauhausOverlay variant="sparse" opacity={0.06} />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <span className="text-xs font-bold tracking-[0.12em] uppercase text-[#F5C518] mb-4 inline-block font-grotesk">
            BauPreis AI
          </span>
          <h1 className="font-oswald text-4xl sm:text-5xl lg:text-6xl uppercase text-white mb-4 tracking-wide">
            {t("contact.heading")}
          </h1>
          <p className="text-lg text-white/60 max-w-xl mx-auto font-grotesk">
            {t("contact.subtitle")}
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 flex h-1">
          <div className="flex-[3] bg-[#C1292E]" />
          <div className="flex-[2] bg-[#F5C518]" />
          <div className="flex-[1] bg-[#BC8279]" />
          <div className="flex-[4] bg-white/10" />
        </div>
      </section>

      {/* ═══ CONTENT ═══ */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto grid gap-6 lg:grid-cols-3">
          {/* Info card */}
          <div className="animate-on-scroll anim-delay-1 lg:col-span-1">
            <div className="bg-white p-8 border-2 border-[#1A1A1A] shadow-[4px_4px_0_#F5C518] h-full">
              <div className="mb-6 inline-flex items-center justify-center w-12 h-12 bg-[#C1292E]">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-xs font-bold uppercase tracking-wide text-[#1A1A1A]/50 mb-1 font-grotesk">{t("contact.emailLabel")}</p>
              <a
                href="mailto:pashchenkoh@gmail.com"
                className="text-[#C1292E] font-bold hover:underline text-lg font-grotesk"
              >
                pashchenkoh@gmail.com
              </a>

              {/* Tile decoration */}
              <div className="mt-8 opacity-15">
                <TileCircleOnYellow size={100} />
              </div>
            </div>
          </div>

          {/* Form card */}
          <div className="animate-on-scroll anim-delay-2 lg:col-span-2">
            <div className="bg-white p-8 border-2 border-[#1A1A1A] shadow-[6px_6px_0_#C1292E]">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="contact-name" className="block text-xs font-bold uppercase tracking-wide text-[#1A1A1A]/60 mb-2 font-grotesk">
                    {t("contact.name")} *
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className="w-full px-4 py-3 border-2 border-[#1A1A1A] rounded-none focus:border-[#C1292E] focus:outline-none transition font-grotesk bg-gray-50 focus:bg-white"
                    placeholder={t("contact.namePlaceholder")}
                  />
                </div>

                <div>
                  <label htmlFor="contact-email" className="block text-xs font-bold uppercase tracking-wide text-[#1A1A1A]/60 mb-2 font-grotesk">
                    {t("contact.email")} *
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className="w-full px-4 py-3 border-2 border-[#1A1A1A] rounded-none focus:border-[#C1292E] focus:outline-none transition font-grotesk bg-gray-50 focus:bg-white"
                    placeholder={t("contact.emailPlaceholder")}
                  />
                </div>

                <div>
                  <label htmlFor="contact-message" className="block text-xs font-bold uppercase tracking-wide text-[#1A1A1A]/60 mb-2 font-grotesk">
                    {t("contact.message")} *
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => handleChange("message", e.target.value)}
                    className="w-full px-4 py-3 border-2 border-[#1A1A1A] rounded-none focus:border-[#C1292E] focus:outline-none transition resize-vertical font-grotesk bg-gray-50 focus:bg-white"
                    placeholder={t("contact.messagePlaceholder")}
                  />
                </div>

                {result && (
                  <div className={`p-4 text-sm font-bold font-grotesk ${
                    result.type === "success"
                      ? "bg-[#F5C518]/20 text-[#1A1A1A] border-2 border-[#F5C518]"
                      : "bg-[#C1292E]/10 text-[#C1292E] border-2 border-[#C1292E]"
                  }`}>
                    {result.text}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full bg-[#C1292E] text-white px-6 py-4 font-oswald text-lg uppercase tracking-wide shadow-[4px_4px_0_#1A1A1A] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_#1A1A1A] transition-all disabled:opacity-50"
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
