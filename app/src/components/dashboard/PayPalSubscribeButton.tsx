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
          const res = await fetch(
            `/api/paypal/plans?plan=${planName}&period=${billingPeriod}`
          );
          const { planId, error } = await res.json();
          if (error || !planId) {
            throw new Error(error || "Plan ID nicht gefunden");
          }

          return actions.subscription.create({
            plan_id: planId,
            custom_id: orgId,
          });
        }}
        onApprove={async (data) => {
          setActivating(true);
          try {
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
            onError(err.message || "Aktivierung fehlgeschlagen");
          } finally {
            setActivating(false);
          }
        }}
        onError={(err) => {
          onError(String(err));
        }}
        onCancel={() => {
          // User closed popup without completing
        }}
      />
    </PayPalScriptProvider>
  );
}
