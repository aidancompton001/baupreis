import { cookies } from "next/headers";
import { t as tr, type Locale } from "@/i18n";

export default function AGBPage() {
  const locale = (cookies().get("locale")?.value || "de") as Locale;

  return (
    <main className="min-h-screen">
      <div className="pt-32 pb-20 px-4 max-w-3xl mx-auto prose">
        <h1>{tr(locale, "agb.heading")}</h1>

        <h2>{tr(locale, "agb.s1.title")}</h2>
        <p>{tr(locale, "agb.s1.text")}</p>

        <h2>{tr(locale, "agb.s2.title")}</h2>
        <p>{tr(locale, "agb.s2.text")}</p>

        <h2>{tr(locale, "agb.s3.title")}</h2>
        <p>{tr(locale, "agb.s3.text")}</p>

        <h2>{tr(locale, "agb.s4.title")}</h2>
        <p>{tr(locale, "agb.s4.text")}</p>

        <h2>{tr(locale, "agb.s5.title")}</h2>
        <p>{tr(locale, "agb.s5.text")}</p>

        <h2>{tr(locale, "agb.s6.title")}</h2>
        <p>{tr(locale, "agb.s6.text")}</p>

        <h2>{tr(locale, "agb.s7.title")}</h2>
        <p>{tr(locale, "agb.s7.text")}</p>

        <h2>{tr(locale, "agb.s8.title")}</h2>
        <p>{tr(locale, "agb.s8.text")}</p>

        <p className="text-sm text-gray-500 mt-8">
          <em>{tr(locale, "agb.disclaimer")}</em>
        </p>
      </div>
    </main>
  );
}
