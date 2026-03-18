"use client";

import { useEffect } from "react";
import { useLocale } from "@/i18n/LocaleContext";

export default function UeberUnsPage() {
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

  const sections = [
    {
      title: t("aboutUs.mission.title"),
      text: t("aboutUs.mission.text"),
      icon: (
        <svg className="w-8 h-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
      ),
    },
    {
      title: t("aboutUs.drivers.title"),
      text: t("aboutUs.drivers.text"),
      icon: (
        <svg className="w-8 h-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
      ),
    },
    {
      title: t("aboutUs.madeInGermany.title"),
      text: t("aboutUs.madeInGermany.text"),
      icon: (
        <svg className="w-8 h-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
      ),
    },
    {
      title: t("aboutUs.contact.title"),
      text: "",
      icon: (
        <svg className="w-8 h-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
      ),
      isContact: true,
    },
  ];

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="relative max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-6 tracking-tight">
            {t("aboutUs.heading")}
          </h1>
          <p className="text-lg sm:text-xl text-indigo-100 max-w-2xl mx-auto leading-relaxed">
            {t("aboutUs.intro")}
          </p>
        </div>
      </section>

      {/* Cards */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto grid gap-8 sm:grid-cols-2">
          {sections.map((s, i) => (
            <div
              key={i}
              className={`animate-on-scroll anim-delay-${i + 1} bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-lg transition-shadow duration-300`}
            >
              <div className="mb-4 inline-flex items-center justify-center w-14 h-14 rounded-xl bg-indigo-50">
                {s.icon}
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">{s.title}</h2>
              {s.isContact ? (
                <p className="text-gray-600 leading-relaxed">
                  {t("aboutUs.contact.text").split("kontakt@baupreis.ai")[0]}
                  <a href="mailto:kontakt@baupreis.ai" className="text-indigo-600 font-medium hover:underline">
                    kontakt@baupreis.ai
                  </a>
                </p>
              ) : (
                <p className="text-gray-600 leading-relaxed">{s.text}</p>
              )}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
