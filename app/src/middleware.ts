import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SESSION_COOKIE = "baupreis_session";

const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || "";
const isClerkConfigured =
  clerkKey.startsWith("pk_live_") || clerkKey.startsWith("pk_test_");

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhook/(.*)",
  "/api/v1/(.*)",
  "/api/cron/(.*)",
  "/api/index/calculate",
  "/api/contact",
  "/api/auth/(.*)",
  "/preise",
  "/kontakt",
  "/ueber-uns",
  "/datenschutz",
  "/impressum",
  "/agb",
  "/blog",
  "/blog/(.*)",
]);

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
    pathname.startsWith("/api/index/") ||
    pathname === "/preise" ||
    pathname === "/kontakt" ||
    pathname === "/ueber-uns" ||
    pathname === "/datenschutz" ||
    pathname === "/impressum" ||
    pathname === "/agb" ||
    pathname.startsWith("/blog");

  if (!isPublic) {
    const hasSession = request.cookies.get(SESSION_COOKIE)?.value;
    if (!hasSession) {
      const signInUrl = new URL("/sign-in", request.url);
      signInUrl.searchParams.set("redirect", pathname);
      const redirectResponse = NextResponse.redirect(signInUrl);
      return setLocaleCookie(request, redirectResponse);
    }
  }

  return setLocaleCookie(request);
}

const clerkMw = isClerkConfigured
  ? clerkMiddleware(async (auth, request) => {
      if (!isPublicRoute(request)) {
        const session = auth();
        if (!session.userId) {
          const signInUrl = new URL("/sign-in", request.url);
          signInUrl.searchParams.set("redirect", request.nextUrl.pathname);
          return NextResponse.redirect(signInUrl);
        }
      }
      return setLocaleCookie(request);
    })
  : plainMiddleware;

export default clerkMw;

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
