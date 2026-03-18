import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import { LocaleProvider } from "@/i18n/LocaleContext";
import { getTranslations, type Locale, LOCALE_DATE_MAP } from "@/i18n";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import CookieConsent from "@/components/CookieConsent";
import "./globals.css";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

const GTM_ID = "GTM-TF2Q5T8C";

const OG_LOCALE_MAP: Record<Locale, string> = {
  de: "de_DE",
  en: "en_US",
  ru: "ru_RU",
};

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = cookies();
  const locale = (cookieStore.get("locale")?.value || "de") as Locale;
  const dict = getTranslations(locale);

  return {
    title: {
      default: dict["meta.title"],
      template: "%s | BauPreis AI",
    },
    description: dict["meta.description"],
    keywords: ["Baustoffpreise", "Baupreise", "KI Prognosen", "Stahl", "Kupfer", "Baumaterial", "Deutschland", "B2B SaaS"],
    openGraph: {
      title: dict["meta.ogTitle"],
      description: dict["meta.ogDescription"],
      url: "https://baupreis.ais152.com",
      siteName: "BauPreis AI",
      locale: OG_LOCALE_MAP[locale],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: dict["meta.ogTitle"],
      description: dict["meta.ogDescription"],
    },
    alternates: {
      canonical: "https://baupreis.ais152.com",
      languages: {
        "de-DE": "https://baupreis.ais152.com",
        "en-US": "https://baupreis.ais152.com",
        "ru-RU": "https://baupreis.ais152.com",
      },
    },
    metadataBase: new URL("https://baupreis.ais152.com"),
  };
}

function Shell({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: Locale;
}) {
  return (
    <html lang={locale} className="notranslate" translate="no">
      <head>
        <meta name="google" content="notranslate" />
        {/* Consent Mode v2 defaults (must load BEFORE GTM) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('consent','default',{'analytics_storage':'denied','ad_storage':'denied','ad_user_data':'denied','ad_personalization':'denied','wait_for_update':500});`,
          }}
        />
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`,
          }}
        />
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="apple-mobile-web-app-title" content="BauPreis" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className={inter.className}>
        {/* GTM noscript fallback */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "SoftwareApplication",
                  name: "BauPreis AI",
                  applicationCategory: "BusinessApplication",
                  operatingSystem: "Web",
                  description:
                    "AI-gestützte Preisprognosen für Baumaterialien in Deutschland. Echtzeit-Monitoring von Stahl, Kupfer, Holz und mehr.",
                  url: "https://baupreis.ais152.com",
                  offers: [
                    {
                      "@type": "Offer",
                      name: "Basis",
                      price: "49.00",
                      priceCurrency: "EUR",
                      priceSpecification: {
                        "@type": "UnitPriceSpecification",
                        price: "49.00",
                        priceCurrency: "EUR",
                        billingDuration: "P1M",
                      },
                      description:
                        "5 Materialien, 1 Nutzer, 3 Alarme, E-Mail-Benachrichtigungen",
                    },
                    {
                      "@type": "Offer",
                      name: "Pro",
                      price: "149.00",
                      priceCurrency: "EUR",
                      priceSpecification: {
                        "@type": "UnitPriceSpecification",
                        price: "149.00",
                        priceCurrency: "EUR",
                        billingDuration: "P1M",
                      },
                      description:
                        "Alle Materialien, KI-Prognosen, Telegram-Alarme, unbegrenzte Alarme",
                    },
                    {
                      "@type": "Offer",
                      name: "Team",
                      price: "299.00",
                      priceCurrency: "EUR",
                      priceSpecification: {
                        "@type": "UnitPriceSpecification",
                        price: "299.00",
                        priceCurrency: "EUR",
                        billingDuration: "P1M",
                      },
                      description:
                        "5 Nutzer, API-Zugang, PDF-Berichte, alle Pro-Features",
                    },
                  ],
                },
                {
                  "@type": "Organization",
                  name: "BauPreis AI",
                  url: "https://baupreis.ais152.com",
                  logo: "https://baupreis.ais152.com/icon-512.png",
                },
                {
                  "@type": "WebSite",
                  name: "BauPreis AI",
                  url: "https://baupreis.ais152.com",
                  potentialAction: {
                    "@type": "SearchAction",
                    target: {
                      "@type": "EntryPoint",
                      urlTemplate:
                        "https://baupreis.ais152.com/dashboard/materials?q={search_term_string}",
                    },
                    "query-input": "required name=search_term_string",
                  },
                },
                {
                  "@type": "FAQPage",
                  mainEntity: [
                    {
                      "@type": "Question",
                      name: "Woher kommen die Preisdaten?",
                      acceptedAnswer: {
                        "@type": "Answer",
                        text: "Wir beziehen unsere Daten von offiziellen Quellen: LME (London Metal Exchange) über Metals.Dev API, Destatis (Statistisches Bundesamt) und direkte Marktdaten.",
                      },
                    },
                    {
                      "@type": "Question",
                      name: "Wie genau sind die KI-Prognosen?",
                      acceptedAnswer: {
                        "@type": "Answer",
                        text: "Unsere KI analysiert historische Daten, Markttrends und externe Faktoren. Jede Prognose enthält einen Konfidenzwert (0–100%), damit Sie die Zuverlässigkeit einschätzen können.",
                      },
                    },
                    {
                      "@type": "Question",
                      name: "Kann ich den Plan jederzeit wechseln?",
                      acceptedAnswer: {
                        "@type": "Answer",
                        text: "Ja, Sie können jederzeit upgraden oder downgraden. Bei Upgrades wird der Restbetrag angerechnet.",
                      },
                    },
                    {
                      "@type": "Question",
                      name: "Wie funktionieren die Telegram-Alarme?",
                      acceptedAnswer: {
                        "@type": "Answer",
                        text: "Verbinden Sie Ihren Telegram-Account in den Einstellungen. Danach erhalten Sie Preisalarme direkt als Telegram-Nachricht.",
                      },
                    },
                    {
                      "@type": "Question",
                      name: "Ist mein Unternehmen DSGVO-konform geschützt?",
                      acceptedAnswer: {
                        "@type": "Answer",
                        text: "Ja. Alle Daten werden auf Hetzner-Servern in Nürnberg (Deutschland) gespeichert. Wir verarbeiten nur die nötigsten Daten.",
                      },
                    },
                    {
                      "@type": "Question",
                      name: "Welche Materialien werden überwacht?",
                      acceptedAnswer: {
                        "@type": "Answer",
                        text: "Aktuell 16 Materialien: Stahl (Bewehrungsstahl, Träger), Kupfer, Aluminium, Zink, Nickel, Beton, Zement, Holz (KVH, BSH, OSB), Dämmstoffe (EPS, XPS, Mineralwolle), Diesel und Industriestrom.",
                      },
                    },
                  ],
                },
              ],
            }),
          }}
        />

        <LocaleProvider initialLocale={locale}>
          {children}
          <CookieConsent />
          <ServiceWorkerRegister />
        </LocaleProvider>
      </body>
    </html>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const locale = (cookieStore.get("locale")?.value || "de") as Locale;

  return <Shell locale={locale}>{children}</Shell>;
}
