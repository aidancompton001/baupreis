import { cookies } from "next/headers";
import { t as tr, type Locale } from "@/i18n";

export default function DatenschutzPage() {
  const locale = (cookies().get("locale")?.value || "de") as Locale;

  return (
    <main className="min-h-screen">
      <div className="pt-32 pb-20 px-4 max-w-3xl mx-auto prose">
        <h1>{tr(locale, "datenschutz.heading")}</h1>

        <h2>{tr(locale, "datenschutz.s1.title")}</h2>
        <h3>{tr(locale, "datenschutz.s1.subtitle")}</h3>
        <p>{tr(locale, "datenschutz.s1.text")}</p>

        <h2>{tr(locale, "datenschutz.s2.title")}</h2>
        <p>{tr(locale, "datenschutz.s2.text")}</p>

        <h2>{tr(locale, "datenschutz.s3.title")}</h2>
        <h3>{tr(locale, "datenschutz.s3.subtitle")}</h3>
        <p>{tr(locale, "datenschutz.s3.text")}</p>

        <h2>{tr(locale, "datenschutz.s4.title")}</h2>
        <h3>{tr(locale, "datenschutz.s4.subtitle")}</h3>
        <p>{tr(locale, "datenschutz.s4.text")}</p>

        <h2>{tr(locale, "datenschutz.s5.title")}</h2>
        <p>{tr(locale, "datenschutz.s5.text")}</p>

        <h2>{tr(locale, "datenschutz.s6.title")}</h2>
        <h3>{tr(locale, "datenschutz.s6.subtitle")}</h3>
        <p>{tr(locale, "datenschutz.s6.text")}</p>

        <h2>{tr(locale, "datenschutz.s7.title")}</h2>
        <h3>{tr(locale, "datenschutz.s7.subtitle")}</h3>
        <p>{tr(locale, "datenschutz.s7.text")}</p>

        <p className="text-sm text-gray-500 mt-8">
          <em>{tr(locale, "datenschutz.disclaimer")}</em>
        </p>
      </div>
    </main>
  );
}
