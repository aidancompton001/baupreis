"use client";

import Script from "next/script";
import { useState, useEffect } from "react";
import { readConsent, GA_MEASUREMENT_ID } from "@/lib/consent";

export default function GoogleAnalytics() {
  const [granted, setGranted] = useState(false);

  useEffect(() => {
    const consent = readConsent();
    if (consent?.analytics) setGranted(true);

    function onUpdate(e: Event) {
      const detail = (e as CustomEvent<{ analytics: boolean }>).detail;
      setGranted(detail.analytics);
    }

    window.addEventListener("consent-update", onUpdate);
    return () => window.removeEventListener("consent-update", onUpdate);
  }, []);

  if (!granted) return null;

  return (
    <Script
      src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      strategy="afterInteractive"
    />
  );
}
