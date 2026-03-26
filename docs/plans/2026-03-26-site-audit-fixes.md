# Site Audit Fixes — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Устранить все слабые стороны, найденные в T001_site_audit_pre_review.md, до аудита.

**Architecture:** 3 приоритетных волны: (1) security-critical — CSP, CSRF, Stripe verify; (2) code quality — i18n auth, Clerk cleanup, redirects, CORS, synthetic indicator; (3) improvements — Sentry, tests, OpenAPI.

**Tech Stack:** Next.js 14, Caddy, TypeScript, Vitest, Playwright

**Source:** [T001_site_audit_pre_review.md](../tasks/T001_site_audit_pre_review.md)

---

## WAVE 1 — КРИТИЧНОЕ (Security)

### Task 1: CSP Header в Caddy (R1)

**Ответственный:** #6 Klaus Weber — SRE
**Files:**
- Modify: `/root/baupreis/Caddyfile` (на сервере 187.33.159.205)

**Step 1: Проверить текущий Caddyfile**
```bash
ssh root@187.33.159.205 "cat /root/baupreis/Caddyfile"
```

**Step 2: Добавить CSP header**
```
header {
    Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https://img.clerk.com https://www.googletagmanager.com; connect-src 'self' https://www.google-analytics.com https://api.stripe.com; frame-src https://js.stripe.com; object-src 'none'; base-uri 'self'"
}
```

**Step 3: Перезагрузить Caddy**
```bash
ssh root@187.33.159.205 "docker exec caddy caddy reload --config /etc/caddy/Caddyfile"
```

**Step 4: Верифицировать**
```bash
curl -sI https://baupreis.ais152.com/ | grep -i content-security
```
Expected: `Content-Security-Policy: default-src 'self'; ...`

**Step 5: Commit Caddyfile (если в git)**

---

### Task 2: CSRF-защита (R2)

**Ответственный:** #5 Andreas Keller — Backend
**Files:**
- Create: `app/src/lib/csrf.ts`
- Modify: `app/src/middleware.ts`
- Modify: `app/src/app/(auth)/sign-in/[[...sign-in]]/page.tsx`
- Modify: `app/src/app/(auth)/sign-up/[[...sign-up]]/page.tsx`
- Create: `app/src/lib/__tests__/csrf.test.ts`

**Step 1: Написать failing test**
```typescript
// app/src/lib/__tests__/csrf.test.ts
import { describe, it, expect } from "vitest";
import { generateCsrfToken, validateCsrfToken } from "../csrf";

describe("CSRF", () => {
  it("generates a token string", () => {
    const token = generateCsrfToken("test-session-id");
    expect(typeof token).toBe("string");
    expect(token.length).toBeGreaterThan(20);
  });

  it("validates a correct token", () => {
    const token = generateCsrfToken("test-session-id");
    expect(validateCsrfToken(token, "test-session-id")).toBe(true);
  });

  it("rejects a wrong token", () => {
    expect(validateCsrfToken("wrong-token", "test-session-id")).toBe(false);
  });

  it("rejects expired token (>1h)", () => {
    // Token with old timestamp
    const token = generateCsrfToken("test-session-id", Date.now() - 3601000);
    expect(validateCsrfToken(token, "test-session-id")).toBe(false);
  });
});
```

**Step 2: Run test — verify FAIL**
```bash
cd app && npx vitest run src/lib/__tests__/csrf.test.ts
```
Expected: FAIL — `generateCsrfToken` not found

**Step 3: Implement csrf.ts**
```typescript
// app/src/lib/csrf.ts
import crypto from "crypto";

const CSRF_SECRET = process.env.CSRF_SECRET || process.env.SESSION_SECRET || "baupreis-csrf-default";
const TOKEN_TTL = 3600_000; // 1 hour

export function generateCsrfToken(sessionId: string, now = Date.now()): string {
  const timestamp = now.toString(36);
  const payload = `${sessionId}:${timestamp}`;
  const hmac = crypto.createHmac("sha256", CSRF_SECRET).update(payload).digest("hex").slice(0, 16);
  return `${timestamp}.${hmac}`;
}

export function validateCsrfToken(token: string, sessionId: string): boolean {
  if (!token || !sessionId) return false;
  const [timestamp, hmac] = token.split(".");
  if (!timestamp || !hmac) return false;

  const ts = parseInt(timestamp, 36);
  if (Date.now() - ts > TOKEN_TTL) return false;

  const expected = generateCsrfToken(sessionId, ts);
  const [, expectedHmac] = expected.split(".");
  return crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(expectedHmac!));
}
```

**Step 4: Run test — verify PASS**
```bash
cd app && npx vitest run src/lib/__tests__/csrf.test.ts
```
Expected: 4 tests PASS

**Step 5: Добавить CSRF middleware для POST**

В `middleware.ts` — добавить проверку `X-CSRF-Token` header на POST-запросы к `/api/` (кроме webhooks, cron, auth).

В формах (sign-in, sign-up, alerts, contact) — добавить `<input type="hidden" name="csrf" value={csrfToken}>` или `X-CSRF-Token` header в fetch.

**Step 6: Commit**
```bash
git add app/src/lib/csrf.ts app/src/lib/__tests__/csrf.test.ts app/src/middleware.ts
git commit -m "feat(security): add CSRF protection with HMAC tokens"
```

---

### Task 3: Верифицировать Stripe на production (R3)

**Ответственный:** #5 Andreas Keller — Backend
**Files:** Нет изменений (проверка)

**Step 1: Проверить env на сервере**
```bash
ssh root@187.33.159.205 "grep STRIPE /root/baupreis/.env"
```
Expected: `STRIPE_SECRET_KEY=sk_live_...`, `STRIPE_WEBHOOK_SECRET=whsec_...`

**Step 2: Проверить webhook endpoint**
```bash
ssh root@187.33.159.205 "docker logs baupreis-app --tail 100 | grep -i stripe"
```

**Step 3: Отправить тест-event из Stripe Dashboard**
Stripe Dashboard → Developers → Webhooks → Send test webhook → `checkout.session.completed`

**Step 4: Проверить логи**
```bash
ssh root@187.33.159.205 "docker logs baupreis-app --tail 20 | grep -i webhook"
```
Expected: Webhook processed successfully

**Step 5: Документировать результат в T001**

---

## WAVE 2 — ВАЖНОЕ (Code Quality)

### Task 4: i18n для auth-страниц (R4)

**Ответственный:** #3 Maximilian Braun — Frontend
**Files:**
- Modify: `app/src/app/(auth)/sign-in/[[...sign-in]]/page.tsx`
- Modify: `app/src/app/(auth)/sign-up/[[...sign-up]]/page.tsx`
- Modify: `app/src/i18n/de.ts` — добавить ключи auth.*
- Modify: `app/src/i18n/en.ts` — добавить ключи auth.*

**Step 1: Добавить i18n ключи в de.ts и en.ts**

```typescript
// auth section
auth_login_title: "Anmelden",           // en: "Sign In"
auth_login_subtitle: "Willkommen zurück bei BauPreis AI",  // en: "Welcome back to BauPreis AI"
auth_email: "E-Mail-Adresse",           // en: "Email address"
auth_email_placeholder: "name@firma.de", // en: "name@company.com"
auth_login_button: "Anmelden",          // en: "Sign In"
auth_login_loading: "Wird angemeldet...", // en: "Signing in..."
auth_login_error: "Anmeldung fehlgeschlagen.", // en: "Login failed."
auth_network_error: "Netzwerkfehler. Bitte versuchen Sie es erneut.", // en: "Network error. Please try again."
auth_or: "oder",                        // en: "or"
auth_google: "Mit Google anmelden",     // en: "Sign in with Google"
auth_no_account: "Noch kein Konto?",    // en: "No account yet?"
auth_register_link: "Kostenlos registrieren", // en: "Register for free"
auth_register_title: "Kostenlos registrieren", // en: "Register for free"
auth_register_subtitle: "14 Tage kostenlos testen. Keine Kreditkarte erforderlich.", // en: "14 days free trial. No credit card required."
auth_name: "Ihr Name",                  // en: "Your name"
auth_name_placeholder: "Max Mustermann", // en: "John Doe"
auth_company: "Firmenname",             // en: "Company name"
auth_company_placeholder: "Musterbau GmbH", // en: "Sample Construction Ltd"
auth_register_button: "Kostenlos starten", // en: "Start for free"
auth_register_loading: "Wird erstellt...", // en: "Creating..."
auth_register_error: "Registrierung fehlgeschlagen.", // en: "Registration failed."
auth_google_register: "Mit Google registrieren", // en: "Sign up with Google"
auth_has_account: "Bereits registriert?", // en: "Already registered?"
auth_login_link: "Anmelden",            // en: "Sign In"
auth_agb: "AGB",                        // en: "Terms"
auth_datenschutz: "Datenschutzerklärung", // en: "Privacy Policy"
```

**Step 2: Заменить хардкод в sign-in/page.tsx**
Добавить `import { useLocale } from "@/i18n/LocaleContext";` и `const { t } = useLocale();`
Заменить все немецкие строки на `t("auth_*")`.

**Step 3: Заменить хардкод в sign-up/page.tsx**
Аналогично.

**Step 4: Verify build**
```bash
cd app && npx next build
```

**Step 5: Commit**
```bash
git commit -m "feat(i18n): localize auth pages (sign-in, sign-up) — de/en/ru"
```

---

### Task 5: Удалить Clerk remnants (R5)

**Ответственный:** #3 Maximilian Braun — Frontend
**Files:**
- Delete: `app/src/components/auth/ClerkProviderWrapper.tsx`
- Delete: `app/src/components/auth/ClerkSignIn.tsx`
- Delete: `app/src/components/auth/ClerkSignUp.tsx`
- Delete: `app/src/components/layout/UserAvatarClient.tsx`
- Delete: `app/src/app/api/webhook/clerk/route.ts`
- Modify: `app/src/lib/auth.ts` — удалить Clerk imports и fallback
- Modify: `app/next.config.js` — удалить `img.clerk.com`

**Step 1: Grep для всех Clerk imports**
```bash
cd app && grep -r "@clerk\|ClerkProvider\|ClerkSignIn\|ClerkSignUp\|UserButton" src/ --include="*.ts" --include="*.tsx" -l
```

**Step 2: Удалить файлы**
```bash
rm src/components/auth/ClerkProviderWrapper.tsx
rm src/components/auth/ClerkSignIn.tsx
rm src/components/auth/ClerkSignUp.tsx
rm src/components/layout/UserAvatarClient.tsx
rm src/app/api/webhook/clerk/route.ts
```

**Step 3: Очистить auth.ts от Clerk require()**
Удалить динамические `require("@clerk/nextjs/server")` — заменить на чистую session-only логику.

**Step 4: Удалить img.clerk.com из next.config.js**

**Step 5: Verify build**
```bash
cd app && npx next build
```

**Step 6: Commit**
```bash
git commit -m "chore: remove dead Clerk code (auth migrated to custom sessions)"
```

---

### Task 6: URL redirects (R8)

**Ответственный:** #3 Maximilian Braun — Frontend
**Files:**
- Modify: `app/next.config.js`

**Step 1: Добавить redirects в next.config.js**
```javascript
async redirects() {
  return [
    { source: '/login', destination: '/sign-in', permanent: true },
    { source: '/registrieren', destination: '/sign-up', permanent: true },
    { source: '/register', destination: '/sign-up', permanent: true },
    { source: '/anmelden', destination: '/sign-in', permanent: true },
  ];
},
```

**Step 2: Verify build**
```bash
cd app && npx next build
```

**Step 3: Commit**
```bash
git commit -m "feat(routing): add permanent redirects for /login, /registrieren"
```

---

### Task 7: CORS whitelist (R7)

**Ответственный:** #5 Andreas Keller — Backend
**Files:**
- Modify: `app/next.config.js`

**Step 1: Добавить CORS headers для API**
```javascript
{
  source: '/api/:path*',
  headers: [
    { key: 'Access-Control-Allow-Origin', value: 'https://baupreis.ais152.com' },
    { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, PATCH, OPTIONS' },
    { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization, X-CSRF-Token, X-API-Key' },
    { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
  ],
},
```

**Step 2: Verify build + test**
```bash
cd app && npx next build
curl -sI -X OPTIONS https://baupreis.ais152.com/api/health | grep -i access
```

**Step 3: Commit**
```bash
git commit -m "feat(security): add explicit CORS whitelist for API routes"
```

---

### Task 8: Synthetic data indicator (R6)

**Ответственный:** #3 Maximilian Braun — Frontend
**Files:**
- Modify: `app/src/lib/data-sources.ts` — добавить `source` в response
- Modify: `app/src/app/(dashboard)/dashboard/page.tsx` — показать badge "Synthetisch"
- Modify: `app/src/app/api/prices/route.ts` — включить `source` в response

**Step 1: Добавить `source` field в API response prices**

**Step 2: На Dashboard — если `source === "synthetic"`, показать оранжевый badge**
```tsx
{price.source === "synthetic" && (
  <span className="text-xs bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded">
    {t("synthetic_data")}
  </span>
)}
```

**Step 3: i18n key**
```typescript
synthetic_data: "Simuliert",  // en: "Simulated", ru: "Симуляция"
```

**Step 4: Verify build**

**Step 5: Commit**
```bash
git commit -m "feat(ux): show synthetic data indicator on dashboard"
```

---

## WAVE 3 — УЛУЧШЕНИЯ (после аудита)

### Task 9: Sentry integration (R9) — M
### Task 10: Test coverage expansion (R10) — L
### Task 11: OpenAPI docs (R11) — M
### Task 12: Accessibility audit (R12) — L
### Task 13: WhatsApp verification (R13) — M

> Wave 3 tasks — детализируются после завершения Wave 1+2 и одобрения CEO.

---

## Чеклист приёмки

### Wave 1
- [ ] `curl -sI https://baupreis.ais152.com/ | grep Content-Security-Policy` → header present
- [ ] CSRF test: 4 unit tests pass
- [ ] CSRF: POST без токена → 403
- [ ] Stripe: test webhook event processed OK

### Wave 2
- [ ] `/sign-in` — переключить locale на EN → все тексты на английском
- [ ] `/sign-up` — переключить locale на EN → все тексты на английском
- [ ] `grep -r "@clerk" app/src/` → 0 результатов
- [ ] `curl -sI https://baupreis.ais152.com/login` → 301 → `/sign-in`
- [ ] `curl -sI https://baupreis.ais152.com/registrieren` → 301 → `/sign-up`
- [ ] CORS: `curl -sI -X OPTIONS .../api/health | grep Access-Control` → present
- [ ] Dashboard с synthetic data → оранжевый badge "Simuliert"

### Global
- [ ] `cd app && npx next build` → 0 errors
- [ ] `cd app && npx vitest run` → all tests pass
- [ ] `cd app && npx tsc --noEmit` → 0 errors
