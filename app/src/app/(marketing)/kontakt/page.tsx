import type { Metadata } from "next";
import { cookies } from "next/headers";
import type { Locale } from "@/i18n";
import { getTranslations } from "@/i18n";
import KontaktClient from "./KontaktClient";

export async function generateMetadata(): Promise<Metadata> {
  const locale = (cookies().get("locale")?.value || "de") as Locale;
  const dict = getTranslations(locale);
  return {
    title: dict["meta.kontakt.title"],
    description: dict["meta.kontakt.description"],
  };
}

export default function KontaktPage() {
  return <KontaktClient />;
}
