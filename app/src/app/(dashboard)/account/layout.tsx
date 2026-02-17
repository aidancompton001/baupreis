"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "@/i18n/LocaleContext";

const tabs = [
  { href: "/account/profile", labelKey: "account.nav.profile", icon: "👤" },
  { href: "/account/billing", labelKey: "account.nav.billing", icon: "💳" },
  { href: "/account/data", labelKey: "account.nav.data", icon: "📋" },
  { href: "/account/security", labelKey: "account.nav.security", icon: "🔒" },
];

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { t } = useLocale();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        {t("account.title")}
      </h1>

      {/* Tab Navigation */}
      <div className="border-b mb-6 overflow-x-auto">
        <nav className="flex gap-0 -mb-px">
          {tabs.map((tab) => {
            const active = pathname === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition ${
                  active
                    ? "border-brand-600 text-brand-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <span>{tab.icon}</span>
                <span>{t(tab.labelKey)}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {children}
    </div>
  );
}
