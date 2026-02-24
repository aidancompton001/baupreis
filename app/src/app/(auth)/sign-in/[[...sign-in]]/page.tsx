"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import ClerkSignIn from "@/components/auth/ClerkSignIn";

function LocalSignIn() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Anmeldung fehlgeschlagen.");
        setLoading(false);
        return;
      }

      router.push(redirect);
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
          <h1 className="text-2xl font-bold text-gray-900 mt-6">Anmelden</h1>
          <p className="text-gray-500 mt-2">
            Willkommen zurück bei BauPreis AI
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
              E-Mail-Adresse
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
            {loading ? "Wird angemeldet..." : "Anmelden"}
          </button>

          <p className="text-center text-sm text-gray-500">
            Noch kein Konto?{" "}
            <Link
              href="/sign-up"
              className="text-brand-600 font-medium hover:underline"
            >
              Kostenlos registrieren
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default function SignInPage() {
  const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || "";
  const hasValidClerkKey =
    clerkKey.startsWith("pk_live_") || clerkKey.startsWith("pk_test_");
  if (!hasValidClerkKey) {
    return (
      <Suspense>
        <LocalSignIn />
      </Suspense>
    );
  }
  return <ClerkSignIn />;
}
