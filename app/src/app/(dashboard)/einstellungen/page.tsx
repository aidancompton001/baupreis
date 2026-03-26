"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const [restarting, setRestarting] = useState(false);

  async function handleRestartTour() {
    setRestarting(true);
    try {
      await fetch("/api/user/preferences", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tour_completed: false }),
      });
    } catch {
      // silently ignore network errors
    }
    router.push("/dashboard");
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t("settings.title")}</h1>
        <p className="text-gray-500 text-sm mt-1">
          {t("settings.subtitle")}
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {settingsItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
          >
            <span className="text-3xl block group-hover:scale-110 transition-transform duration-300">{item.icon}</span>
            <h3 className="font-semibold text-gray-900 mt-3">{t(item.titleKey)}</h3>
            <p className="text-sm text-gray-500 mt-1 leading-relaxed">{t(item.descKey)}</p>
          </Link>
        ))}
      </div>

      {/* Product Tour restart */}
      <div className="mt-8 pt-6 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">{t("settings.tour.title")}</h3>
            <p className="text-sm text-gray-500 mt-0.5">{t("settings.tour.desc")}</p>
          </div>
          <button
            onClick={handleRestartTour}
            disabled={restarting}
            className="shrink-0 ml-4 px-4 py-2 text-sm font-medium text-brand-600 border border-brand-200 rounded-lg hover:bg-brand-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {restarting ? "..." : t("settings.tour.restart")}
          </button>
        </div>
      </div>
    </div>
  );
}
