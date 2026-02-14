import Link from "next/link";
import { cookies } from "next/headers";
import { t as tr, type Locale } from "@/i18n";

export default function ImpressumPage() {
  const locale = (cookies().get("locale")?.value || "de") as Locale;

  return (
    <main className="min-h-screen">
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold text-brand-600">
            BauPreis AI
          </Link>
        </div>
      </nav>

      <div className="pt-32 pb-20 px-4 max-w-3xl mx-auto prose">
        <h1>{tr(locale, "impressum.heading")}</h1>

        <h2>{tr(locale, "impressum.s1.title")}</h2>
        <p>
          {tr(locale, "impressum.s1.placeholder").split("\n").map((line, i) => (
            <span key={i}>{line}<br /></span>
          ))}
        </p>

        <h2>{tr(locale, "impressum.s2.title")}</h2>
        <p>
          {tr(locale, "impressum.s2.phone")}
          <br />
          {tr(locale, "impressum.s2.email")}
        </p>

        <h2>{tr(locale, "impressum.s4.title")}</h2>
        <p>
          {tr(locale, "impressum.s4.law")}
          <br />
          {tr(locale, "impressum.s4.vatin")}
        </p>

        <h2>{tr(locale, "impressum.s5.title")}</h2>
        <p>
          {tr(locale, "impressum.s5.placeholder").split("\n").map((line, i) => (
            <span key={i}>{line}<br /></span>
          ))}
        </p>

        <h2>{tr(locale, "impressum.s6.title")}</h2>
        <p>{tr(locale, "impressum.s6.text")}</p>

      </div>
    </main>
  );
}
