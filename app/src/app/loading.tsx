"use client";

import { useLocale } from "@/i18n/LocaleContext";

export default function GlobalLoading() {
  const { t } = useLocale();
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
        <p className="text-gray-500">{t("loading.message")}</p>
      </div>
    </div>
  );
}
