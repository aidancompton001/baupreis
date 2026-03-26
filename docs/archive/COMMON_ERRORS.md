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

---

## 7. Docker env var not reaching container

**Symptom:** App returns errors like "secret not configured" or env var is empty inside container.

**Cause:** Variable added to `.env` file but NOT to `docker-compose.yml` `environment:` section.

**Fix:** Every env var must be listed in BOTH places:
```yaml
# docker-compose.yml → services → app → environment
- MY_NEW_VAR=${MY_NEW_VAR}
```

**Prevention rule:** When adding any new env var: 1) Add to `.env`, 2) Add to `docker-compose.yml` environment section, 3) Verify with `docker exec baupreis-app-1 printenv MY_NEW_VAR`.

---

## 8. Middleware overwriting Clerk session cookies

**Symptom:** User session lost on tab close/reopen. Need to log in again.

**Cause:** Creating `NextResponse.next()` unconditionally in `clerkMiddleware` callback overwrites Clerk's internal Set-Cookie headers (`__session`, `__client_uat`).

**Fix:** Only return custom response when needed (e.g., setting locale cookie). Otherwise, don't return anything — let clerkMiddleware handle it.

```typescript
// BAD — overwrites Clerk cookies on every request
const response = NextResponse.next();
response.cookies.set("locale", ...);
return response;

// GOOD — only returns custom response when locale needs to be set
const locale = detectLocale(request);
if (locale) {
  const response = NextResponse.next({ request: { headers: new Headers(request.headers) } });
  response.cookies.set("locale", locale, { path: "/", maxAge: 31536000, sameSite: "lax", secure: true });
  return response;
}
// No return → clerkMiddleware handles response with its cookies intact
```

---

## 9. CREDENTIALS.md out of sync with server

**Symptom:** Using wrong API keys, deployments fail, features don't work.

**Cause:** Server .env was updated directly but CREDENTIALS.md was not updated.

**Prevention rule:** Server `.env` is the source of truth. Before any deployment or when debugging, run:
```bash
ssh root@187.33.159.205 "cat /root/baupreis/.env"
```
Compare with CREDENTIALS.md and update if needed.
