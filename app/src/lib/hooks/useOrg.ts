"use client";

import { useEffect, useState } from "react";

export interface OrgData {
  id: string;
  name: string;
  plan: string;
  max_materials: number;
  max_users: number;
  max_alerts: number;
  features_telegram: boolean;
  features_forecast: boolean;
  features_api: boolean;
  features_pdf_reports: boolean;
  telegram_chat_id: string | null;
  whatsapp_phone: string | null;
  stripe_subscription_id: string | null;
  stripe_customer_id: string | null;
  stripe_status: string | null;
  trial_ends_at: string | null;
  is_active: boolean;
  created_at: string;
}

export function useOrg() {
  const [org, setOrg] = useState<OrgData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/org")
      .then((r) => {
        if (!r.ok) throw new Error("Fehler beim Laden");
        return r.json();
      })
      .then((data) => setOrg(data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return { org, loading, error };
}
