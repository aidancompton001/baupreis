import type { Metadata } from "next";
import ChangelogClient from "./ChangelogClient";

export const metadata: Metadata = {
  title: "Neuigkeiten & Updates",
  description: "Alle Änderungen, neue Features und Verbesserungen der BauPreis AI Plattform — chronologisch dokumentiert.",
};

export default function ChangelogPage() {
  return <ChangelogClient />;
}
