import type { Metadata } from "next";
import Link from "next/link";
import DashboardNav from "@/components/layout/DashboardNav";
import TrialBanner from "@/components/dashboard/TrialBanner";
import LanguageSwitcher from "@/i18n/LanguageSwitcher";
import LogoutButton from "@/components/auth/LogoutButton";
import WelcomeTour from "@/components/dashboard/WelcomeTour";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <header className="fixed top-0 w-full bg-white border-b-[3px] border-brand-600 z-50 h-16">
        <div className="h-full px-4 flex items-center justify-between">
          <Link href="/dashboard" className="font-grotesk text-xl font-bold text-gray-900 flex items-center gap-2.5">
            <svg width="28" height="28" viewBox="0 0 64 64" fill="none"><rect x="2" y="2" width="28" height="28" rx="3" fill="#C1292E"/><rect x="34" y="2" width="28" height="28" rx="3" fill="#C1292E"/><rect x="2" y="34" width="28" height="28" rx="3" fill="#C1292E"/><rect x="14" y="14" width="16" height="16" rx="2" fill="white"/><rect x="38" y="6" width="10" height="10" rx="1" fill="white"/><polyline points="10,48 22,40 32,52" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
            Bau<span className="text-brand-600">Preis</span> AI
          </Link>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <LogoutButton />
          </div>
        </div>
      </header>

      <div className="pt-16 flex">
        <DashboardNav />

        {/* Main Content */}
        <main className="flex-1 md:ml-64 p-6 pb-24 md:pb-6">
          <TrialBanner />
          <WelcomeTour />
          {children}
        </main>
      </div>
    </div>
  );
}
