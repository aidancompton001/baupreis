import { cookies } from "next/headers";
import type { Locale } from "@/i18n";
import { getLegalContent } from "@/legal";

export default async function ImpressumPage() {
  const locale = (cookies().get("locale")?.value || "de") as Locale;
  const legal = await getLegalContent("impressum", locale);

  return (
    <main className="min-h-screen">
      <div className="pt-32 pb-20 px-4 max-w-3xl mx-auto prose">
        <h1>{legal.heading}</h1>
        <p className="text-sm text-gray-500 not-prose">{legal.date}</p>
        {legal.sections.map((s, i) => (
          <section key={i}>
            <h2>{s.title}</h2>
            <div className="whitespace-pre-line text-base leading-relaxed">
              {s.content}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
