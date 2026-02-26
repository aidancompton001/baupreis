import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        <div className="text-8xl font-bold text-gray-200 mb-4">404</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Seite nicht gefunden
        </h1>
        <p className="text-gray-600 mb-6">
          Die angeforderte Seite existiert nicht oder wurde verschoben.
        </p>
        <Link
          href="/"
          className="bg-brand-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-brand-700 transition inline-block"
        >
          Zur Startseite
        </Link>
      </div>
    </div>
  );
}
