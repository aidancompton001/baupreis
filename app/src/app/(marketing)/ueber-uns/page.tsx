import { cookies } from "next/headers";
import { t as tr, type Locale } from "@/i18n";

export default function UeberUnsPage() {
  const locale = (cookies().get("locale")?.value || "de") as Locale;

  return (
    <main className="min-h-screen">
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            {tr(locale, "aboutUs.heading")}
          </h1>

          <div className="prose prose-lg">
            <p>
              {tr(locale, "aboutUs.intro")}
            </p>

            <h2>{tr(locale, "aboutUs.mission.title")}</h2>
            <p>
              {tr(locale, "aboutUs.mission.text")}
            </p>

            <h2>{tr(locale, "aboutUs.drivers.title")}</h2>
            <p>
              {tr(locale, "aboutUs.drivers.text")}
            </p>

            <h2>{tr(locale, "aboutUs.madeInGermany.title")}</h2>
            <p>
              {tr(locale, "aboutUs.madeInGermany.text")}
            </p>

            <h2>{tr(locale, "aboutUs.contact.title")}</h2>
            <p>
              {tr(locale, "aboutUs.contact.text").split("kontakt@baupreis.ai")[0]}
              <a href="mailto:kontakt@baupreis.ai">kontakt@baupreis.ai</a>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
