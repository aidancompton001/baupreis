import type { Metadata } from "next";
import DashboardSubNav from "@/components/layout/DashboardSubNav";
import TrialBanner from "@/components/dashboard/TrialBanner";
import WelcomeTour from "@/components/dashboard/WelcomeTour";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

/* Header is now UnifiedHeader in root layout. Sidebar REMOVED → DashboardSubNav (horizontal tabs). */

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 pt-14">
      <DashboardSubNav />
      <main className="max-w-[1400px] mx-auto p-6">
        <TrialBanner />
        <WelcomeTour />
        {children}
      </main>
    </div>
  );
}
