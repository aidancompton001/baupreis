"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import ClerkSignUp from "@/components/auth/ClerkSignUp";

function DevSignUp() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/dashboard");
  }, [router]);
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <p className="text-gray-500">Dev-Modus — Weiterleitung zum Dashboard...</p>
    </div>
  );
}

export default function SignUpPage() {
  const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || "";
  const hasValidClerkKey = clerkKey.startsWith("pk_live_") || clerkKey.startsWith("pk_test_");
  if (!hasValidClerkKey) {
    return <DevSignUp />;
  }
  return <ClerkSignUp />;
}
