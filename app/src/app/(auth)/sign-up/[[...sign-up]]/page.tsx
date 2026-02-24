"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ClerkSignUp from "@/components/auth/ClerkSignUp";

function LocalSignUp() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, company }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registrierung fehlgeschlagen.");
        setLoading(false);
        return;
      }

      router.push(data.redirect || "/onboarding");
    } catch {
      setError("Netzwerkfehler. Bitte versuchen Sie es erneut.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold text-brand-600">
            BauPreis AI
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-6">
            Kostenlos registrieren
          </h1>
          <p className="text-gray-500 mt-2">
            7 Tage kostenlos testen. Keine Kreditkarte erforderlich.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border shadow-sm p-8 space-y-5"
        >
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              E-Mail-Adresse *
            </label>
            <input
              id="email"
              type="email"
              required
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@firma.de"
              className="w-full border rounded-lg px-4 py-3 text-base focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Ihr Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Max Mustermann"
              className="w-full border rounded-lg px-4 py-3 text-base focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="company"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Firmenname
            </label>
            <input
              id="company"
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Musterbau GmbH"
              className="w-full border rounded-lg px-4 py-3 text-base focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-600 text-white py-3 rounded-lg text-base font-semibold hover:bg-brand-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Wird erstellt..." : "Kostenlos starten"}
          </button>

          <p className="text-center text-sm text-gray-500">
            Bereits registriert?{" "}
            <Link
              href="/sign-in"
              className="text-brand-600 font-medium hover:underline"
            >
              Anmelden
            </Link>
          </p>
        </form>

        <p className="text-center text-xs text-gray-400 mt-6">
          Mit der Registrierung akzeptieren Sie unsere{" "}
          <Link href="/agb" className="underline">
            AGB
          </Link>{" "}
          und{" "}
          <Link href="/datenschutz" className="underline">
            Datenschutzerklärung
          </Link>
          .
        </p>
      </div>
    </div>
  );
}

export default function SignUpPage() {
  const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || "";
  const hasValidClerkKey =
    clerkKey.startsWith("pk_live_") || clerkKey.startsWith("pk_test_");
  if (!hasValidClerkKey) {
    return <LocalSignUp />;
  }
  return <ClerkSignUp />;
}
