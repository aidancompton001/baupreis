"use client";

import { useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

interface PayPalSubscribeButtonProps {
  planName: string;
  billingPeriod: string;
  orgId: string;
  onSuccess: (subscriptionId: string, plan: string) => void;
  onError: (error: string) => void;
}

/**
 * Parse PayPal error into a user-friendly German message.
 */
function parsePayPalError(err: unknown): string {
  const raw = String(err);
  console.error("[PayPal] Error details:", err);

  // PayPal popup/window errors
  if (raw.includes("preapproved")) {
    return "PayPal konnte keine wiederkehrende Zahlung einrichten. Bitte prüfen Sie: (1) Ihr PayPal-Konto ist verifiziert, (2) eine Zahlungsquelle (Bankkonto oder Kreditkarte) ist hinterlegt, (3) wiederkehrende Zahlungen sind in Ihren PayPal-Einstellungen aktiviert.";
  }
  if (raw.includes("INSTRUMENT_DECLINED") || raw.includes("instrument_declined")) {
    return "Ihre Zahlungsmethode wurde abgelehnt. Bitte verwenden Sie eine andere Karte oder ein anderes Bankkonto.";
  }
  if (raw.includes("popup") || raw.includes("window")) {
    return "Das PayPal-Fenster wurde blockiert. Bitte erlauben Sie Pop-ups für diese Seite und versuchen Sie es erneut.";
  }
  if (raw.includes("PLAN_NOT_ACTIVE") || raw.includes("not active")) {
    return "Der gewählte Tarif ist momentan nicht verfügbar. Bitte versuchen Sie es später erneut.";
  }

  return `Zahlung fehlgeschlagen. Bitte versuchen Sie es erneut oder kontaktieren Sie den Support. (${raw.slice(0, 120)})`;
}

export default function PayPalSubscribeButton({
  planName,
  billingPeriod,
  orgId,
  onSuccess,
  onError,
}: PayPalSubscribeButtonProps) {
  const [activating, setActivating] = useState(false);

  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  if (!clientId) {
    return (
      <p className="text-red-500 text-sm text-center py-2">
        PayPal nicht konfiguriert
      </p>
    );
  }

  return (
    <PayPalScriptProvider
      options={{
        clientId,
        vault: true,
        intent: "subscription",
        locale: "de_DE",
      }}
    >
      {activating && (
        <div className="text-center py-2 text-sm text-gray-500">
          Abonnement wird aktiviert...
        </div>
      )}
      <PayPalButtons
        style={{
          shape: "rect",
          color: "blue",
          layout: "vertical",
          label: "subscribe",
        }}
        createSubscription={async (_data, actions) => {
          try {
            const res = await fetch(
              `/api/paypal/plans?plan=${planName}&period=${billingPeriod}`
            );
            const { planId, error } = await res.json();
            if (error || !planId) {
              throw new Error(error || "Plan ID nicht gefunden");
            }

            console.log("[PayPal] Creating subscription with plan:", planId, "org:", orgId);
            return actions.subscription.create({
              plan_id: planId,
              custom_id: orgId,
            });
          } catch (err) {
            console.error("[PayPal] createSubscription error:", err);
            throw err;
          }
        }}
        onApprove={async (data) => {
          setActivating(true);
          try {
            console.log("[PayPal] Subscription approved:", data.subscriptionID);
            const res = await fetch("/api/paypal/activate", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                subscriptionId: data.subscriptionID,
              }),
            });
            const result = await res.json();
            if (result.success) {
              onSuccess(data.subscriptionID!, result.plan);
            } else {
              onError(result.error || "Aktivierung fehlgeschlagen");
            }
          } catch (err: any) {
            console.error("[PayPal] activate error:", err);
            onError(err.message || "Aktivierung fehlgeschlagen");
          } finally {
            setActivating(false);
          }
        }}
        onError={(err) => {
          onError(parsePayPalError(err));
        }}
        onCancel={() => {
          // User closed popup without completing
        }}
      />
    </PayPalScriptProvider>
  );
}
