"use client";

import { usePathname } from "next/navigation";

const BREADCRUMB_NAMES: Record<string, Record<string, string>> = {
  "/preise": { de: "Preise", en: "Pricing", ru: "Тарифы" },
  "/ueber-uns": { de: "Über uns", en: "About Us", ru: "О нас" },
  "/kontakt": { de: "Kontakt", en: "Contact", ru: "Контакты" },
  "/blog": { de: "Blog", en: "Blog", ru: "Блог" },
  "/impressum": { de: "Impressum", en: "Legal Notice", ru: "Импрессум" },
  "/agb": { de: "AGB", en: "Terms", ru: "Условия" },
  "/datenschutz": { de: "Datenschutz", en: "Privacy", ru: "Конфиденциальность" },
};

export default function BreadcrumbSchema() {
  const pathname = usePathname();
  const entry = BREADCRUMB_NAMES[pathname];
  if (!entry) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://baupreis.ais152.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: entry.de,
        item: `https://baupreis.ais152.com${pathname}`,
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
