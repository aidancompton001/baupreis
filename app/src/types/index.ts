/**
 * Shared TypeScript interfaces for BauPreis AI SaaS.
 */

/** Organization row from the `organizations` table. */
export interface Organization {
  id: number;
  name: string;
  slug: string;
  plan: "trial" | "basis" | "pro" | "team" | "suspended" | "cancelled";
  trial_ends_at: string | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  stripe_price_id: string | null;
  stripe_status: string | null;
  max_materials: number;
  max_users: number;
  max_alerts: number;
  features_telegram: boolean;
  features_forecast: boolean;
  features_api: boolean;
  features_pdf_reports: boolean;
  telegram_chat_id: string | null;
  whatsapp_phone: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/** User row from the `users` table. */
export interface User {
  id: number;
  org_id: number;
  clerk_user_id: string;
  email: string;
  name: string;
  role: "owner" | "admin" | "member";
  is_active: boolean;
  created_at: string;
  org_name?: string;
}

/** Analysis row returned by /api/analysis. */
export interface AnalysisRow {
  code: string;
  name_de: string;
  unit: string;
  trend: string;
  change_pct_7d: number;
  change_pct_30d: number;
  explanation_de: string;
  explanation_en?: string;
  explanation_ru?: string;
  recommendation: string;
  forecast_json: Record<string, number> | null;
  confidence: number;
  [key: string]: unknown;
}

/** Alert rule row from the `alert_rules` table. */
export interface AlertRule {
  id: string;
  rule_type: string;
  material_id: string | null;
  name_de: string | null;
  threshold_pct: number | null;
  channel: string;
  time_window: string;
  priority: string;
  is_active: boolean;
}

/** Sent alert row from the `alerts_sent` table. */
export interface AlertSent {
  id: string;
  code: string;
  name_de: string | null;
  message_text: string;
  channel: string;
  sent_at: string;
}

/** Material reference used in alert creation form. */
export interface MaterialOption {
  id: string;
  code: string;
  name_de: string;
}

/** In-app notification row from the `notifications` table. */
export interface Notification {
  id: string;
  org_id: string;
  type: "price_alert" | "system_update" | "price_change";
  title: string;
  message: string;
  link: string | null;
  read_at: string | null;
  created_at: string;
}

/** Report row from the `reports` table. */
export interface Report {
  id: string;
  report_type: "daily" | "weekly" | "monthly";
  period_start: string;
  period_end: string;
  content_html?: string;
  content_json?: {
    period?: { start: string; end: string };
    materials?: ReportMaterial[];
  };
}

/** Material entry inside a report's content_json. */
export interface ReportMaterial {
  name_de?: string;
  name?: string;
  price_eur?: string;
  change_pct_7d?: string | null;
  trend?: string;
}

/** AI analysis response for alloy calculator. */
export interface AlloyAiAnalysis {
  hasAnalysis: boolean;
  trend: "rising" | "falling" | "stable";
  change7d: number;
  change30d: number;
  confidence: number;
  insight?: { de: string; en: string; ru: string };
  elementTrends?: AlloyElementTrend[];
}

/** Element trend entry inside alloy AI analysis. */
export interface AlloyElementTrend {
  element: string;
  change7d: number;
}

/** History data point from /api/alloy-calculator/history. */
export interface AlloyHistoryDataPoint {
  date: string;
  price: number;
}

/** Declare the global cookie settings function on window. */
declare global {
  interface Window {
    __openCookieSettings?: () => void;
    Clerk?: ClerkInstance;
  }
}

/** Minimal Clerk instance type for window.Clerk access. */
export interface ClerkInstance {
  user?: {
    twoFactorEnabled?: boolean;
    totpEnabled?: boolean;
  };
  session?: { id: string };
  client?: {
    activeSessions?: ClerkSession[];
  };
  signOut: () => Promise<void>;
  openUserProfile?: () => void;
}

/** Clerk session object shape. */
export interface ClerkSession {
  id: string;
  lastActiveAt?: string;
  latestActivity?: {
    browserName?: string;
    deviceType?: string;
    isMobile?: boolean;
  };
}

// ─── API Route Helpers ───────────────────────────────────────────

/** SQL query parameter type (for dynamic parameterized queries). */
export type SqlParam = string | number | boolean | null;

/** Extended user profile fields (from account/profile). */
export interface UserProfile extends User {
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  position_title: string | null;
}

/** Extended org fields (from account/profile). */
export interface OrganizationProfile extends Organization {
  vat_id: string | null;
  billing_street: string | null;
  billing_city: string | null;
  billing_zip: string | null;
  billing_country: string | null;
}

/** Price row from the `prices` table (with joined material fields). */
export interface PriceRow {
  material_id: string;
  code: string;
  name_de: string;
  unit: string;
  price_eur: string;
  price_usd?: string;
  source: string;
  timestamp: string;
  category?: string;
}

/** Helper to extract error message from unknown catch values. */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

/** Helper to check if unknown error matches known auth error messages. */
export function isAuthError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  return [
    "No organization found",
    "Trial expired",
    "Subscription cancelled",
  ].includes(error.message);
}

/** Helper to check if error is a Postgres unique constraint violation. */
export function isUniqueViolation(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code: string }).code === "23505"
  );
}

/** Clerk webhook event payload (from Svix). */
export interface ClerkWebhookEvent {
  type: string;
  data: {
    id: string;
    email_addresses: Array<{ email_address: string }>;
    first_name?: string;
    last_name?: string;
  };
}

/** Stripe checkout session subset used in webhooks. */
export interface StripeCheckoutSession {
  metadata?: Record<string, string>;
  subscription: string;
  customer: string;
}

/** Stripe subscription subset used in webhooks. */
export interface StripeSubscription {
  id: string;
  status: string;
  items?: {
    data?: Array<{ price?: { id: string } }>;
  };
}

/** Stripe invoice subset used in webhooks. */
export interface StripeInvoice {
  subscription: string | null;
}
