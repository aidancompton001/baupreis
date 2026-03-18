import type { Metadata } from "next";
import { cookies } from "next/headers";
import type { Locale } from "@/i18n";
import { getTranslations } from "@/i18n";
import { getLegalContent } from "@/legal";
import { LegalPageShell } from "@/components/marketing/LegalPageShell";

export async function generateMetadata(): Promise<Metadata> {
  const locale = (cookies().get("locale")?.value || "de") as Locale;
  const dict = getTranslations(locale);
  return {
    title: dict["meta.datenschutz.title"],
    description: dict["meta.datenschutz.description"],
  };
}

export default async function DatenschutzPage() {
  const locale = (cookies().get("locale")?.value || "de") as Locale;
  const legal = await getLegalContent("datenschutz", locale);

  return (
    <LegalPageShell
      heading={legal.heading}
      date={legal.date}
      sections={legal.sections}
    />
  );
}
