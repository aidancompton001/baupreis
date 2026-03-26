"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "@/i18n/LocaleContext";
import { useOrg } from "@/lib/hooks/useOrg";
import PlanBadge from "@/components/dashboard/PlanBadge";
import {
  IconDashboard,
  IconForecasts,
  IconChat,
  IconEscalation,
  IconAlloy,
  IconAlerts,
  IconReports,
  IconSettings,
  IconAccount,
} from "@/components/icons/BauhausIcons";

const navItems: Array<{
  href: string;
  labelKey: string;
  icon: React.ReactNode;
  dataTour?: string;
  plan?: "Pro" | "Team";
}> = [
  { href: "/dashboard", labelKey: "nav.overview", icon: <IconDashboard size={20} /> },
  { href: "/prognose", labelKey: "nav.forecasts", icon: <IconForecasts size={20} />, dataTour: "nav-prognose", plan: "Pro" },
  { href: "/chat", labelKey: "nav.chat", icon: <IconChat size={20} />, plan: "Pro" },
  { href: "/preisgleitklausel", labelKey: "nav.escalation", icon: <IconEscalation size={20} />, plan: "Pro" },
  { href: "/legierungsrechner", labelKey: "nav.alloyCalc", icon: <IconAlloy size={20} />, plan: "Pro" },
  { href: "/alerts", labelKey: "nav.alerts", icon: <IconAlerts size={20} />, dataTour: "nav-alerts" },
  { href: "/berichte", labelKey: "nav.reports", icon: <IconReports size={20} />, dataTour: "nav-berichte" },
  { href: "/einstellungen", labelKey: "nav.settings", icon: <IconSettings size={20} />, dataTour: "nav-einstellungen" },
  { href: "/account", labelKey: "nav.account", icon: <IconAccount size={20} /> },
];

// Mobile: show only core 5 items (Chat + Gleitklausel accessible via desktop sidebar)
const mobileNavItems = navItems.filter(
  (item) => item.href !== "/chat" && item.href !== "/preisgleitklausel"
);

export default function DashboardNav() {
  const pathname = usePathname();
  const { t } = useLocale();
  const { org } = useOrg();
  const isTrial = org?.plan === "trial";

  function isActive(href: string): boolean {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 fixed left-0 top-16 bottom-0 sidebar-glass overflow-y-auto">
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                data-tour={item.dataTour}
                className={`sidebar-item ${
                  active
                    ? "sidebar-item-active"
                    : "sidebar-item-inactive"
                }`}
              >
                {item.icon}
                <span className="font-grotesk text-xs uppercase tracking-wide font-semibold">{t(item.labelKey)}</span>
                {isTrial && item.plan && <PlanBadge plan={item.plan} />}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Mobile Bottom Nav — BLACK bg like mockup */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#1A1A1A] border-t-2 border-brand-600 z-50 pb-6">
        <div className="flex justify-around py-2">
          {mobileNavItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center text-[9px] font-grotesk uppercase tracking-wide px-1 ${
                  active
                    ? "text-brand-500 font-semibold"
                    : "text-white/60 hover:text-white"
                }`}
              >
                <span className="mb-0.5">{item.icon}</span>
                <span className="truncate max-w-[60px]">{t(item.labelKey)}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
