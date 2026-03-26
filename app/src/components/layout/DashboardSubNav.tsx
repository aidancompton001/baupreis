"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "@/i18n/LocaleContext";
import {
  IconDashboard,
  IconForecasts,
  IconChat,
  IconEscalation,
  IconAlloy,
  IconAlerts,
  IconReports,
  IconSettings,
} from "@/components/icons/BauhausIcons";

const subNavItems = [
  { href: "/dashboard", labelKey: "nav.overview", icon: <IconDashboard size={16} />, dataTour: undefined },
  { href: "/dashboard/materialien", labelKey: "nav.materials", icon: <IconDashboard size={16} />, dataTour: undefined },
  { href: "/prognose", labelKey: "nav.forecasts", icon: <IconForecasts size={16} />, dataTour: "nav-prognose" },
  { href: "/chat", labelKey: "nav.chat", icon: <IconChat size={16} />, dataTour: undefined },
  { href: "/preisgleitklausel", labelKey: "nav.escalation", icon: <IconEscalation size={16} />, dataTour: undefined },
  { href: "/legierungsrechner", labelKey: "nav.alloyCalc", icon: <IconAlloy size={16} />, dataTour: undefined },
  { href: "/alerts", labelKey: "nav.alerts", icon: <IconAlerts size={16} />, dataTour: "nav-alerts" },
  { href: "/berichte", labelKey: "nav.reports", icon: <IconReports size={16} />, dataTour: "nav-berichte" },
  { href: "/einstellungen", labelKey: "nav.settings", icon: <IconSettings size={16} />, dataTour: "nav-einstellungen" },
];

export default function DashboardSubNav() {
  const pathname = usePathname();
  const { t } = useLocale();

  function isActive(href: string) {
    if (href === "/dashboard") return pathname === "/dashboard";
    if (href === "/dashboard/materialien") return pathname === "/dashboard/materialien";
    return pathname.startsWith(href);
  }

  return (
    <nav className="sticky top-14 bg-white border-b-2 border-[#1A1A1A] z-40">
      <div className="max-w-[1400px] mx-auto px-4 flex gap-0 overflow-x-auto scrollbar-hide">
        {subNavItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            data-tour={item.dataTour}
            className={`flex items-center gap-1.5 px-4 py-3 font-grotesk text-[0.65rem] uppercase tracking-wide font-semibold whitespace-nowrap border-b-2 transition-colors ${
              isActive(item.href)
                ? "border-brand-600 text-brand-600 bg-brand-50"
                : "border-transparent text-[#1A1A1A]/60 hover:text-[#1A1A1A] hover:bg-gray-50"
            }`}
          >
            {item.icon}
            {t(item.labelKey)}
          </Link>
        ))}
      </div>
    </nav>
  );
}
