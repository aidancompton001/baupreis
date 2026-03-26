"use client";

import { useEffect } from "react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard Error:", error.message, error.stack);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center h-64 gap-4">
      <h2 className="text-xl font-semibold text-gray-900">
        Etwas ist schiefgelaufen
      </h2>
      <p className="text-gray-500">
        Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es erneut.
      </p>
      {/* DEBUG: show actual error */}
      <pre className="text-xs text-brand-600 bg-brand-50 p-4 max-w-xl overflow-auto border-2 border-brand-600">
        {error.message}
      </pre>
      <button
        onClick={reset}
        className="px-4 py-2 bg-brand-600 text-white rounded-none hover:bg-brand-700 transition"
      >
        Erneut versuchen
      </button>
    </div>
  );
}
