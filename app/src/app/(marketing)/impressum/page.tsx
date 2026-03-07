import { cookies } from "next/headers";
import type { Locale } from "@/i18n";
import { getLegalContent } from "@/legal";
import { LegalPageShell } from "@/components/marketing/LegalPageShell";

export default async function ImpressumPage() {
  const locale = (cookies().get("locale")?.value || "de") as Locale;
  const legal = await getLegalContent("impressum", locale);

  return (
    <LegalPageShell
      heading={legal.heading}
      date={legal.date}
      sections={legal.sections}
    />
  );
}
