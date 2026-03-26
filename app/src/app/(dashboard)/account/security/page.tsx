"use client";

import Link from "next/link";
import { useLocale } from "@/i18n/LocaleContext";

export default function SecurityPage() {
  const { t } = useLocale();

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Section 1: Access */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-all duration-300">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <span>{t("account.security.access")}</span>
        </h2>

        <div className="space-y-5">
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-1">
              {t("account.security.currentSession")}
            </h3>
            <p className="text-sm text-gray-500 mb-3">
              {t("account.security.sessionDesc")}
            </p>
            <button
              onClick={async () => {
                await fetch("/api/auth/logout", { method: "POST" });
                window.location.href = "/";
              }}
              className="px-6 py-2.5 text-sm font-medium rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
            >
              {t("account.security.logout")}
            </button>
          </div>
        </div>
      </div>

      {/* Section 2: Danger Zone */}
      <div className="bg-red-50 rounded-xl border border-red-200 p-6 hover:shadow-md transition-all duration-300">
        <h2 className="text-lg font-semibold text-red-800 mb-2 flex items-center gap-2">
          <span>{t("account.security.dangerZone")}</span>
        </h2>
        <p className="text-sm text-red-600 mb-4">
          {t("account.security.deleteDesc")}
        </p>
        <Link
          href="/account/data"
          className="inline-flex items-center px-6 py-2.5 text-sm font-medium rounded-xl border border-red-300 text-red-700 bg-white hover:bg-red-50 shadow-sm hover:-translate-y-0.5 transition-all duration-300"
        >
          {t("account.security.deleteLink")}
        </Link>
      </div>
    </div>
  );
}
