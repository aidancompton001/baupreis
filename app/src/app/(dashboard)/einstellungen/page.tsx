"use client";

import Link from "next/link";
import { useLocale } from "@/i18n/LocaleContext";

const settingsItems = [
  { href: "/einstellungen/materialien", titleKey: "settings.materials.title", descKey: "settings.materials.desc", icon: "🏗️" },
  { href: "/einstellungen/abo", titleKey: "settings.subscription.title", descKey: "settings.subscription.desc", icon: "💳" },
  { href: "/einstellungen/team", titleKey: "settings.team.title", descKey: "settings.team.desc", icon: "👥" },
  { href: "/einstellungen/telegram", titleKey: "settings.telegram.title", descKey: "settings.telegram.desc", icon: "📱" },
  { href: "/einstellungen/whatsapp", titleKey: "settings.whatsapp.title", descKey: "settings.whatsapp.desc", icon: "💬" },
  { href: "/einstellungen/api", titleKey: "settings.api.title", descKey: "settings.api.desc", icon: "🔑" },
];

export default function EinstellungenPage() {
  const { t } = useLocale();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t("settings.title")}</h1>
        <p className="text-gray-600">
          {t("settings.subtitle")}
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {settingsItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="bg-white rounded-xl border p-6 hover:shadow-md transition"
          >
            <span className="text-3xl">{item.icon}</span>
            <h3 className="font-semibold mt-3">{t(item.titleKey)}</h3>
            <p className="text-sm text-gray-500 mt-1">{t(item.descKey)}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
