"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
/* MobileNav and LanguageSwitcher moved to UnifiedHeader */
import { useLocale } from "@/i18n/LocaleContext";
import { BauCircle, BauTriangle } from "@/components/decorations";
import { CompositionCornerBR, CompositionStripe } from "@/components/decorations";
import { BauhausOverlay } from "@/components/decorations";
import { CompositionGrid } from "@/components/decorations";

/* ── SVG icons ── */
const ArrowRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
);
const CheckPricing = () => (
  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-brand-100 flex items-center justify-center">
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#C1292E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
  </span>
);
const XCircle = () => (
  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center">
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
  </span>
);

/* logos are now in /logo/ folder — no component needed */

export default function LandingPage() {
  const { t } = useLocale();
  const mainRef = useRef<HTMLElement>(null);

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
    root.querySelectorAll(".animate-on-scroll").forEach((el) => {
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
      {/* Navigation is now UnifiedHeader in root layout */}

      {/* ═══ HERO — 2 Columns ═══ */}
      <section data-hero className="min-h-screen flex items-center pt-16 pb-16 px-6 relative overflow-hidden bg-white">
        {/* Background geometric shapes */}
        <BauCircle color="#C1292E" size={400} opacity={0.06} className="absolute -top-[100px] -right-[100px]" />
        <BauCircle color="#F5C518" size={200} opacity={0.12} className="absolute bottom-[80px] -left-[60px] hidden sm:block" />
        <BauTriangle color="#1A1A1A" size={120} opacity={0.05} rotation={15} className="absolute bottom-[40px] right-[10%] hidden lg:block" />

        <div className="relative z-10 max-w-[1200px] mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* LEFT — Text */}
            <div className="lg:text-left text-center">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-50 border-2 border-brand-600 rounded text-xs font-bold text-brand-600 mb-8 is-visible animate-on-scroll uppercase tracking-widest font-grotesk">
                <span className="w-2 h-2 rounded-full bg-bauhaus-yellow pulse-dot" />
                {t("landing2.heroBadge")}
              </div>

              <h1 className="font-oswald text-5xl sm:text-6xl md:text-7xl lg:text-[6rem] leading-[0.95] tracking-wide text-bauhaus-black mb-3 is-visible animate-on-scroll">
                MATERIAL&shy;PREISE<span className="text-bauhaus-yellow">.</span><br />
                DIGITAL<span className="text-bauhaus-yellow">.</span>
              </h1>

              <p className="font-grotesk text-lg sm:text-xl font-medium text-gray-600 mb-3 is-visible animate-on-scroll">
                {t("landing2.heroTagline")}
              </p>

              <p className="text-base text-gray-500 max-w-[480px] lg:mx-0 mx-auto mb-8 leading-relaxed is-visible animate-on-scroll">
                {t("landing2.heroSubtitle")}
              </p>

              <div className="flex flex-wrap lg:justify-start justify-center gap-3 mb-10 is-visible animate-on-scroll">
                <Link href="/sign-up" className="inline-flex items-center gap-2 px-7 py-3.5 bg-brand-600 text-white rounded-none font-bold font-grotesk uppercase tracking-wide shadow-[4px_4px_0_#1A1A1A] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_#1A1A1A] transition-all">
                  {t("landing2.heroCta")} <ArrowRight />
                </Link>
                <Link href="/preise" className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-bauhaus-black rounded-none font-bold font-grotesk uppercase tracking-wide hover:bg-yellow-50 transition-all" style={{ border: "3px solid #1A1A1A" }}>
                  {t("landing2.heroCtaPlans")}
                </Link>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-[480px] lg:mx-0 mx-auto is-visible animate-on-scroll">
                {[
                  { v: t("landing2.heroStat1Value"), l: t("landing2.heroStat1Label") },
                  { v: t("landing2.heroStat2Value"), l: t("landing2.heroStat2Label") },
                  { v: t("landing2.heroStat3Value"), l: t("landing2.heroStat3Label") },
                  { v: t("landing2.heroStat4Value"), l: t("landing2.heroStat4Label") },
                ].map((s, i) => (
                  <div key={i} className="text-center p-3 border-2 border-gray-200 rounded-none">
                    <div className="text-lg font-bold font-grotesk text-brand-600">{s.v}</div>
                    <div className="text-[0.65rem] text-gray-500 mt-0.5">{s.l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT — Bauhaus Composition */}
            <div className="relative hidden lg:block" style={{ aspectRatio: "1" }}>
              {/* Big circle background */}
              <div className="absolute inset-[10%] rounded-full bg-brand-600 opacity-[0.08]" />
              {/* Red small circle */}
              <div className="absolute top-[5%] right-[15%] w-10 h-10 rounded-full bg-brand-600" />
              {/* Dashboard card */}
              <div className="absolute top-[25%] left-[15%] w-[70%] h-[50%] bg-bauhaus-black rounded-none overflow-hidden shadow-[8px_8px_0_#F5C518]">
                <div className="p-5 text-white h-full flex flex-col justify-between">
                  <div>
                    <div className="font-grotesk text-[0.6rem] uppercase tracking-[0.1em] text-gray-400 mb-1">DASHBOARD</div>
                    <div className="font-grotesk text-2xl font-bold">&euro;7.915</div>
                    <div className="text-sm font-semibold text-bauhaus-yellow">+2.3% BauPreis Index</div>
                  </div>
                  {/* Mini bar chart */}
                  <div className="flex items-end gap-1.5 h-14">
                    {[25, 40, 30, 55, 45, 35, 50, 38].map((h, i) => (
                      <div key={i} className="w-4 rounded-t" style={{ height: `${h}px`, background: i < 2 ? "#C1292E" : i < 4 ? "#F5C518" : i < 6 ? "#BC8279" : "#C1292E" }} />
                    ))}
                  </div>
                </div>
              </div>
              {/* Yellow square rotated */}
              <div className="absolute bottom-[10%] right-[5%] w-14 h-14 bg-bauhaus-yellow" style={{ transform: "rotate(15deg)" }} />
              {/* Salmon rectangle */}
              <div className="absolute bottom-[25%] left-0 w-24 h-7 bg-bauhaus-salmon rounded opacity-70" />
            </div>
          </div>
        </div>
      </section>

      {/* ═══ PRODUCT INFOGRAPHIC — How BauPreis AI Works ═══ */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-10 animate-on-scroll">
            <span className="text-xs font-bold tracking-[0.12em] uppercase text-brand-600 mb-4 inline-block font-grotesk">SO FUNKTIONIERT ES</span>
            <h2 className="text-2xl sm:text-3xl font-bold font-oswald uppercase text-[#1A1A1A]">Daten. KI-Analyse. Ergebnisse.</h2>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/img/infografic/product-pipeline.jpg"
            alt="BauPreis AI Prozess: Dateneingang, KI-Analyse und Prognose, Erkenntnisse, Fundierte Einkaufsentscheidungen"
            loading="lazy"
            className="w-full max-w-[1000px] mx-auto border-2 border-[#1A1A1A] shadow-[6px_6px_0_#C1292E] animate-on-scroll"
          />
        </div>
      </section>

      {/* ═══ PROBLEM ═══ */}
      <section className="bg-bauhaus-black text-white py-20 lg:py-28 relative overflow-hidden">
        <BauCircle color="#C1292E" size={300} opacity={0.08} className="absolute -top-[100px] -right-[80px]" />
        <CompositionCornerBR opacity={0.08} className="absolute bottom-[-40px] right-[-20px] hidden md:block" />
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
              <div key={i} className={`animate-on-scroll bg-white/5 border-2 border-white/10 rounded-none p-8 transition-all hover:border-brand-600 hover:-translate-y-1 relative overflow-hidden`}>
                <div className={`absolute top-0 left-0 w-1 h-full ${card.accent}`} />
                <div className={`text-4xl font-bold font-grotesk ${card.color} tracking-tight mb-2`}>{card.stat}</div>
                <h3 className="text-lg font-bold font-grotesk text-white mb-3">{card.title}</h3>
                <p className="text-[0.95rem] text-gray-400 leading-relaxed">{card.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ MARKET INFOGRAPHIC — German Construction Market ═══ */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-10 animate-on-scroll">
            <span className="text-xs font-bold tracking-[0.12em] uppercase text-brand-600 mb-4 inline-block font-grotesk">MARKTANALYSE</span>
            <h2 className="text-2xl sm:text-3xl font-bold font-oswald uppercase text-[#1A1A1A]">Baustoffmarkt Deutschland 2026</h2>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/img/infografic/market-analysis.jpg"
            alt="Baustoffmarkt Deutschland: 500+ Mrd. EUR Bauvolumen, Preisvolatilität auf Rekordniveau, 400.000 Unternehmen ohne Monitoring"
            loading="lazy"
            className="w-full max-w-[1000px] mx-auto border-2 border-[#1A1A1A] shadow-[6px_6px_0_#F5C518] animate-on-scroll"
          />
        </div>
      </section>

      {/* ═══ DASHBOARD MOCKUP ═══ */}
      <section className="py-20 lg:py-28 bg-gray-50">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-12 animate-on-scroll">
            <span className="text-xs font-bold tracking-[0.12em] uppercase text-brand-600 mb-4 inline-block font-grotesk">{t("landing2.dashboardEyebrow")}</span>
            <h2 className="text-3xl sm:text-4xl font-bold font-grotesk text-gray-900 leading-tight mb-4">{t("landing2.dashboardTitle")}</h2>
            <p className="text-base text-gray-500 max-w-xl mx-auto">{t("landing2.dashboardDesc")}</p>
          </div>

          {/* Browser frame mockup */}
          <div className="animate-on-scroll max-w-[1000px] mx-auto bg-white border-[3px] border-bauhaus-black rounded-none overflow-hidden shadow-[8px_8px_0_#C1292E]">
            {/* Title bar */}
            <div className="bg-bauhaus-black px-4 py-3 flex items-center gap-2 font-grotesk text-sm font-semibold text-white">
              <span className="w-3 h-3 rounded-full bg-brand-600" />
              <span className="w-3 h-3 rounded-full bg-bauhaus-yellow" />
              <span className="w-3 h-3 rounded-full bg-bauhaus-yellow" />
              <span className="ml-3 text-xs text-gray-400">baupreis.ais152.com/dashboard</span>
            </div>
            {/* Dashboard body */}
            <div className="p-6">
              {/* KPI row */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {[
                  { label: "BAUPREIS INDEX", value: "€7.915", change: "+2.3%", up: true, accent: "bg-brand-600" },
                  { label: "STAHLPREIS", value: "€450.00", change: "+12.5%", up: true, accent: "bg-bauhaus-yellow" },
                  { label: "KUPFERPREIS", value: "€8.234", change: "-3.2%", up: false, accent: "bg-bauhaus-salmon" },
                  { label: "KONSTRUKTIONSHOLZ", value: "€285.50", change: "-30.5%", up: false, accent: "bg-bauhaus-black" },
                ].map((kpi, i) => (
                  <div key={i} className="border-2 border-gray-200 rounded-none p-4 relative overflow-hidden">
                    <div className={`absolute top-0 left-0 right-0 h-[3px] ${kpi.accent}`} />
                    <div className="font-grotesk text-[0.6rem] font-bold uppercase tracking-[0.08em] text-gray-500 mb-1">{kpi.label}</div>
                    <div className="font-grotesk text-xl font-bold text-gray-900">{kpi.value}</div>
                    <div className={`text-sm font-bold mt-1 ${kpi.up ? "text-bauhaus-yellow" : "text-brand-600"}`}>{kpi.change}</div>
                  </div>
                ))}
              </div>
              {/* Charts row */}
              <div className="grid lg:grid-cols-[2fr_1fr] gap-6">
                <div className="border-2 border-gray-200 rounded-none p-5">
                  <div className="font-grotesk text-xs font-bold uppercase tracking-[0.05em] text-gray-600 mb-4">Stahlpreis Prognose Q2 2026 (90 Tage)</div>
                  <svg viewBox="0 0 600 180" className="w-full h-auto" preserveAspectRatio="none">
                    <line x1="0" y1="45" x2="600" y2="45" stroke="#E5E7EB" strokeWidth="1" />
                    <line x1="0" y1="90" x2="600" y2="90" stroke="#E5E7EB" strokeWidth="1" />
                    <line x1="0" y1="135" x2="600" y2="135" stroke="#E5E7EB" strokeWidth="1" />
                    <path d="M0,150 C40,145 80,130 120,125 C160,120 200,110 240,90 C280,70 320,80 360,65 C400,50 440,40 480,45 C520,50 560,35 600,20" fill="none" stroke="#C1292E" strokeWidth="2.5" strokeLinecap="round" />
                    <path d="M0,150 C40,145 80,130 120,125 C160,120 200,110 240,90 C280,70 320,80 360,65 C400,50 440,40 480,45 C520,50 560,35 600,20 L600,180 L0,180 Z" fill="#C1292E" opacity="0.06" />
                    <path d="M420,42 C460,38 500,32 540,25 C570,20 590,15 600,10" fill="none" stroke="#F5C518" strokeWidth="2" strokeDasharray="6,4" strokeLinecap="round" />
                    <circle cx="420" cy="42" r="5" fill="#F5C518" stroke="#fff" strokeWidth="2" />
                    <text x="10" y="175" fill="#9CA3AF" fontSize="10" fontFamily="Space Grotesk">Jan</text>
                    <text x="150" y="175" fill="#9CA3AF" fontSize="10" fontFamily="Space Grotesk">Feb</text>
                    <text x="290" y="175" fill="#9CA3AF" fontSize="10" fontFamily="Space Grotesk">M&auml;r</text>
                    <text x="430" y="175" fill="#9CA3AF" fontSize="10" fontFamily="Space Grotesk">Apr</text>
                    <text x="560" y="175" fill="#9CA3AF" fontSize="10" fontFamily="Space Grotesk">Mai</text>
                  </svg>
                </div>
                <div className="border-2 border-gray-200 rounded-none p-5">
                  <div className="font-grotesk text-xs font-bold uppercase tracking-[0.05em] text-gray-600 mb-4">Top 5 Materialien</div>
                  <svg viewBox="0 0 200 180" className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
                    <rect x="10" y="45" width="30" height="105" rx="2" fill="#C1292E" />
                    <rect x="48" y="70" width="30" height="80" rx="2" fill="#1A1A1A" />
                    <rect x="86" y="90" width="30" height="60" rx="2" fill="#BC8279" />
                    <rect x="124" y="60" width="30" height="90" rx="2" fill="#F5C518" />
                    <rect x="162" y="105" width="30" height="45" rx="2" fill="#C1292E" opacity="0.5" />
                    <text x="25" y="170" fill="#6B7280" fontSize="8" fontFamily="Space Grotesk" textAnchor="middle">Stahl</text>
                    <text x="63" y="170" fill="#6B7280" fontSize="8" fontFamily="Space Grotesk" textAnchor="middle">Kupfer</text>
                    <text x="101" y="170" fill="#6B7280" fontSize="8" fontFamily="Space Grotesk" textAnchor="middle">Alu</text>
                    <text x="139" y="170" fill="#6B7280" fontSize="8" fontFamily="Space Grotesk" textAnchor="middle">Holz</text>
                    <text x="177" y="170" fill="#6B7280" fontSize="8" fontFamily="Space Grotesk" textAnchor="middle">Beton</text>
                    <text x="25" y="40" fill="#C1292E" fontSize="9" fontFamily="Space Grotesk" fontWeight="700" textAnchor="middle">+12.5%</text>
                    <text x="63" y="65" fill="#1A1A1A" fontSize="9" fontFamily="Space Grotesk" fontWeight="700" textAnchor="middle">+8.1%</text>
                    <text x="101" y="85" fill="#BC8279" fontSize="9" fontFamily="Space Grotesk" fontWeight="700" textAnchor="middle">+5.4%</text>
                    <text x="139" y="55" fill="#9e7e00" fontSize="9" fontFamily="Space Grotesk" fontWeight="700" textAnchor="middle">-30.5%</text>
                    <text x="177" y="100" fill="#C1292E" fontSize="9" fontFamily="Space Grotesk" fontWeight="700" textAnchor="middle">+2.1%</text>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ DASHBOARD FEATURES INFOGRAPHIC ═══ */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-10 animate-on-scroll">
            <span className="text-xs font-bold tracking-[0.12em] uppercase text-brand-600 mb-4 inline-block font-grotesk">PLATFORM FEATURES</span>
            <h2 className="text-2xl sm:text-3xl font-bold font-oswald uppercase text-[#1A1A1A]">Alles in einer Plattform</h2>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/img/infografic/dashboard-features.jpg"
            alt="BauPreis AI Dashboard: Preisüberwachung, KI-Prognose, Preisalarme per Email und Telegram, BauPreis Index"
            loading="lazy"
            className="w-full max-w-[1000px] mx-auto border-2 border-[#1A1A1A] shadow-[6px_6px_0_#1A1A1A] animate-on-scroll"
          />
        </div>
      </section>

      {/* ═══ STRIPE DIVIDER ═══ */}
      <CompositionStripe />

      {/* ═══ PRICING ═══ */}
      <section id="pricing" className="py-20 lg:py-28 bg-white relative overflow-hidden">
        <BauCircle color="#F5C518" size={200} opacity={0.08} className="absolute bottom-[-60px] left-[-60px]" />
        <BauTriangle color="#C1292E" size={150} opacity={0.05} className="absolute top-[40px] right-[-40px] hidden md:block" />
        <div className="max-w-[1200px] mx-auto px-6 relative z-10">
          <div className="text-center mb-12 animate-on-scroll">
            <span className="text-xs font-bold tracking-[0.12em] uppercase text-brand-600 mb-4 inline-block font-grotesk">{t("landing2.pricingEyebrow")}</span>
            <h2 className="text-3xl sm:text-4xl font-bold font-grotesk text-gray-900 leading-tight mb-4">{t("landing2.pricingTitle")}</h2>
            <p className="text-base text-gray-500 max-w-xl mx-auto">{t("landing2.pricingSubtitle")}</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 max-w-[1000px] mx-auto">
            {/* Basis */}
            <div className="animate-on-scroll border-[3px] border-gray-200 rounded-none p-8 bg-white transition-all hover:-translate-y-1">
              <div className="font-grotesk text-lg font-bold text-gray-900 mb-2">{t("landing.planBasis")}</div>
              <p className="text-sm text-gray-500 mb-6 leading-relaxed">{t("landing2.pricingBasisDesc")}</p>
              <div className="font-grotesk text-4xl font-bold text-gray-900 mb-6">&euro;49 <span className="text-base font-medium text-gray-500">{t("landing2.pricingPerMonth")}</span></div>
              <ul className="space-y-2.5 mb-8">
                {[t("landing2.pricingBasisFeat1"), t("landing2.pricingBasisFeat2"), t("landing2.pricingBasisFeat3"), t("landing2.pricingBasisFeat4"), t("landing2.pricingBasisFeat5")].map((f, i) => (
                  <li key={i} className="flex items-center gap-2.5 text-sm text-gray-700"><CheckPricing />{f}</li>
                ))}
                {[t("landing2.pricingBasisFeatOff1"), t("landing2.pricingBasisFeatOff2"), t("landing2.pricingBasisFeatOff3")].map((f, i) => (
                  <li key={`off-${i}`} className="flex items-center gap-2.5 text-sm text-gray-400"><XCircle />{f}</li>
                ))}
              </ul>
              <Link href="/sign-up" className="block w-full text-center py-3.5 rounded-none font-grotesk font-bold text-sm text-gray-900 uppercase tracking-wide" style={{ border: "3px solid #1A1A1A" }}>
                {t("landing2.pricingCta")}
              </Link>
            </div>

            {/* Pro */}
            <div className="animate-on-scroll border-[3px] border-brand-600 rounded-none p-8 bg-white relative shadow-[6px_6px_0_#C1292E]">
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-brand-600 text-white text-xs font-bold font-grotesk px-5 py-1.5 uppercase tracking-wide whitespace-nowrap">{t("landing2.pricingMostPopular")}</span>
              <div className="font-grotesk text-lg font-bold text-gray-900 mb-2">{t("landing.planPro")}</div>
              <p className="text-sm text-gray-500 mb-6 leading-relaxed">{t("landing2.pricingProDesc")}</p>
              <div className="font-grotesk text-4xl font-bold text-gray-900 mb-6">&euro;149 <span className="text-base font-medium text-gray-500">{t("landing2.pricingPerMonth")}</span></div>
              <ul className="space-y-2.5 mb-8">
                {[t("landing2.pricingProFeat1"), t("landing2.pricingProFeat2"), t("landing2.pricingProFeat3"), t("landing2.pricingProFeat4"), t("landing2.pricingProFeat5"), t("landing2.pricingProFeat6"), t("landing2.pricingProFeat7")].map((f, i) => (
                  <li key={i} className="flex items-center gap-2.5 text-sm text-gray-700"><CheckPricing />{f}</li>
                ))}
                {[t("landing2.pricingProFeatOff1")].map((f, i) => (
                  <li key={`off-${i}`} className="flex items-center gap-2.5 text-sm text-gray-400"><XCircle />{f}</li>
                ))}
              </ul>
              <Link href="/sign-up" className="block w-full text-center py-3.5 rounded-none font-grotesk font-bold text-sm text-white bg-brand-600 uppercase tracking-wide hover:bg-brand-700 transition shadow-[4px_4px_0_#1A1A1A]">
                {t("landing2.pricingCtaPro")}
              </Link>
            </div>

            {/* Team */}
            <div className="animate-on-scroll border-[3px] border-gray-200 rounded-none p-8 bg-white transition-all hover:-translate-y-1">
              <div className="font-grotesk text-lg font-bold text-gray-900 mb-2">{t("landing.planTeam")}</div>
              <p className="text-sm text-gray-500 mb-6 leading-relaxed">{t("landing2.pricingTeamDesc")}</p>
              <div className="font-grotesk text-4xl font-bold text-gray-900 mb-6">&euro;299 <span className="text-base font-medium text-gray-500">{t("landing2.pricingPerMonth")}</span></div>
              <ul className="space-y-2.5 mb-8">
                {[t("landing2.pricingTeamFeat1"), t("landing2.pricingTeamFeat2"), t("landing2.pricingTeamFeat3"), t("landing2.pricingTeamFeat4"), t("landing2.pricingTeamFeat5"), t("landing2.pricingTeamFeat6"), t("landing2.pricingTeamFeat7"), t("landing2.pricingTeamFeat8")].map((f, i) => (
                  <li key={i} className="flex items-center gap-2.5 text-sm text-gray-700"><CheckPricing />{f}</li>
                ))}
              </ul>
              <Link href="/sign-up" className="block w-full text-center py-3.5 rounded-none font-grotesk font-bold text-sm text-gray-900 uppercase tracking-wide" style={{ border: "3px solid #1A1A1A" }}>
                {t("landing2.pricingCtaTeam")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section className="py-20 bg-gray-50 px-6 relative overflow-hidden">
        <BauhausOverlay variant="sparse" opacity={0.03} />
        <div className="max-w-3xl mx-auto relative z-10">
          <h2 className="text-3xl font-bold font-grotesk text-center text-gray-900 mb-12 animate-on-scroll">
            {t("landing.faqTitle")}
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <details key={i} className="bg-white rounded-none p-6 border-2 border-gray-200 animate-on-scroll">
                <summary className="font-semibold cursor-pointer text-gray-900">{faq.q}</summary>
                <p className="mt-3 text-gray-600 leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="bg-bauhaus-black text-gray-400 py-16 relative overflow-hidden">
        <CompositionGrid opacity={0.03} />
        <div className="max-w-[1200px] mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-10">
            <div>
              <div className="mb-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo/logo-full-horizontal.png" alt="BauPreis AI" height={28} className="h-7 w-auto brightness-0 invert" />
              </div>
              <p className="text-sm text-gray-500">{t("landing2.footerTagline")}</p>
              <p className="text-sm text-gray-500">{t("landing2.footerLocation")}</p>
            </div>
            <div className="flex flex-wrap gap-6">
              <Link href="/preise" className="text-sm text-gray-400 hover:text-bauhaus-yellow transition">{t("nav.pricing")}</Link>
              <Link href="/ueber-uns" className="text-sm text-gray-400 hover:text-bauhaus-yellow transition">{t("nav.aboutUs")}</Link>
              <Link href="/kontakt" className="text-sm text-gray-400 hover:text-bauhaus-yellow transition">{t("nav.contact")}</Link>
              <Link href="/impressum" className="text-sm text-gray-400 hover:text-bauhaus-yellow transition">{t("landing.footerImpressum")}</Link>
              <Link href="/datenschutz" className="text-sm text-gray-400 hover:text-bauhaus-yellow transition">{t("landing.footerDatenschutz")}</Link>
              <Link href="/agb" className="text-sm text-gray-400 hover:text-bauhaus-yellow transition">{t("landing.footerAgb")}</Link>
              <Link href="/changelog" className="text-sm text-gray-400 hover:text-bauhaus-yellow transition">Neuigkeiten</Link>
            </div>
          </div>

          {/* Bauhaus color bar */}
          <div className="flex h-1 mb-6">
            <div className="flex-[3] bg-brand-600" />
            <div className="flex-[2] bg-bauhaus-yellow" />
            <div className="flex-[1] bg-bauhaus-salmon" />
            <div className="flex-[4] bg-white/10" />
          </div>

          <p className="text-xs text-gray-600">
            {t("landing.footerCopyright").replace("{year}", String(new Date().getFullYear()))}
          </p>
        </div>
      </footer>
    </main>
  );
}
