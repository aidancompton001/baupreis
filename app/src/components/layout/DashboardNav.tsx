"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "@/i18n/LocaleContext";
import { useOrg } from "@/lib/hooks/useOrg";
import PlanBadge from "@/components/dashboard/PlanBadge";

const navItems: Array<{
  href: string;
  labelKey: string;
  icon: string;
  plan?: "Pro" | "Team";
}> = [
  { href: "/dashboard", labelKey: "nav.overview", icon: "📊" },
  { href: "/prognose", labelKey: "nav.forecasts", icon: "🤖", plan: "Pro" },
  { href: "/chat", labelKey: "nav.chat", icon: "💬", plan: "Pro" },
  { href: "/preisgleitklausel", labelKey: "nav.escalation", icon: "📐", plan: "Pro" },
  { href: "/legierungsrechner", labelKey: "nav.alloyCalc", icon: "⚗️", plan: "Pro" },
  { href: "/alerts", labelKey: "nav.alerts", icon: "🔔" },
  { href: "/berichte", labelKey: "nav.reports", icon: "📄" },
  { href: "/einstellungen", labelKey: "nav.settings", icon: "⚙️" },
  { href: "/account", labelKey: "nav.account", icon: "👤" },
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
                className={`sidebar-item ${
                  active
                    ? "sidebar-item-active"
                    : "sidebar-item-inactive"
                }`}
              >
                <span>{item.icon}</span>
                <span>{t(item.labelKey)}</span>
                {isTrial && item.plan && <PlanBadge plan={item.plan} />}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Mobile Bottom Nav — ALL 5 ITEMS */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-50">
        <div className="flex justify-around py-2">
          {mobileNavItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center text-[10px] px-1 ${
                  active
                    ? "text-brand-600 font-medium"
                    : "text-gray-600 hover:text-brand-600"
                }`}
              >
                <span className="text-base">{item.icon}</span>
                <span className="truncate max-w-[60px]">{t(item.labelKey)}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
