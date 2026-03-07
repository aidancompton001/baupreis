"use client";

import { useState, useEffect } from "react";
import { SignIn } from "@clerk/nextjs";
import Link from "next/link";

export default function ClerkSignIn() {
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    // If Clerk doesn't render within 8s, show fallback
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

        {/* Clerk SignIn renders its own loading state internally */}
        <SignIn
          forceRedirectUrl="/dashboard"
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
              Anmeldung lädt langsam?
            </p>
            <button
              onClick={() => window.location.href = "/dashboard"}
              className="text-sm text-brand-600 hover:underline font-medium"
            >
              Direkt zum Dashboard →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
