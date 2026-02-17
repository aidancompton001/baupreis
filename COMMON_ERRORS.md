# Common Errors & Prevention Guide

## 1. Component outside required Context Provider

**Symptom:** `Application error: a client-side exception has occurred`

**Cause:** A client component that uses a React Context hook (e.g. `useLocale()`, `useAuth()`) is rendered OUTSIDE of its Provider in the component tree.

**Example (BAD):**
```tsx
<body>
  <LocaleProvider>{children}</LocaleProvider>
  <CookieConsent />  <!-- uses useLocale() but is OUTSIDE LocaleProvider -->
</body>
```

**Fix:**
```tsx
<body>
  <LocaleProvider>
    {children}
    <CookieConsent />  <!-- now INSIDE LocaleProvider -->
  </LocaleProvider>
</body>
```

**Prevention rule:** Before adding any new component to `layout.tsx`, check if it uses `useLocale()`, `useAuth()`, or any other context hook. If yes, it MUST be a child of the corresponding Provider.

**Checklist for layout.tsx changes:**
- [ ] Does the component use `useLocale()`? -> Must be inside `<LocaleProvider>`
- [ ] Does the component use Clerk hooks? -> Must be inside `<ClerkProviderWrapper>`
- [ ] Does the component use any other context? -> Must be inside that Provider

---

## 2. Stream ID vs Measurement ID (Google Analytics)

**Symptom:** GA4 does not collect data, no traffic visible in Google Analytics.

**Cause:** Used numeric Stream ID (e.g. `13624796274`) instead of Measurement ID (e.g. `G-QWRZR920QR`).

**Prevention rule:** GA4 Measurement ID always starts with `G-` followed by alphanumeric characters. If the value is purely numeric, it's the wrong ID.

---

## 3. Bash parentheses in paths

**Symptom:** `bash: syntax error near unexpected token '('`

**Cause:** Next.js App Router uses parentheses in folder names like `(marketing)`, `(dashboard)`, `(auth)`. Bash interprets `(` as subshell syntax.

**Fix:** Always quote paths containing parentheses:
```bash
# BAD
git add app/src/app/(marketing)/page.tsx

# GOOD
git add "app/src/app/(marketing)/page.tsx"
```

---

## 4. Server Component importing Client-only code

**Symptom:** Build error or hydration mismatch.

**Cause:** A server component imports a module that uses browser APIs (`document`, `window`, `localStorage`).

**Prevention rule:**
- Utility files used by BOTH server and client (like `consent.ts`) must guard browser APIs: `if (typeof document === "undefined") return null;`
- Constants (like `GA_MEASUREMENT_ID`) are safe to import anywhere
- Functions using `document`/`window` should only be called in client components

---

## 5. `"use client"` directive missing

**Symptom:** Error about hooks or browser APIs in server components.

**Cause:** Component uses React hooks (`useState`, `useEffect`, etc.) or browser APIs but lacks `"use client"` at the top.

**Prevention rule:** Any component that uses hooks, event handlers, or browser APIs MUST have `"use client"` as the first line.

---

## 6. i18n key missing in one language

**Symptom:** Raw key string shown on UI (e.g. `cookie.title` instead of translated text).

**Cause:** Key added to `de.ts` but not to `en.ts` or `ru.ts` (or vice versa).

**Prevention rule:** When adding i18n keys, ALWAYS add to all 3 files: `de.ts`, `en.ts`, `ru.ts`. Count keys in each file to verify they match.
