"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "@/i18n/LocaleContext";
import { useOrg } from "@/lib/hooks/useOrg";
import PlanBadge from "@/components/dashboard/PlanBadge";
import {
  BarChart3,
  Bot,
  MessageSquare,
  Ruler,
  FlaskConical,
  Bell,
  FileText,
  Settings,
  User,
} from "lucide-react";

const navItems: Array<{
  href: string;
  labelKey: string;
  icon: React.ReactNode;
  dataTour?: string;
  plan?: "Pro" | "Team";
}> = [
  { href: "/dashboard", labelKey: "nav.overview", icon: <BarChart3 size={18} /> },
  { href: "/prognose", labelKey: "nav.forecasts", icon: <Bot size={18} />, dataTour: "nav-prognose", plan: "Pro" },
  { href: "/chat", labelKey: "nav.chat", icon: <MessageSquare size={18} />, plan: "Pro" },
  { href: "/preisgleitklausel", labelKey: "nav.escalation", icon: <Ruler size={18} />, plan: "Pro" },
  { href: "/legierungsrechner", labelKey: "nav.alloyCalc", icon: <FlaskConical size={18} />, plan: "Pro" },
  { href: "/alerts", labelKey: "nav.alerts", icon: <Bell size={18} />, dataTour: "nav-alerts" },
  { href: "/berichte", labelKey: "nav.reports", icon: <FileText size={18} />, dataTour: "nav-berichte" },
  { href: "/einstellungen", labelKey: "nav.settings", icon: <Settings size={18} />, dataTour: "nav-einstellungen" },
  { href: "/account", labelKey: "nav.account", icon: <User size={18} /> },
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
                <span>{t(item.labelKey)}</span>
                {isTrial && item.plan && <PlanBadge plan={item.plan} />}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Mobile Bottom Nav */}
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
