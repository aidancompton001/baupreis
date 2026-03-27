"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LanguageDropdown from "./LanguageDropdown";
import AccountDropdown from "./AccountDropdown";
import NotificationBell from "./NotificationBell";
import { useState, useEffect } from "react";
import { useLocale } from "@/i18n/LocaleContext";

/* Check if user is logged in via session cookie — SSR-safe with useEffect */
function useIsLoggedIn() {
  const [loggedIn, setLoggedIn] = useState(false);
  useEffect(() => {
    setLoggedIn(document.cookie.includes("session=") || document.cookie.includes("baupreis_session="));
  }, []);
  return loggedIn;
}

/* Pages where header should NOT appear */
const HIDDEN_PATHS = ["/sign-in", "/sign-up", "/onboarding"];

export default function UnifiedHeader() {
  /* ALL hooks MUST be called before any conditional return (React Rules of Hooks) */
  const pathname = usePathname();
  const { t } = useLocale();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isLoggedIn = useIsLoggedIn();

  /* Hide on auth/onboarding pages — AFTER all hooks */
  if (HIDDEN_PATHS.some((p) => pathname.startsWith(p))) return null;

  const isOnDashboard = pathname.startsWith("/dashboard") || pathname.startsWith("/material") || pathname.startsWith("/prognose") || pathname.startsWith("/chat") || pathname.startsWith("/alerts") || pathname.startsWith("/berichte") || pathname.startsWith("/einstellungen") || pathname.startsWith("/account") || pathname.startsWith("/preisgleitklausel") || pathname.startsWith("/legierungsrechner");

  const tabs = [
    ...(isLoggedIn ? [{ href: "/dashboard", label: "Dashboard" }] : []),
    { href: "/preise", label: t("nav.pricing") },
    { href: "/ueber-uns", label: t("nav.aboutUs") },
    { href: "/kontakt", label: t("nav.contact") },
    { href: "/changelog", label: "Neuigkeiten" },
  ];

  function isActiveTab(href: string) {
    if (href === "/dashboard") return isOnDashboard;
    return pathname.startsWith(href);
  }

  return (
    <>
      <header className="fixed top-0 w-full bg-[#1A1A1A] border-b-[3px] border-brand-600 z-50 h-14">
        <div className="h-full max-w-[1400px] mx-auto px-4 flex items-center">
          {/* LEFT: Logo icon only */}
          <Link href="/" className="flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo/logo-icon.png" alt="BauPreis AI" width={32} height={32} className="h-8 w-8" />
          </Link>

          {/* CENTER: Tabs (desktop) */}
          <nav className="hidden md:flex items-center gap-1 ml-8">
            {tabs.map((tab) => (
              <Link
                key={tab.href}
                href={tab.href}
                className={`px-4 py-2 font-grotesk text-xs uppercase tracking-wide font-semibold transition-colors ${
                  isActiveTab(tab.href)
                    ? "text-white bg-brand-600"
                    : "text-white/60 hover:text-white hover:bg-white/10"
                }`}
              >
                {tab.label}
              </Link>
            ))}
          </nav>

          {/* RIGHT: Lang + Account/Auth */}
          <div className="flex items-center gap-3 ml-auto">
            <LanguageDropdown />
            {isLoggedIn ? (
              <>
                <NotificationBell />
                <AccountDropdown />
              </>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <Link href="/sign-in" className="text-white/60 text-xs font-grotesk uppercase tracking-wide hover:text-white transition">
                  {t("nav.signIn")}
                </Link>
                <Link href="/sign-up" className="bg-brand-600 text-white px-4 py-2 text-xs font-grotesk uppercase tracking-wide font-bold hover:bg-brand-700 transition shadow-[3px_3px_0_#fff3]">
                  {t("nav.freeTrial")}
                </Link>
              </div>
            )}

            {/* MOBILE: Hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden flex flex-col gap-1 p-2"
              aria-label="Menu"
            >
              <span className={`block w-5 h-0.5 bg-white transition-transform ${mobileOpen ? "rotate-45 translate-y-1.5" : ""}`} />
              <span className={`block w-5 h-0.5 bg-white transition-opacity ${mobileOpen ? "opacity-0" : ""}`} />
              <span className={`block w-5 h-0.5 bg-white transition-transform ${mobileOpen ? "-rotate-45 -translate-y-1.5" : ""}`} />
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE: Full-screen menu */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 top-14 bg-[#1A1A1A] z-40 p-6">
          <nav className="flex flex-col gap-2">
            {tabs.map((tab) => (
              <Link
                key={tab.href}
                href={tab.href}
                onClick={() => setMobileOpen(false)}
                className={`px-4 py-3 font-grotesk text-sm uppercase tracking-wide font-semibold ${
                  isActiveTab(tab.href)
                    ? "text-white bg-brand-600"
                    : "text-white/60 hover:text-white"
                }`}
              >
                {tab.label}
              </Link>
            ))}
            {!isLoggedIn && (
              <>
                <Link href="/sign-in" onClick={() => setMobileOpen(false)} className="px-4 py-3 text-white/60 font-grotesk text-sm uppercase tracking-wide">
                  {t("nav.signIn")}
                </Link>
                <Link href="/sign-up" onClick={() => setMobileOpen(false)} className="px-4 py-3 bg-brand-600 text-white font-grotesk text-sm uppercase tracking-wide font-bold text-center">
                  {t("nav.freeTrial")}
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </>
  );
}
