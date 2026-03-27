import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SESSION_COOKIE = "baupreis_session";

/**
 * Detect locale for FIRST visit only (no cookie yet).
 * Once a cookie exists, NEVER override it — the user's choice is final.
 */
function detectLocale(req: NextRequest): string | null {
  const existing = req.cookies.get("locale")?.value;
  if (existing && ["de", "en", "ru"].includes(existing)) return null;

  const acceptLang = (req.headers.get("accept-language") || "").toLowerCase();
  if (/\bru\b/.test(acceptLang)) return "ru";
  if (/\ben\b/.test(acceptLang)) return "en";
  return "de";
}

function setLocaleCookie(request: NextRequest, response?: NextResponse) {
  const locale = detectLocale(request);
  if (locale) {
    const res =
      response ||
      NextResponse.next({
        request: { headers: new Headers(request.headers) },
      });
    res.cookies.set("locale", locale, {
      path: "/",
      maxAge: 31536000,
      sameSite: "lax",
      secure: true,
    });
    return res;
  }
  return response || NextResponse.next();
}

/**
 * Plain middleware (no Clerk): check baupreis_session cookie on protected routes.
 */
function plainMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes — no auth check needed
  const isPublic =
    pathname === "/" ||
    pathname.startsWith("/sign-in") ||
    pathname.startsWith("/sign-up") ||
    pathname.startsWith("/api/webhook") ||
    pathname.startsWith("/api/v1/") ||
    pathname.startsWith("/api/cron/") ||
    pathname.startsWith("/api/auth/") ||
    pathname.startsWith("/api/contact") ||
    pathname === "/api/health" ||
    pathname.startsWith("/api/index/") ||
    pathname === "/preise" ||
    pathname === "/kontakt" ||
    pathname === "/ueber-uns" ||
    pathname === "/datenschutz" ||
    pathname === "/impressum" ||
    pathname === "/agb" ||
    pathname.startsWith("/blog") ||
    pathname === "/changelog";

  // Dashboard routes: allow guest access (GuestOverlay handles UX)
  // API routes still require auth (return 403 without session)
  if (!isPublic && !pathname.startsWith("/api/")) {
    // Let guests through to dashboard pages — no redirect
    // GuestOverlay in layout.tsx will show blur + CTA
  }

  // API routes (non-public): still require session — but return 403, not redirect
  // (handled by requireOrg() in each route handler)

  return setLocaleCookie(request);
}

export default plainMiddleware;

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
