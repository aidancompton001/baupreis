import Link from "next/link";
import DashboardNav from "@/components/layout/DashboardNav";
import TrialBanner from "@/components/dashboard/TrialBanner";
import LanguageSwitcher from "@/i18n/LanguageSwitcher";

function DevUserBadge() {
  return (
    <div className="w-8 h-8 rounded-full bg-brand-600 text-white flex items-center justify-center text-sm font-bold">
      D
    </div>
  );
}

function UserAvatar() {
  const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || "";
  const hasValidClerkKey = clerkKey.startsWith("pk_live_") || clerkKey.startsWith("pk_test_");
  if (!hasValidClerkKey) {
    return <DevUserBadge />;
  }
  const { UserButton } = require("@clerk/nextjs");
  return <UserButton afterSignOutUrl="/" />;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <header className="fixed top-0 w-full bg-white border-b z-50 h-16">
        <div className="h-full px-4 flex items-center justify-between">
          <Link href="/dashboard" className="text-xl font-bold text-brand-600">
            BauPreis AI
          </Link>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <UserAvatar />
          </div>
        </div>
      </header>

      <div className="pt-16 flex">
        <DashboardNav />

        {/* Main Content */}
        <main className="flex-1 md:ml-64 p-6 pb-24 md:pb-6">
          <TrialBanner />
          {children}
        </main>
      </div>
    </div>
  );
}
