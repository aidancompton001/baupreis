"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Unhandled error:", error.message, error.digest);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-4 bg-gray-50">
      <div className="text-6xl mb-2">&#9888;</div>
      <h1 className="text-2xl font-bold text-gray-900">
        Etwas ist schiefgelaufen
      </h1>
      <p className="text-gray-500 text-center max-w-md">
        Ein unerwarteter Fehler ist aufgetreten. Bitte laden Sie die Seite neu
        oder versuchen Sie es später erneut.
      </p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition"
        >
          Erneut versuchen
        </button>
        <Link
          href="/dashboard"
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
        >
          Zum Dashboard
        </Link>
      </div>
    </div>
  );
}
