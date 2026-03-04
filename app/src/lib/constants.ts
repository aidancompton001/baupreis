/**
 * Application-wide constants.
 * Centralises magic values that were previously hardcoded across the codebase.
 */

/** Primary contact / support email. Overridable via CONTACT_EMAIL env var. */
export const CONTACT_EMAIL = process.env.CONTACT_EMAIL || "pashchenkoh@gmail.com";
export const SUPPORT_EMAIL = CONTACT_EMAIL;
