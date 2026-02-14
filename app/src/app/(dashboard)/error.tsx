"use client";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center h-64 gap-4">
      <h2 className="text-xl font-semibold text-gray-900">
        Etwas ist schiefgelaufen
      </h2>
      <p className="text-gray-500">
        Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es erneut.
      </p>
      <button
        onClick={reset}
        className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition"
      >
        Erneut versuchen
      </button>
    </div>
  );
}
