import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import { LocaleProvider } from "@/i18n/LocaleContext";
import { getTranslations, type Locale, LOCALE_DATE_MAP } from "@/i18n";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import ClerkProviderWrapper from "@/components/auth/ClerkProviderWrapper";
import "./globals.css";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

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
    title: dict["meta.title"],
    description: dict["meta.description"],
    openGraph: {
      title: dict["meta.ogTitle"],
      description: dict["meta.ogDescription"],
      url: "https://baupreis.ai",
      siteName: "BauPreis AI",
      locale: OG_LOCALE_MAP[locale],
      type: "website",
    },
    metadataBase: new URL("https://baupreis.ai"),
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
        <LocaleProvider initialLocale={locale}>{children}</LocaleProvider>
        <ServiceWorkerRegister />
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

  // Skip ClerkProvider if keys are not configured (placeholder or missing)
  const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || "";
  const hasValidClerkKey = clerkKey.startsWith("pk_live_") || clerkKey.startsWith("pk_test_");
  if (!hasValidClerkKey) {
    return <Shell locale={locale}>{children}</Shell>;
  }

  // Production: wrap in ClerkProvider
  return (
    <ClerkProviderWrapper>
      <Shell locale={locale}>{children}</Shell>
    </ClerkProviderWrapper>
  );
}
