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
      <header className="fixed top-0 w-full bg-white border-b border-gray-100 z-50 h-16">
        <div className="h-full px-4 flex items-center justify-between">
          <Link href="/dashboard" className="text-xl font-extrabold font-grotesk text-brand-600">
            BauPreis AI
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
