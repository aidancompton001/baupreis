"use client";

import { useState, useEffect } from "react";
import { SignUp } from "@clerk/nextjs";
import Link from "next/link";

export default function ClerkSignUp() {
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowFallback(true), 8000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <Link href="/" className="text-2xl font-bold text-brand-600">
            BauPreis AI
          </Link>
        </div>

        <SignUp
          forceRedirectUrl="/onboarding"
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "shadow-lg rounded-2xl border border-gray-200",
            },
          }}
        />

        {showFallback && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500 mb-3">
              Registrierung lädt langsam?
            </p>
            <a
              href="mailto:pashchenkoh@gmail.com"
              className="text-sm text-brand-600 hover:underline font-medium"
            >
              Kontaktieren Sie uns →
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
