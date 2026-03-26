"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import MobileNav from "@/components/MobileNav";
import LanguageSwitcher from "@/i18n/LanguageSwitcher";
import { useLocale } from "@/i18n/LocaleContext";

/* ── SVG icons as small components ── */
const ArrowRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
);
const CheckCircle = () => (
  <span className="flex-shrink-0 w-[22px] h-[22px] mt-0.5 rounded-full bg-brand-100 flex items-center justify-center">
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#C1292E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
  </span>
);
const XCircle = () => (
  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center">
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
  </span>
);
const CheckPricing = () => (
  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-brand-100 flex items-center justify-center">
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#C1292E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
  </span>
);

/* ── Browser frame mockup ── */
function BrowserFrame({ url, imgSrc, alt }: { url: string; imgSrc: string; alt: string }) {
  return (
    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
      <div className="bg-gray-100 px-4 py-3 flex items-center gap-2 border-b border-gray-200">
        <span className="w-3 h-3 rounded-full" style={{ background: "#FF5F57" }} />
        <span className="w-3 h-3 rounded-full" style={{ background: "#FFBD2E" }} />
        <span className="w-3 h-3 rounded-full" style={{ background: "#28CA41" }} />
        <span className="flex-1 ml-3 bg-white rounded-md px-3 py-1 text-xs text-gray-500 border border-gray-200 font-mono">
          {url}
        </span>
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={imgSrc} alt={alt} loading="lazy" className="w-full block" />
    </div>
  );
}

/* ── Feature section with left text / right screenshot ── */
function FeatureSection({
  eyebrow, title, desc, bullets, url, imgSrc, imgAlt, reversed = false, even = false,
}: {
  eyebrow: string; title: string; desc: string; bullets: string[]; url: string; imgSrc: string; imgAlt: string; reversed?: boolean; even?: boolean;
}) {
  return (
    <section className={`py-20 lg:py-28 ${even ? "bg-gray-50" : ""}`}>
      <div className="max-w-[1200px] mx-auto px-6">
        <div className={`grid lg:grid-cols-2 gap-12 lg:gap-20 items-center ${reversed ? "direction-rtl" : ""}`}>
          <div className={`max-w-[480px] animate-on-scroll ${reversed ? "lg:order-2 direction-ltr" : ""}`}>
            <span className="text-xs font-bold tracking-[0.12em] uppercase text-brand-600 mb-4 inline-block font-grotesk">{eyebrow}</span>
            <h2 className="text-3xl sm:text-4xl font-bold font-grotesk text-gray-900 leading-tight tracking-tight mb-5">{title}</h2>
            <p className="text-gray-500 text-lg leading-relaxed max-w-xl">{desc}</p>
            <ul className="mt-7 space-y-3">
              {bullets.map((b, i) => (
                <li key={i} className="flex items-start gap-3 text-[0.95rem] text-gray-600 leading-relaxed">
                  <CheckCircle />
                  <span dangerouslySetInnerHTML={{ __html: b }} />
                </li>
              ))}
            </ul>
          </div>
          <div className={`animate-on-scroll ${reversed ? "lg:order-1 direction-ltr" : ""}`}>
            <BrowserFrame url={url} imgSrc={imgSrc} alt={imgAlt} />
          </div>
        </div>
      </div>
    </section>
  );
}

export default function LandingPage() {
  const { t } = useLocale();
  const mainRef = useRef<HTMLElement>(null);

  /* IntersectionObserver for scroll animations */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );
    const root = mainRef.current;
    if (!root) return;
    root.querySelectorAll(".animate-on-scroll, .animate-left, .animate-right").forEach((el) => {
      if (!el.closest("[data-hero]")) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const faqs = [
    { q: t("landing.faq1q"), a: t("landing.faq1a") },
    { q: t("landing.faq2q"), a: t("landing.faq2a") },
    { q: t("landing.faq3q"), a: t("landing.faq3a") },
    { q: t("landing.faq4q"), a: t("landing.faq4a") },
    { q: t("landing.faq5q"), a: t("landing.faq5a") },
    { q: t("landing.faq6q"), a: t("landing.faq6a") },
  ];

  return (
    <main ref={mainRef} className="min-h-screen overflow-x-hidden">
      {/* ═══ NAVIGATION ═══ */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b-[3px] border-brand-600 z-50">
        <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold font-grotesk text-gray-900 flex items-center gap-2.5">
            <span className="w-8 h-8 bg-brand-600 rounded-md flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
            </span>
            Bau<span className="text-brand-600">Preis</span> AI
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link href="/preise" className="text-sm font-medium text-gray-600 hover:text-brand-600 transition">
              {t("nav.pricing")}
            </Link>
            <Link href="/ueber-uns" className="text-sm font-medium text-gray-600 hover:text-brand-600 transition">
              {t("nav.aboutUs")}
            </Link>
            <Link href="/sign-in" className="text-sm font-medium text-gray-600 hover:text-brand-600 transition">
              {t("nav.signIn")}
            </Link>
            <Link
              href="/sign-up"
              className="bg-brand-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold font-grotesk uppercase tracking-wide hover:bg-brand-700 transition shadow-[3px_3px_0_#1A1A1A]"
            >
              {t("nav.freeTrial")}
            </Link>
            <LanguageSwitcher />
          </div>
          <MobileNav />
        </div>
      </nav>

      {/* ═══ HERO ═══ */}
      <section
        data-hero
        className="min-h-screen flex items-center justify-center text-center pt-28 pb-16 px-6 relative overflow-hidden bg-white"
      >
        {/* Bauhaus geometric shapes */}
        <div className="absolute -top-[100px] -right-[100px] w-[400px] h-[400px] rounded-full pointer-events-none bg-brand-600 opacity-[0.06]" />
        <div className="absolute bottom-[80px] -left-[60px] w-[200px] h-[200px] rounded-full pointer-events-none bg-bauhaus-yellow opacity-[0.15]" />
        <div className="absolute top-[200px] right-[200px] w-[120px] h-[120px] pointer-events-none bg-bauhaus-black opacity-[0.04]" />
        <div className="absolute bottom-[200px] right-[80px] w-[80px] h-[80px] rounded-full pointer-events-none bg-bauhaus-salmon opacity-[0.2]" />

        <div className="relative z-10 max-w-[1200px] mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-50 border-2 border-brand-600 rounded text-xs font-bold text-brand-600 mb-8 is-visible animate-on-scroll uppercase tracking-widest font-grotesk">
            <span className="w-2 h-2 rounded-full bg-emerald-500 pulse-dot" />
            {t("landing2.heroBadge")}
          </div>

          {/* Title */}
          <h1 className="font-grotesk text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[1.05] tracking-[-0.02em] text-bauhaus-black mb-2 is-visible animate-on-scroll">
            Bau<span className="text-brand-600">Preis</span> AI
          </h1>

          {/* Tagline */}
          <p className="font-grotesk text-xl sm:text-2xl font-medium text-gray-600 mb-4 is-visible animate-on-scroll">
            {t("landing2.heroTagline")}
          </p>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-gray-500 max-w-[600px] mx-auto mb-10 leading-relaxed is-visible animate-on-scroll">
            {t("landing2.heroSubtitle")}
          </p>

          {/* CTA buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-16 is-visible animate-on-scroll">
            <Link
              href="/sign-up"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-brand-600 text-white rounded-lg font-bold font-grotesk uppercase tracking-wide shadow-[4px_4px_0_#1A1A1A] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_#1A1A1A] transition-all"
            >
              {t("landing2.heroCta")}
              <ArrowRight />
            </Link>
            <Link
              href="/preise"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-bauhaus-black border-3 border-bauhaus-black rounded-lg font-bold font-grotesk uppercase tracking-wide hover:bg-yellow-50 transition-all"
              style={{ borderWidth: "3px" }}
            >
              {t("landing2.heroCtaPlans")}
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-[600px] mx-auto is-visible animate-on-scroll">
            {[
              { v: t("landing2.heroStat1Value"), l: t("landing2.heroStat1Label") },
              { v: t("landing2.heroStat2Value"), l: t("landing2.heroStat2Label") },
              { v: t("landing2.heroStat3Value"), l: t("landing2.heroStat3Label") },
              { v: t("landing2.heroStat4Value"), l: t("landing2.heroStat4Label") },
            ].map((s, i) => (
              <div key={i} className="text-center p-4 border-2 border-gray-200 rounded-lg">
                <div className="text-xl sm:text-2xl font-bold font-grotesk text-brand-600 tracking-tight">{s.v}</div>
                <div className="text-xs text-gray-500 mt-1">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ THE PROBLEM ═══ */}
      <section className="bg-bauhaus-black text-white py-20 lg:py-28 relative overflow-hidden">
        {/* Geometric accent */}
        <div className="absolute -top-[100px] -right-[80px] w-[300px] h-[300px] rounded-full border-[40px] border-brand-600 opacity-[0.08] pointer-events-none" />
        <div className="max-w-[1200px] mx-auto px-6 relative z-10">
          <div className="animate-on-scroll">
            <span className="text-xs font-bold tracking-[0.12em] uppercase text-bauhaus-yellow mb-4 inline-block font-grotesk">{t("landing2.problemEyebrow")}</span>
            <h2 className="text-3xl sm:text-4xl font-bold font-grotesk text-white leading-tight mb-5">{t("landing2.problemTitle")}</h2>
            <p className="text-lg text-gray-400 max-w-xl leading-relaxed">{t("landing2.problemSubtitle")}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            {[
              { stat: t("landing2.problemStat1"), title: t("landing2.problemCard1Title"), text: t("landing2.problemCard1Text"), color: "text-brand-500", accent: "bg-brand-600" },
              { stat: t("landing2.problemStat2"), title: t("landing2.problemCard2Title"), text: t("landing2.problemCard2Text"), color: "text-bauhaus-yellow", accent: "bg-bauhaus-yellow" },
              { stat: t("landing2.problemStat3"), title: t("landing2.problemCard3Title"), text: t("landing2.problemCard3Text"), color: "text-bauhaus-salmon", accent: "bg-bauhaus-salmon" },
            ].map((card, i) => (
              <div
                key={i}
                className={`animate-on-scroll anim-delay-${i + 1} bg-white/5 border-2 border-white/10 rounded-xl p-8 transition-all hover:border-brand-600 hover:-translate-y-1 relative overflow-hidden`}
              >
                <div className={`absolute top-0 left-0 w-1 h-full ${card.accent}`} />
                <div className={`text-4xl font-bold font-grotesk ${card.color} tracking-tight mb-2`}>{card.stat}</div>
                <h3 className="text-lg font-bold font-grotesk text-white mb-3">{card.title}</h3>
                <p className="text-[0.95rem] text-gray-400 leading-relaxed">{card.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FEATURE SECTIONS ═══ */}

      {/* Dashboard */}
      <FeatureSection
        eyebrow={t("landing2.dashboardEyebrow")}
        title={t("landing2.dashboardTitle")}
        desc={t("landing2.dashboardDesc")}
        bullets={[t("landing2.dashboardBullet1"), t("landing2.dashboardBullet2"), t("landing2.dashboardBullet3"), t("landing2.dashboardBullet4")]}
        url={t("landing2.dashboardUrl")}
        imgSrc="/img/Screenshot 2026-03-04 151000.png"
        imgAlt="BauPreis AI Dashboard"
      />

      {/* Price Tracking */}
      <FeatureSection
        eyebrow={t("landing2.priceTrackingEyebrow")}
        title={t("landing2.priceTrackingTitle")}
        desc={t("landing2.priceTrackingDesc")}
        bullets={[t("landing2.priceTrackingBullet1"), t("landing2.priceTrackingBullet2"), t("landing2.priceTrackingBullet3"), t("landing2.priceTrackingBullet4")]}
        url={t("landing2.priceTrackingUrl")}
        imgSrc="/img/Screenshot 2026-03-04 151031.png"
        imgAlt="BauPreis AI Material Price Detail"
        reversed
        even
      />

      {/* AI Analysis */}
      <FeatureSection
        eyebrow={t("landing2.aiAnalysisEyebrow")}
        title={t("landing2.aiAnalysisTitle")}
        desc={t("landing2.aiAnalysisDesc")}
        bullets={[t("landing2.aiAnalysisBullet1"), t("landing2.aiAnalysisBullet2"), t("landing2.aiAnalysisBullet3"), t("landing2.aiAnalysisBullet4")]}
        url={t("landing2.aiAnalysisUrl")}
        imgSrc="/img/Screenshot 2026-03-04 151036.png"
        imgAlt="BauPreis AI Market Analysis"
      />

      {/* AI Forecasts */}
      <FeatureSection
        eyebrow={t("landing2.forecastsEyebrow")}
        title={t("landing2.forecastsTitle")}
        desc={t("landing2.forecastsDesc")}
        bullets={[t("landing2.forecastsBullet1"), t("landing2.forecastsBullet2"), t("landing2.forecastsBullet3"), t("landing2.forecastsBullet4")]}
        url={t("landing2.forecastsUrl")}
        imgSrc="/img/Screenshot 2026-03-04 151323.png"
        imgAlt="BauPreis AI Price Forecasts"
        reversed
        even
      />

      {/* AI Chat */}
      <FeatureSection
        eyebrow={t("landing2.chatEyebrow")}
        title={t("landing2.chatTitle")}
        desc={t("landing2.chatDesc")}
        bullets={[t("landing2.chatBullet1"), t("landing2.chatBullet2"), t("landing2.chatBullet3"), t("landing2.chatBullet4")]}
        url={t("landing2.chatUrl")}
        imgSrc="/img/Screenshot 2026-03-04 151335.png"
        imgAlt="BauPreis AI Chat"
      />

      {/* Price Escalation Calculator — full width with dual screenshots */}
      <section className="py-20 lg:py-28 bg-gray-50">
        <div className="max-w-[800px] mx-auto px-6 text-center">
          <div className="animate-on-scroll">
            <span className="text-xs font-bold tracking-[0.12em] uppercase text-brand-600 mb-4 inline-block font-grotesk">{t("landing2.escalationEyebrow")}</span>
            <h2 className="text-3xl sm:text-4xl font-bold font-grotesk text-gray-900 leading-tight tracking-tight mb-5">{t("landing2.escalationTitle")}</h2>
            <p className="text-lg text-gray-500 max-w-xl mx-auto leading-relaxed">{t("landing2.escalationDesc")}</p>
          </div>
          <div className="animate-on-scroll anim-delay-2">
            <ul className="mt-6 space-y-3 max-w-[600px] mx-auto text-left">
              {[t("landing2.escalationBullet1"), t("landing2.escalationBullet2"), t("landing2.escalationBullet3")].map((b, i) => (
                <li key={i} className="flex items-start gap-3 text-[0.95rem] text-gray-600 leading-relaxed">
                  <CheckCircle />
                  <span dangerouslySetInnerHTML={{ __html: b }} />
                </li>
              ))}
            </ul>
          </div>
          <div className="grid sm:grid-cols-2 gap-6 mt-12 animate-on-scroll anim-delay-3">
            <BrowserFrame url={t("landing2.escalationUrl")} imgSrc="/img/Screenshot 2026-03-04 151357.png" alt="Price Escalation Calculator - Input" />
            <BrowserFrame url={t("landing2.escalationUrl")} imgSrc="/img/Screenshot 2026-03-04 151403.png" alt="Price Escalation Calculator - Result" />
          </div>
        </div>
      </section>

      {/* Alloy Calculator */}
      <FeatureSection
        eyebrow={t("landing2.alloyEyebrow")}
        title={t("landing2.alloyTitle")}
        desc={t("landing2.alloyDesc")}
        bullets={[t("landing2.alloyBullet1"), t("landing2.alloyBullet2"), t("landing2.alloyBullet3"), t("landing2.alloyBullet4")]}
        url={t("landing2.alloyUrl")}
        imgSrc="/img/Screenshot 2026-03-04 151430.png"
        imgAlt="BauPreis AI Alloy Calculator"
        reversed
      />

      {/* Reports */}
      <FeatureSection
        eyebrow={t("landing2.reportsEyebrow")}
        title={t("landing2.reportsTitle")}
        desc={t("landing2.reportsDesc")}
        bullets={[t("landing2.reportsBullet1"), t("landing2.reportsBullet2"), t("landing2.reportsBullet3"), t("landing2.reportsBullet4")]}
        url={t("landing2.reportsUrl")}
        imgSrc="/img/Screenshot 2026-03-04 151439.png"
        imgAlt="BauPreis AI Reports"
        even
      />

      {/* ═══ FEATURES GRID ═══ */}
      <section className="py-20 lg:py-28 bg-gray-50">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center animate-on-scroll">
            <span className="text-xs font-bold tracking-[0.12em] uppercase text-brand-600 mb-4 inline-block font-grotesk">{t("landing2.gridEyebrow")}</span>
            <h2 className="text-3xl sm:text-4xl font-bold font-grotesk text-gray-900 leading-tight tracking-tight mb-5">{t("landing2.gridTitle")}</h2>
            <p className="text-lg text-gray-500 max-w-xl mx-auto leading-relaxed">{t("landing2.gridSubtitle")}</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
            {[
              { title: t("landing2.gridCard1Title"), text: t("landing2.gridCard1Text"), icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C1292E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg> },
              { title: t("landing2.gridCard2Title"), text: t("landing2.gridCard2Text"), icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C1292E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg> },
              { title: t("landing2.gridCard3Title"), text: t("landing2.gridCard3Text"), icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C1292E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg> },
              { title: t("landing2.gridCard4Title"), text: t("landing2.gridCard4Text"), icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C1292E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg> },
              { title: t("landing2.gridCard5Title"), text: t("landing2.gridCard5Text"), icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C1292E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg> },
              { title: t("landing2.gridCard6Title"), text: t("landing2.gridCard6Text"), icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C1292E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></svg> },
            ].map((card, i) => (
              <div
                key={i}
                className={`animate-on-scroll anim-delay-${i + 1} bg-white border border-gray-200 rounded-2xl p-8 transition-all hover:border-brand-200 hover:shadow-lg hover:-translate-y-1`}
              >
                <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center mb-5">{card.icon}</div>
                <h3 className="text-base font-bold text-gray-900 mb-2">{card.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{card.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TECH STACK ═══ */}
      <section className="bg-gray-50 py-16 lg:py-20">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center animate-on-scroll">
            <span className="text-xs font-bold tracking-[0.12em] uppercase text-brand-600 mb-4 inline-block font-grotesk">{t("landing2.techEyebrow")}</span>
            <h2 className="text-2xl sm:text-3xl font-bold font-grotesk text-gray-900 leading-tight tracking-tight">{t("landing2.techTitle")}</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mt-12">
            {[
              { title: t("landing2.techItem1Title"), desc: t("landing2.techItem1Desc"), icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg> },
              { title: t("landing2.techItem2Title"), desc: t("landing2.techItem2Desc"), icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" /></svg> },
              { title: t("landing2.techItem3Title"), desc: t("landing2.techItem3Desc"), icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg> },
              { title: t("landing2.techItem4Title"), desc: t("landing2.techItem4Desc"), icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2" /><rect x="2" y="14" width="20" height="8" rx="2" ry="2" /><line x1="6" y1="6" x2="6.01" y2="6" /><line x1="6" y1="18" x2="6.01" y2="18" /></svg> },
            ].map((item, i) => (
              <div key={i} className={`animate-on-scroll anim-delay-${i + 1} text-center p-7 bg-white rounded-xl border border-gray-200 transition-all hover:border-brand-200 hover:shadow-md`}>
                <div className="text-3xl mb-3 flex justify-center">{item.icon}</div>
                <h4 className="text-sm font-bold text-gray-900 mb-1">{item.title}</h4>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10 animate-on-scroll">
            <p className="text-sm text-gray-500">{t("landing2.techStats")}</p>
          </div>
        </div>
      </section>

      {/* ═══ PRICING ═══ */}
      <section className="py-20 lg:py-28">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center animate-on-scroll">
            <span className="text-xs font-bold tracking-[0.12em] uppercase text-brand-600 mb-4 inline-block font-grotesk">{t("landing2.pricingEyebrow")}</span>
            <h2 className="text-3xl sm:text-4xl font-bold font-grotesk text-gray-900 leading-tight tracking-tight mb-5">{t("landing2.pricingTitle")}</h2>
            <p className="text-lg text-gray-500 max-w-xl mx-auto leading-relaxed">{t("landing2.pricingSubtitle")}</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 mt-16 items-start max-w-5xl mx-auto">
            {/* Basis */}
            <div className="animate-on-scroll anim-delay-1 bg-white border border-gray-200 rounded-xl px-8 py-10 transition-all hover:shadow-xl hover:-translate-y-1 relative">
              <div className="text-sm font-semibold text-brand-600 uppercase tracking-wider mb-2">{t("landing.planBasis")}</div>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-2xl font-bold text-gray-900">&euro;</span>
                <span className="text-5xl font-extrabold text-gray-900 tracking-tight leading-none">49</span>
                <span className="text-base text-gray-500">{t("landing2.pricingPerMonth")}</span>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed mb-7">{t("landing2.pricingBasisDesc")}</p>
              <ul className="space-y-2.5 mb-8">
                {[t("landing2.pricingBasisFeat1"), t("landing2.pricingBasisFeat2"), t("landing2.pricingBasisFeat3"), t("landing2.pricingBasisFeat4"), t("landing2.pricingBasisFeat5")].map((f, i) => (
                  <li key={i} className="flex items-center gap-2.5 text-sm text-gray-700"><CheckPricing />{f}</li>
                ))}
                {[t("landing2.pricingBasisFeatOff1"), t("landing2.pricingBasisFeatOff2"), t("landing2.pricingBasisFeatOff3")].map((f, i) => (
                  <li key={`off-${i}`} className="flex items-center gap-2.5 text-sm text-gray-400"><XCircle />{f}</li>
                ))}
              </ul>
              <Link href="/sign-up" className="block w-full text-center py-3.5 rounded-xl font-semibold text-sm text-brand-600 border-2 border-brand-200 hover:bg-brand-50 hover:border-brand-600 transition-all">
                {t("landing2.pricingCta")}
              </Link>
            </div>

            {/* Pro */}
            <div className="animate-on-scroll anim-delay-2 bg-white border-2 border-brand-600 rounded-xl px-8 py-10 shadow-lg relative">
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-brand-600 text-white text-xs font-bold px-5 py-1.5 rounded-full uppercase tracking-wider">{t("landing2.pricingMostPopular")}</span>
              <div className="text-sm font-semibold text-brand-600 uppercase tracking-wider mb-2">{t("landing.planPro")}</div>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-2xl font-bold text-gray-900">&euro;</span>
                <span className="text-5xl font-extrabold text-gray-900 tracking-tight leading-none">149</span>
                <span className="text-base text-gray-500">{t("landing2.pricingPerMonth")}</span>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed mb-7">{t("landing2.pricingProDesc")}</p>
              <ul className="space-y-2.5 mb-8">
                {[t("landing2.pricingProFeat1"), t("landing2.pricingProFeat2"), t("landing2.pricingProFeat3"), t("landing2.pricingProFeat4"), t("landing2.pricingProFeat5"), t("landing2.pricingProFeat6"), t("landing2.pricingProFeat7")].map((f, i) => (
                  <li key={i} className="flex items-center gap-2.5 text-sm text-gray-700"><CheckPricing />{f}</li>
                ))}
                {[t("landing2.pricingProFeatOff1")].map((f, i) => (
                  <li key={`off-${i}`} className="flex items-center gap-2.5 text-sm text-gray-400"><XCircle />{f}</li>
                ))}
              </ul>
              <Link href="/sign-up" className="block w-full text-center py-3.5 rounded-xl font-semibold text-sm text-white bg-brand-600 hover:bg-brand-700 transition-all">
                {t("landing2.pricingCtaPro")}
              </Link>
            </div>

            {/* Team */}
            <div className="animate-on-scroll anim-delay-3 bg-white border border-gray-200 rounded-xl px-8 py-10 transition-all hover:shadow-xl hover:-translate-y-1 relative">
              <div className="text-sm font-semibold text-brand-600 uppercase tracking-wider mb-2">{t("landing.planTeam")}</div>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-2xl font-bold text-gray-900">&euro;</span>
                <span className="text-5xl font-extrabold text-gray-900 tracking-tight leading-none">299</span>
                <span className="text-base text-gray-500">{t("landing2.pricingPerMonth")}</span>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed mb-7">{t("landing2.pricingTeamDesc")}</p>
              <ul className="space-y-2.5 mb-8">
                {[t("landing2.pricingTeamFeat1"), t("landing2.pricingTeamFeat2"), t("landing2.pricingTeamFeat3"), t("landing2.pricingTeamFeat4"), t("landing2.pricingTeamFeat5"), t("landing2.pricingTeamFeat6"), t("landing2.pricingTeamFeat7"), t("landing2.pricingTeamFeat8")].map((f, i) => (
                  <li key={i} className="flex items-center gap-2.5 text-sm text-gray-700"><CheckPricing />{f}</li>
                ))}
              </ul>
              <Link href="/sign-up" className="block w-full text-center py-3.5 rounded-xl font-semibold text-sm text-brand-600 border-2 border-brand-200 hover:bg-brand-50 hover:border-brand-600 transition-all">
                {t("landing2.pricingCtaTeam")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section className="py-20 bg-gray-50 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-12 animate-on-scroll">
            {t("landing.faqTitle")}
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <details key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-on-scroll">
                <summary className="font-semibold cursor-pointer text-gray-900">{faq.q}</summary>
                <p className="mt-3 text-gray-600 leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ BOTTOM CTA ═══ */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center animate-on-scroll">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
            {t("landing.ctaBottomTitle")}
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            {t("landing.ctaBottomText")}
          </p>
          <Link
            href="/sign-up"
            className="inline-flex items-center gap-2 bg-brand-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-brand-700 transition shadow-[0_1px_2px_rgba(79,70,229,0.3),0_4px_12px_rgba(79,70,229,0.15)]"
          >
            {t("landing.ctaBottomButton")}
            <ArrowRight />
          </Link>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="bg-bauhaus-black text-gray-400 py-16 text-center">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-2xl font-bold font-grotesk text-white mb-2">
            Bau<span className="text-brand-400">Preis</span> AI
          </div>
          <p className="text-sm text-gray-500 mb-6">{t("landing2.footerTagline")}</p>

          <div className="flex flex-wrap items-center justify-center gap-8 mb-8">
            <Link href="/preise" className="text-sm text-gray-400 hover:text-white transition">{t("nav.pricing")}</Link>
            <Link href="/ueber-uns" className="text-sm text-gray-400 hover:text-white transition">{t("nav.aboutUs")}</Link>
            <Link href="/kontakt" className="text-sm text-gray-400 hover:text-white transition">{t("nav.contact")}</Link>
          </div>

          <div className="w-20 h-px bg-gray-700 mx-auto mb-6" />

          <div className="flex flex-wrap items-center justify-center gap-6 mb-6 text-sm">
            <Link href="/impressum" className="hover:text-white transition">{t("landing.footerImpressum")}</Link>
            <Link href="/datenschutz" className="hover:text-white transition">{t("landing.footerDatenschutz")}</Link>
            <Link href="/agb" className="hover:text-white transition">{t("landing.footerAgb")}</Link>
            <button
              onClick={() => {
                if (typeof window !== "undefined") {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  (window as any).__openCookieSettings?.();
                }
              }}
              className="hover:text-white transition cursor-pointer"
            >
              {t("cookie.settings")}
            </button>
          </div>

          <p className="text-sm text-gray-500 mb-2">{t("landing2.footerLocation")}</p>
          <p className="text-xs text-gray-600">
            {t("landing.footerCopyright").replace("{year}", String(new Date().getFullYear()))}
          </p>
        </div>
      </footer>
    </main>
  );
}
