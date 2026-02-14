import Link from "next/link";
import { cookies } from "next/headers";
import { t as tr, type Locale } from "@/i18n";

export default function BlogPage() {
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
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {tr(locale, "blog.heading")}
          </h1>
          <p className="text-lg text-gray-600 mb-12">
            {tr(locale, "blog.subheading")}
          </p>

          <div className="text-center py-12 text-gray-500">
            <p className="text-lg">{tr(locale, "blog.placeholder1")}</p>
            <p className="mt-2">
              {tr(locale, "blog.placeholder2")}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
