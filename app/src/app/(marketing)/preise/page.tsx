import type { Metadata } from "next";
import { cookies } from "next/headers";
import type { Locale } from "@/i18n";
import { getTranslations } from "@/i18n";
import PreiseClient from "./PreiseClient";

export async function generateMetadata(): Promise<Metadata> {
  const locale = (cookies().get("locale")?.value || "de") as Locale;
  const dict = getTranslations(locale);
  return {
    title: dict["meta.preise.title"],
    description: dict["meta.preise.description"],
  };
}

export default function PreisePage() {
  return <PreiseClient />;
}
