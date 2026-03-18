import type { Metadata } from "next";
import { cookies } from "next/headers";
import type { Locale } from "@/i18n";
import { getTranslations } from "@/i18n";
import UeberUnsClient from "./UeberUnsClient";

export async function generateMetadata(): Promise<Metadata> {
  const locale = (cookies().get("locale")?.value || "de") as Locale;
  const dict = getTranslations(locale);
  return {
    title: dict["meta.ueberuns.title"],
    description: dict["meta.ueberuns.description"],
  };
}

export default function UeberUnsPage() {
  return <UeberUnsClient />;
}
