/**
 * Bauhaus Visual Language Icon System
 * Based on Brand_Identity_CANCNYb6.png — VISUAL LANGUAGE section
 *
 * All icons: viewBox="0 0 24 24", fill-based (NOT stroke), STRICTLY 5 colors:
 * #C1292E (red), #1A1A1A (black), #F5C518 (yellow), #BC8279 (salmon), #FFFFFF (white)
 *
 * Registry:
 * BI-01: IconDashboard   — Red bars + black trend arrow (sidebar: Overview)
 * BI-02: IconForecasts   — Red gear with white center (sidebar: KI-Prognosen)
 * BI-03: IconChat         — Black speech bubble with white lines (sidebar: KI-Chat)
 * BI-04: IconEscalation   — Red ruler with black ticks + arrow (sidebar: Preisgleitklausel)
 * BI-05: IconAlloy        — Red + yellow triangles (sidebar: Legierungsrechner)
 * BI-06: IconAlerts       — Red bell (sidebar: Alarme)
 * BI-07: IconReports      — Black document with red accent (sidebar: Berichte)
 * BI-08: IconSettings     — Black gear (sidebar: Einstellungen)
 * BI-09: IconAccount      — Black geometric person (sidebar: Konto)
 * BI-10: IconCrane        — Red crane + yellow load (decorative)
 * BI-11: IconBuilding     — Red/black building (decorative)
 * BI-12: IconGear         — Large red gear (decorative)
 */

interface IconProps {
  size?: number;
  className?: string;
}

// BI-01: Dashboard — Red bars + black trend arrow up
export const IconDashboard = ({ size = 20, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="3" y="14" width="4" height="8" fill="#C1292E" />
    <rect x="10" y="9" width="4" height="13" fill="#C1292E" />
    <rect x="17" y="4" width="4" height="18" fill="#C1292E" />
    <path d="M2 11L8 7L14 9L22 3" stroke="#1A1A1A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <path d="M17 3H22V8" stroke="#1A1A1A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

// BI-02: Forecasts — Red gear with white center
export const IconForecasts = ({ size = 20, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 1L14.5 5L19 3.5L17 8L21.5 10L17 12L19 16.5L14.5 15L12 19L9.5 15L5 16.5L7 12L2.5 10L7 8L5 3.5L9.5 5Z" fill="#C1292E" />
    <circle cx="12" cy="10" r="3.5" fill="#FFFFFF" />
  </svg>
);

// BI-03: Chat — Black speech bubble with white text lines
export const IconChat = ({ size = 20, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M3 3H21V16H13L8 21V16H3V3Z" fill="#1A1A1A" />
    <rect x="7" y="7" width="10" height="2" fill="#FFFFFF" />
    <rect x="7" y="11" width="6" height="2" fill="#FFFFFF" />
  </svg>
);

// BI-04: Escalation — Red ruler with ticks + upward arrow
export const IconEscalation = ({ size = 20, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="3" y="2" width="5" height="20" fill="#C1292E" />
    <rect x="8" y="5" width="3" height="2" fill="#1A1A1A" />
    <rect x="8" y="9" width="5" height="2" fill="#1A1A1A" />
    <rect x="8" y="13" width="3" height="2" fill="#1A1A1A" />
    <rect x="8" y="17" width="5" height="2" fill="#1A1A1A" />
    <path d="M17 18V6" stroke="#C1292E" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M14 9L17 6L20 9" stroke="#C1292E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

// BI-05: Alloy — Red + yellow overlapping triangles
export const IconAlloy = ({ size = 20, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <polygon points="3,21 12,3 21,21" fill="#C1292E" />
    <polygon points="9,21 14,11 19,21" fill="#F5C518" />
  </svg>
);

// BI-06: Alerts — Red geometric bell
export const IconAlerts = ({ size = 20, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M5 17L5 10C5 6.13 8.13 3 12 3C15.87 3 19 6.13 19 10V17L21 19H3L5 17Z" fill="#C1292E" />
    <rect x="9" y="19" width="6" height="3" fill="#1A1A1A" />
  </svg>
);

// BI-07: Reports — Black document with lines + red accent
export const IconReports = ({ size = 20, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="4" y="2" width="16" height="20" fill="#1A1A1A" />
    <rect x="7" y="6" width="10" height="2" fill="#FFFFFF" />
    <rect x="7" y="10" width="8" height="2" fill="#FFFFFF" />
    <rect x="7" y="14" width="10" height="2" fill="#C1292E" />
    <rect x="7" y="18" width="5" height="1.5" fill="#FFFFFF" />
  </svg>
);

// BI-08: Settings — Black gear
export const IconSettings = ({ size = 20, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 1L14.5 5L19 3.5L17 8L21.5 10L17 12L19 16.5L14.5 15L12 19L9.5 15L5 16.5L7 12L2.5 10L7 8L5 3.5L9.5 5Z" fill="#1A1A1A" />
    <circle cx="12" cy="10" r="3.5" fill="#FFFFFF" />
  </svg>
);

// BI-09: Account — Black geometric person (square head + trapezoid body)
export const IconAccount = ({ size = 20, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="8" y="2" width="8" height="8" fill="#1A1A1A" />
    <path d="M4 22L7 12H17L20 22H4Z" fill="#1A1A1A" />
  </svg>
);

// BI-10: Crane (decorative) — Red crane with yellow load
export const IconCrane = ({ size = 20, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="6" y="6" width="3" height="16" fill="#C1292E" />
    <rect x="4" y="6" width="14" height="3" fill="#C1292E" />
    <path d="M9 6L9 3L5 6" stroke="#C1292E" strokeWidth="2" strokeLinecap="round" fill="none" />
    <rect x="14" y="9" width="5" height="7" fill="#F5C518" />
    <line x1="16.5" y1="9" x2="16.5" y2="6" stroke="#1A1A1A" strokeWidth="1.5" />
  </svg>
);

// BI-11: Building (decorative) — Red/black geometric building
export const IconBuilding = ({ size = 20, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="2" y="6" width="12" height="16" fill="#C1292E" />
    <rect x="14" y="10" width="8" height="12" fill="#1A1A1A" />
    <rect x="4" y="8" width="3" height="3" fill="#FFFFFF" />
    <rect x="9" y="8" width="3" height="3" fill="#FFFFFF" />
    <rect x="4" y="13" width="3" height="3" fill="#FFFFFF" />
    <rect x="9" y="13" width="3" height="3" fill="#FFFFFF" />
    <rect x="16" y="12" width="3" height="3" fill="#FFFFFF" />
    <rect x="16" y="17" width="3" height="3" fill="#FFFFFF" />
  </svg>
);

// BI-13: Materials — geometric building blocks (cube + beam + pipe)
export const IconMaterials = ({ size = 20, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="2" y="12" width="8" height="8" fill="#C1292E" />
    <rect x="4" y="14" width="4" height="4" fill="#FFFFFF" opacity="0.3" />
    <rect x="12" y="8" width="10" height="4" fill="#1A1A1A" />
    <rect x="12" y="14" width="10" height="4" fill="#F5C518" />
    <circle cx="7" cy="6" r="4" fill="#1A1A1A" />
    <circle cx="7" cy="6" r="2" fill="#FFFFFF" />
  </svg>
);

// BI-12: Large Gear (decorative)
export const IconGear = ({ size = 20, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 0L14.8 4.5L20 2.8L17.5 8L23 10.5L17.5 13L20 17.2L14.8 15.5L12 20L9.2 15.5L4 17.2L6.5 13L1 10.5L6.5 8L4 2.8L9.2 4.5Z" fill="#C1292E" />
    <circle cx="12" cy="10.5" r="4" fill="#FFFFFF" />
    <circle cx="12" cy="10.5" r="1.5" fill="#C1292E" />
  </svg>
);
