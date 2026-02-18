"use client";

import Link from "next/link";
import MobileNav from "@/components/MobileNav";
import LanguageSwitcher from "@/i18n/LanguageSwitcher";
import { useLocale } from "@/i18n/LocaleContext";

export default function LandingPage() {
  const { t } = useLocale();

  const faqs = [
    { q: t("landing.faq1q"), a: t("landing.faq1a") },
    { q: t("landing.faq2q"), a: t("landing.faq2a") },
    { q: t("landing.faq3q"), a: t("landing.faq3a") },
    { q: t("landing.faq4q"), a: t("landing.faq4a") },
    { q: t("landing.faq5q"), a: t("landing.faq5a") },
    { q: t("landing.faq6q"), a: t("landing.faq6a") },
  ];

  return (
    <main className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold text-brand-600">
            BauPreis AI
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link href="/preise" className="text-gray-600 hover:text-gray-900">
              {t("nav.pricing")}
            </Link>
            <Link
              href="/ueber-uns"
              className="text-gray-600 hover:text-gray-900"
            >
              {t("nav.aboutUs")}
            </Link>
            <Link
              href="/sign-in"
              className="text-gray-600 hover:text-gray-900"
            >
              {t("nav.signIn")}
            </Link>
            <Link
              href="/sign-up"
              className="bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700 transition"
            >
              {t("nav.freeTrial")}
            </Link>
            <LanguageSwitcher />
          </div>
          <MobileNav />
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            {t("landing.painPoint")}
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            {t("landing.heroSubtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/sign-up"
              className="bg-brand-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-brand-700 transition"
            >
              {t("landing.ctaTrial")}
            </Link>
            <Link
              href="/preise"
              className="border border-gray-300 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition"
            >
              {t("landing.ctaPricing")}
            </Link>
          </div>
          <p className="mt-4 text-sm text-gray-500">
            {t("landing.ctaSubline")}
          </p>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 bg-gray-50 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {t("landing.problemTitle")}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t("landing.problemText")}
          </p>
        </div>
      </section>

      {/* Solution / USP Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            {t("landing.solutionTitle")}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-brand-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                {t("landing.feature1Title")}
              </h3>
              <p className="text-gray-600">
                {t("landing.feature1Text")}
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-brand-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤖</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">{t("landing.feature2Title")}</h3>
              <p className="text-gray-600">
                {t("landing.feature2Text")}
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-brand-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔔</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                {t("landing.feature3Title")}
              </h3>
              <p className="text-gray-600">
                {t("landing.feature3Text")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-gray-50 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            {t("landing.howTitle")}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-brand-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="font-semibold mb-2">{t("landing.step1Title")}</h3>
              <p className="text-gray-600">
                {t("landing.step1Text")}
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-brand-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="font-semibold mb-2">{t("landing.step2Title")}</h3>
              <p className="text-gray-600">
                {t("landing.step2Text")}
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-brand-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="font-semibold mb-2">{t("landing.step3Title")}</h3>
              <p className="text-gray-600">
                {t("landing.step3Text")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {t("landing.pricingTitle")}
          </h2>
          <p className="text-lg text-gray-600 mb-12">
            {t("landing.pricingSubtitle")}
          </p>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Basis */}
            <div className="border rounded-2xl p-8 hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-2">{t("landing.planBasis")}</h3>
              <p className="text-4xl font-bold mb-1">
                €1<span className="text-lg text-gray-500">{t("landing.perMonth")}</span>
              </p>
              <p className="text-sm text-gray-500 mb-6">{t("landing.basisYearly")}</p>
              <ul className="text-left space-y-3 mb-8 text-gray-600">
                <li>{t("landing.feat5Materials")}</li>
                <li>{t("landing.feat1User")}</li>
                <li>{t("landing.feat3Alerts")}</li>
                <li>{t("landing.featEmailReports")}</li>
                <li>{t("landing.feat2xDaily")}</li>
              </ul>
              <Link
                href="/sign-up"
                className="block w-full border border-brand-600 text-brand-600 py-3 rounded-lg font-semibold hover:bg-brand-50 transition"
              >
                {t("nav.freeTrial")}
              </Link>
            </div>
            {/* Pro */}
            <div className="border-2 border-brand-600 rounded-2xl p-8 shadow-lg relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brand-600 text-white text-sm font-semibold px-4 py-1 rounded-full">
                {t("landing.popular")}
              </div>
              <h3 className="text-xl font-semibold mb-2">{t("landing.planPro")}</h3>
              <p className="text-4xl font-bold mb-1">
                €149<span className="text-lg text-gray-500">{t("landing.perMonth")}</span>
              </p>
              <p className="text-sm text-gray-500 mb-6">{t("landing.proYearly")}</p>
              <ul className="text-left space-y-3 mb-8 text-gray-600">
                <li>{t("landing.featAllMaterials")}</li>
                <li>{t("landing.feat1User")}</li>
                <li>{t("landing.featUnlimitedAlerts")}</li>
                <li>{t("landing.featTelegram")}</li>
                <li>{t("landing.featAiForecasts")}</li>
                <li>{t("landing.feat4xDaily")}</li>
              </ul>
              <Link
                href="/sign-up"
                className="block w-full bg-brand-600 text-white py-3 rounded-lg font-semibold hover:bg-brand-700 transition"
              >
                {t("nav.freeTrial")}
              </Link>
            </div>
            {/* Team */}
            <div className="border rounded-2xl p-8 hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-2">{t("landing.planTeam")}</h3>
              <p className="text-4xl font-bold mb-1">
                €299<span className="text-lg text-gray-500">{t("landing.perMonth")}</span>
              </p>
              <p className="text-sm text-gray-500 mb-6">{t("landing.teamYearly")}</p>
              <ul className="text-left space-y-3 mb-8 text-gray-600">
                <li>{t("landing.featAllMaterials")}</li>
                <li>{t("landing.feat5Users")}</li>
                <li>{t("landing.featUnlimitedAlerts")}</li>
                <li>{t("pricing.featTelegramEmail")}</li>
                <li>{t("landing.featAiForecasts")}</li>
                <li>{t("landing.featApi")}</li>
                <li>{t("landing.featDedicatedSupport")}</li>
              </ul>
              <Link
                href="/sign-up"
                className="block w-full border border-brand-600 text-brand-600 py-3 rounded-lg font-semibold hover:bg-brand-50 transition"
              >
                {t("nav.freeTrial")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-gray-50 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            {t("landing.faqTitle")}
          </h2>
          <div className="space-y-6">
            {faqs.map((faq, i) => (
              <details key={i} className="bg-white rounded-lg p-6 shadow-sm">
                <summary className="font-semibold cursor-pointer">
                  {faq.q}
                </summary>
                <p className="mt-3 text-gray-600">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {t("landing.ctaBottomTitle")}
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            {t("landing.ctaBottomText")}
          </p>
          <Link
            href="/sign-up"
            className="bg-brand-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-brand-700 transition inline-block"
          >
            {t("landing.ctaBottomButton")}
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            {t("landing.footerCopyright").replace("{year}", String(new Date().getFullYear()))}
          </p>
          <div className="flex gap-6 text-sm text-gray-500">
            <Link href="/impressum" className="hover:text-gray-900">
              {t("landing.footerImpressum")}
            </Link>
            <Link href="/datenschutz" className="hover:text-gray-900">
              {t("landing.footerDatenschutz")}
            </Link>
            <Link href="/agb" className="hover:text-gray-900">
              {t("landing.footerAgb")}
            </Link>
            <button
              onClick={() => (window as any).__openCookieSettings?.()}
              className="hover:text-gray-900 cursor-pointer"
            >
              {t("cookie.settings")}
            </button>
          </div>
        </div>
      </footer>
    </main>
  );
}
