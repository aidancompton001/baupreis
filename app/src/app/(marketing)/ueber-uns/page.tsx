import Link from "next/link";
import { cookies } from "next/headers";
import { t as tr, type Locale } from "@/i18n";

export default function UeberUnsPage() {
  const locale = (cookies().get("locale")?.value || "de") as Locale;

  return (
    <main className="min-h-screen">
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold text-brand-600">
            BauPreis AI
          </Link>
          <Link
            href="/sign-up"
            className="bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700 transition"
          >
            {tr(locale, "nav.freeTrial")}
          </Link>
        </div>
      </nav>

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
