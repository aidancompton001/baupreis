"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-4">
      <h1 className="text-2xl font-bold text-gray-900">
        Etwas ist schiefgelaufen
      </h1>
      <p className="text-gray-500 text-center max-w-md">
        Ein unerwarteter Fehler ist aufgetreten. Bitte laden Sie die Seite neu
        oder versuchen Sie es später erneut.
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
