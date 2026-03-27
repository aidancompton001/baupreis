"use client";

import { useEffect } from "react";
import { useLocale } from "@/i18n/LocaleContext";
import { changelogEntries, type ChangelogEntry } from "@/changelog/entries";
import { BauhausOverlay } from "@/components/decorations";

const TYPE_STYLES: Record<ChangelogEntry["type"], { label: { de: string; en: string }; className: string }> = {
  feature: { label: { de: "NEU", en: "NEW" }, className: "bg-brand-600 text-white" },
  improvement: { label: { de: "VERBESSERUNG", en: "IMPROVEMENT" }, className: "bg-[#F5C518] text-[#1A1A1A]" },
  fix: { label: { de: "FIX", en: "FIX" }, className: "bg-[#BC8279] text-white" },
  design: { label: { de: "DESIGN", en: "DESIGN" }, className: "bg-[#1A1A1A] text-white" },
};

export default function ChangelogClient() {
  const { locale } = useLocale();
  const isEn = locale === "en";

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
      <section className="relative pt-32 pb-16 px-4 overflow-hidden bg-[#1A1A1A]">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <BauhausOverlay variant="sparse" opacity={0.05} />
        <div className="relative max-w-4xl mx-auto text-center">
          <span className="text-xs font-bold tracking-[0.12em] uppercase text-[#F5C518] mb-4 inline-block font-grotesk">
            {isEn ? "PLATFORM UPDATES" : "PLATTFORM-UPDATES"}
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold font-oswald uppercase text-white mb-3">
            {isEn ? "WHAT'S NEW" : "NEUIGKEITEN"}
          </h1>
          <p className="text-base text-white/60 max-w-lg mx-auto">
            {isEn
              ? "All changes, new features and improvements to the BauPreis AI platform — documented chronologically."
              : "Alle Änderungen, neue Features und Verbesserungen der BauPreis AI Plattform — chronologisch dokumentiert."}
          </p>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          {/* Timeline line */}
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-[#1A1A1A]/10 hidden sm:block" />

            {changelogEntries.map((entry, i) => {
              const style = TYPE_STYLES[entry.type];
              const title = isEn ? entry.titleEn : entry.titleDe;
              const description = isEn ? entry.descriptionEn : entry.descriptionDe;
              const typeLabel = isEn ? style.label.en : style.label.de;

              return (
                <div
                  key={i}
                  className={`animate-on-scroll relative sm:pl-12 mb-8`}
                >
                  {/* Timeline dot */}
                  <div className="absolute left-2.5 top-6 w-3 h-3 bg-brand-600 hidden sm:block" />

                  <div className="bg-white border-2 border-[#1A1A1A] p-6 hover:shadow-[4px_4px_0_#C1292E] transition-shadow">
                    <div className="flex items-center gap-3 mb-3 flex-wrap">
                      <time className="text-xs font-grotesk uppercase tracking-wide text-[#1A1A1A]/50 font-semibold">
                        {new Date(entry.date).toLocaleDateString(isEn ? "en-GB" : "de-DE", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </time>
                      <span className={`text-[0.6rem] font-grotesk font-bold uppercase tracking-wider px-2 py-0.5 ${style.className}`}>
                        {typeLabel}
                      </span>
                    </div>
                    <h2 className="text-lg font-bold font-oswald uppercase text-[#1A1A1A] mb-2">
                      {title}
                    </h2>
                    <p className="text-sm text-[#1A1A1A]/70 leading-relaxed">
                      {description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
