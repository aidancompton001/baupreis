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
    title: dict["meta.agb.title"],
    description: dict["meta.agb.description"],
  };
}

export default async function AGBPage() {
  const locale = (cookies().get("locale")?.value || "de") as Locale;
  const legal = await getLegalContent("agb", locale);

  return (
    <LegalPageShell
      heading={legal.heading}
      date={legal.date}
      sections={legal.sections}
    />
  );
}
