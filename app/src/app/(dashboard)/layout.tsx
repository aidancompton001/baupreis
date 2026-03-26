import type { Metadata } from "next";
import { cookies } from "next/headers";
import DashboardSubNav from "@/components/layout/DashboardSubNav";
import TrialBanner from "@/components/dashboard/TrialBanner";
import WelcomeTour from "@/components/dashboard/WelcomeTour";
import GuestOverlay from "@/components/dashboard/GuestOverlay";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = cookies().get("baupreis_session")?.value;
  const isGuest = !session;

  return (
    <div className="min-h-screen bg-gray-50 pt-14">
      <DashboardSubNav />
      <main className="max-w-[1400px] mx-auto p-6">
        {!isGuest && <TrialBanner />}
        {!isGuest && <WelcomeTour />}
        {children}
      </main>
      {isGuest && <GuestOverlay />}
    </div>
  );
}
