export interface ConsentData {
  analytics: boolean;
  timestamp: string;
  version: string;
}

export const CONSENT_COOKIE_NAME = "cookie_consent";
export const CONSENT_VERSION = "1.0";
export const GA_MEASUREMENT_ID = "G-QWRZR920QR";

/** Read consent from cookie */
export function readConsent(): ConsentData | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(/(?:^|;\s*)cookie_consent=([^;]*)/);
  if (!m) return null;
  try {
    return JSON.parse(decodeURIComponent(m[1]));
  } catch {
    return null;
  }
}

/** Write consent to cookie (13 months) + localStorage */
export function writeConsent(data: ConsentData): void {
  const encoded = encodeURIComponent(JSON.stringify(data));
  document.cookie = `${CONSENT_COOKIE_NAME}=${encoded};path=/;max-age=34214400;SameSite=Lax`;
  try {
    localStorage.setItem(CONSENT_COOKIE_NAME, JSON.stringify(data));
  } catch {}
}

/** Remove GA cookies when consent is revoked */
export function removeGaCookies(): void {
  const hostname = window.location.hostname;
  const domains = [hostname, "." + hostname];
  const gaId = GA_MEASUREMENT_ID.replace("G-", "");
  const cookieNames = ["_ga", `_ga_${gaId}`];
  for (const name of cookieNames) {
    for (const domain of domains) {
      document.cookie = `${name}=;path=/;domain=${domain};expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    }
    document.cookie = `${name}=;path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  }
}
