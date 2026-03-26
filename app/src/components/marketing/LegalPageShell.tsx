"use client";

import { useEffect } from "react";

interface LegalSection {
  title: string;
  content: string;
}

interface LegalPageShellProps {
  heading: string;
  date: string;
  sections: LegalSection[];
}

export function LegalPageShell({ heading, date, sections }: LegalPageShellProps) {
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
      <section className="relative pt-32 pb-14 px-4 overflow-hidden bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="relative max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-bold font-grotesk text-white mb-3 tracking-tight">
            {heading}
          </h1>
          <p className="text-sm text-slate-300">{date}</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto space-y-6">
          {sections.map((s, i) => (
            <div
              key={i}
              className={`animate-on-scroll anim-delay-${(i % 4) + 1} bg-white rounded-xl p-8 border border-gray-100 hover:shadow-md transition-shadow duration-300`}
            >
              <h2 className="text-lg font-bold text-gray-900 mb-3">{s.title}</h2>
              <div className="whitespace-pre-line text-base text-gray-600 leading-relaxed">
                {s.content}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
