'use client';

export default function AuthError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
      <h2 className="text-xl font-semibold">Etwas ist schiefgelaufen</h2>
      <p className="text-muted-foreground">
        {error.message || 'Ein unerwarteter Fehler ist aufgetreten.'}
      </p>
      <button
        onClick={reset}
        className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
      >
        Erneut versuchen
      </button>
    </div>
  );
}
