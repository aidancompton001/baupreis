"use client";

import { useEffect } from "react";
import { useLocale } from "@/i18n/LocaleContext";
import { BauhausOverlay } from "@/components/decorations";
import { TileRedYellowSplit, TileCircleOnYellow } from "@/components/tiles";

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
        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
      ),
    },
    {
      title: t("aboutUs.drivers.title"),
      text: t("aboutUs.drivers.text"),
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
      ),
    },
    {
      title: t("aboutUs.madeInGermany.title"),
      text: t("aboutUs.madeInGermany.text"),
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
      ),
    },
    {
      title: t("aboutUs.contact.title"),
      text: "",
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
      ),
      isContact: true,
    },
  ];

  return (
    <main className="min-h-screen">
      {/* ═══ HERO ═══ */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden bg-[#1A1A1A]">
        <BauhausOverlay variant="medium" opacity={0.06} />
        <div className="absolute top-8 right-8 hidden lg:flex gap-2 opacity-20">
          <TileRedYellowSplit size={100} />
          <TileCircleOnYellow size={100} />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <span className="text-xs font-bold tracking-[0.12em] uppercase text-[#F5C518] mb-4 inline-block font-grotesk">
            BauPreis AI
          </span>
          <h1 className="font-oswald text-4xl sm:text-5xl lg:text-6xl uppercase text-white mb-6 tracking-wide">
            {t("aboutUs.heading")}
          </h1>
          <p className="text-lg sm:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed font-grotesk">
            {t("aboutUs.intro")}
          </p>
        </div>
        {/* Bauhaus color bar */}
        <div className="absolute bottom-0 left-0 right-0 flex h-1">
          <div className="flex-[3] bg-[#C1292E]" />
          <div className="flex-[2] bg-[#F5C518]" />
          <div className="flex-[1] bg-[#BC8279]" />
          <div className="flex-[4] bg-white/10" />
        </div>
      </section>

      {/* ═══ CARDS ═══ */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto grid gap-6 sm:grid-cols-2">
          {sections.map((s, i) => (
            <div
              key={i}
              className={`animate-on-scroll anim-delay-${i + 1} bg-white p-8 border-2 border-[#1A1A1A] transition-all hover:-translate-y-1 hover:shadow-[4px_4px_0_#C1292E]`}
            >
              <div className="mb-4 inline-flex items-center justify-center w-12 h-12 bg-[#C1292E]">
                {s.icon}
              </div>
              <h2 className="font-oswald text-xl uppercase text-[#1A1A1A] mb-3">{s.title}</h2>
              {s.isContact ? (
                <p className="text-[#1A1A1A]/60 leading-relaxed font-grotesk">
                  {t("aboutUs.contact.text").split("kontakt@baupreis.ai")[0]}
                  <a href="mailto:kontakt@baupreis.ai" className="text-[#C1292E] font-bold hover:underline">
                    kontakt@baupreis.ai
                  </a>
                </p>
              ) : (
                <p className="text-[#1A1A1A]/60 leading-relaxed font-grotesk">{s.text}</p>
              )}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
