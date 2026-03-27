export interface ChangelogEntry {
  date: string;
  type: "feature" | "improvement" | "fix" | "design";
  titleDe: string;
  titleEn: string;
  descriptionDe: string;
  descriptionEn: string;
}

export const changelogEntries: ChangelogEntry[] = [
  {
    date: "2026-03-27",
    type: "fix",
    titleDe: "Preisänderungen in Materialien korrigiert",
    titleEn: "Price Changes in Materials Fixed",
    descriptionDe: "Serverseitige Berechnung der Preisänderungen (7-Tage, 30-Tage) für alle 16 Materialien korrigiert. Deterministische Berechnung statt clientseitiger Schätzung — zuverlässigere Daten im Dashboard.",
    descriptionEn: "Server-side calculation of price changes (7-day, 30-day) for all 16 materials fixed. Deterministic calculation instead of client-side estimation — more reliable data in dashboard.",
  },
  {
    date: "2026-03-27",
    type: "feature",
    titleDe: "Changelog-Seite (Neuigkeiten)",
    titleEn: "Changelog Page (What's New)",
    descriptionDe: "Neue öffentliche Seite /changelog — chronologischer Überblick über alle Plattform-Updates, neue Features und Verbesserungen.",
    descriptionEn: "New public page /changelog — chronological overview of all platform updates, new features and improvements.",
  },
  {
    date: "2026-03-27",
    type: "feature",
    titleDe: "Infografiken auf der Startseite",
    titleEn: "Infographics on Landing Page",
    descriptionDe: "Drei professionelle Infografiken: Produkt-Pipeline, Marktanalyse Deutschland und Dashboard-Features — komprimiert und optimiert für schnelle Ladezeiten.",
    descriptionEn: "Three professional infographics: product pipeline, German market analysis and dashboard features — compressed and optimized for fast loading.",
  },
  {
    date: "2026-03-26",
    type: "design",
    titleDe: "Bauhaus Bold Redesign — Kompletter visueller Umbau",
    titleEn: "Bauhaus Bold Redesign — Complete Visual Overhaul",
    descriptionDe: "Neue Farbpalette (#C1292E, #1A1A1A, #F5C518, #BC8279, #FFFFFF), Oswald-Schrift für Überschriften, Space Grotesk für Labels, scharfe Kanten, schwarze Rahmen. 50+ Dateien aktualisiert.",
    descriptionEn: "New color palette (#C1292E, #1A1A1A, #F5C518, #BC8279, #FFFFFF), Oswald font for headings, Space Grotesk for labels, sharp edges, black borders. 50+ files updated.",
  },
  {
    date: "2026-03-26",
    type: "feature",
    titleDe: "Einheitliche Navigation — Website und Dashboard vereint",
    titleEn: "Unified Navigation — Website and Dashboard Merged",
    descriptionDe: "Ein schwarzer Header für die gesamte Plattform. Sidebar entfernt, horizontale Sub-Tabs für Dashboard. Nahtloser Wechsel zwischen Website und Dashboard.",
    descriptionEn: "One black header for the entire platform. Sidebar removed, horizontal sub-tabs for dashboard. Seamless switching between website and dashboard.",
  },
  {
    date: "2026-03-26",
    type: "design",
    titleDe: "Bauhaus Icon-System — 12 geometrische SVG-Icons",
    titleEn: "Bauhaus Icon System — 12 Geometric SVG Icons",
    descriptionDe: "Eigenes Visual-Language-System basierend auf der Brand Identity: geometrische, farbige Icons für Navigation, Dashboard und dekorative Elemente.",
    descriptionEn: "Custom visual language system based on brand identity: geometric, colored icons for navigation, dashboard and decorative elements.",
  },
  {
    date: "2026-03-26",
    type: "feature",
    titleDe: "Offizielle Bauhaus-Logos aus Luma Brand Identity",
    titleEn: "Official Bauhaus Logos from Luma Brand Identity",
    descriptionDe: "Horizontales Logo für Header, vertikales Logo für Auth-Seiten, Icon für PWA. Manifest aktualisiert mit neuen Markenfarben.",
    descriptionEn: "Horizontal logo for headers, vertical logo for auth pages, icon for PWA. Manifest updated with new brand colors.",
  },
  {
    date: "2026-03-26",
    type: "improvement",
    titleDe: "Dashboard — Schwarzer Header, rote Grafiken, gelbe KPI-Blöcke",
    titleEn: "Dashboard — Black Header, Red Charts, Yellow KPI Blocks",
    descriptionDe: "Dashboard-Header schwarz (#1A1A1A). Recharts: alle Farben auf Bauhaus-Palette umgestellt. Gelbe KPI-Blöcke wie im Mockup. Schriftarten: Oswald für Zahlen, Space Grotesk für Labels.",
    descriptionEn: "Dashboard header black (#1A1A1A). Recharts: all colors switched to Bauhaus palette. Yellow KPI blocks as in mockup. Fonts: Oswald for numbers, Space Grotesk for labels.",
  },
  {
    date: "2026-03-26",
    type: "design",
    titleDe: "Landing Page — Struktur wie Prototyp",
    titleEn: "Landing Page — Structure Matches Prototype",
    descriptionDe: "Hero mit 2 Spalten (Text links, Bauhaus-Komposition rechts). Headline: MATERIALPREISE. DIGITAL. 7 Feature-Sektionen entfernt — kompakte, wirkungsvolle Seite.",
    descriptionEn: "Hero with 2 columns (text left, Bauhaus composition right). Headline: MATERIALPREISE. DIGITAL. 7 feature sections removed — compact, impactful page.",
  },
  {
    date: "2026-03-18",
    type: "feature",
    titleDe: "SEO Phase 1+2 — Metadata, Schemas, 51 Tests",
    titleEn: "SEO Phase 1+2 — Metadata, Schemas, 51 Tests",
    descriptionDe: "OpenGraph- und Twitter-Meta-Tags, JSON-LD Structured Data (SoftwareApplication, FAQPage, Organization), 51 automatisierte SEO-Tests bestanden.",
    descriptionEn: "OpenGraph and Twitter meta tags, JSON-LD structured data (SoftwareApplication, FAQPage, Organization), 51 automated SEO tests passed.",
  },
  {
    date: "2026-03-15",
    type: "feature",
    titleDe: "UX Overhaul v4.0 — Kategorien, Tooltips, Tour",
    titleEn: "UX Overhaul v4.0 — Categories, Tooltips, Tour",
    descriptionDe: "Material-Kategorisierung (Stahl, Metall, Beton, Holz, Dämmstoffe, Energie), Hilfe-Tooltips, interaktive Willkommens-Tour für neue Benutzer.",
    descriptionEn: "Material categorization (steel, metal, concrete, wood, insulation, energy), help tooltips, interactive welcome tour for new users.",
  },
  {
    date: "2026-03-10",
    type: "feature",
    titleDe: "Google OAuth Anmeldung",
    titleEn: "Google OAuth Sign-In",
    descriptionDe: "Anmeldung mit Google-Konto — ein Klick, kein Passwort. Zusätzlich zur E-Mail-Authentifizierung.",
    descriptionEn: "Sign in with Google account — one click, no password. In addition to email authentication.",
  },
  {
    date: "2026-03-04",
    type: "feature",
    titleDe: "Legierungsrechner mit KI-Analyse",
    titleEn: "Alloy Calculator with AI Analysis",
    descriptionDe: "Berechnung von Legierungskosten basierend auf aktuellen Metallpreisen. KI-gestützte Analyse und Preisverlauf.",
    descriptionEn: "Alloy cost calculation based on current metal prices. AI-powered analysis and price history.",
  },
  {
    date: "2026-02-26",
    type: "feature",
    titleDe: "Plattform-Launch — 16 Materialien, 3.000+ Datenpunkte",
    titleEn: "Platform Launch — 16 Materials, 3,000+ Data Points",
    descriptionDe: "Erste öffentliche Version: Dashboard, KI-Prognosen, Preisalarme, Telegram-Integration, 3 Pläne (Basis €49, Pro €149, Team €299).",
    descriptionEn: "First public version: dashboard, AI forecasts, price alerts, Telegram integration, 3 plans (Basis €49, Pro €149, Team €299).",
  },
];
