"use client";

import { useEffect } from "react";
import { useLocale } from "@/i18n/LocaleContext";

export default function BlogPage() {
  const { t } = useLocale();

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

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative pt-32 pb-16 px-4 overflow-hidden bg-gradient-to-br from-brand-600 via-brand-700 to-purple-800">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="relative max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold font-grotesk text-white mb-4 tracking-tight">
            {t("blog.heading")}
          </h1>
          <p className="text-lg text-brand-100 max-w-2xl mx-auto">
            {t("blog.subheading")}
          </p>
        </div>
      </section>

      {/* Placeholder */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="animate-on-scroll anim-delay-1 bg-white rounded-xl p-12 border border-gray-100 shadow-sm text-center">
            <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-xl bg-brand-50">
              <svg className="w-8 h-8 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <p className="text-xl text-gray-700 font-semibold mb-2">{t("blog.placeholder1")}</p>
            <p className="text-gray-500">
              {t("blog.placeholder2")}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
