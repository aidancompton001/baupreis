"use client";

import { SignIn, ClerkLoaded, ClerkLoading } from "@clerk/nextjs";

export default function ClerkSignIn() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <ClerkLoading>
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Wird geladen...</p>
        </div>
      </ClerkLoading>
      <ClerkLoaded>
        <SignIn forceRedirectUrl="/dashboard" />
      </ClerkLoaded>
    </div>
  );
}
