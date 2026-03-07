"use client";

import { ClerkProvider } from "@clerk/nextjs";

export default function ClerkProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      signInForceRedirectUrl="/dashboard"
      signUpForceRedirectUrl="/onboarding"
      afterSignOutUrl="/"
    >
      {children}
    </ClerkProvider>
  );
}
