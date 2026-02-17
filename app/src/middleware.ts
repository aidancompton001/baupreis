import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhook/(.*)",
  "/api/v1/(.*)",
  "/api/cron/(.*)",
  "/api/index/calculate",
  "/preise",
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

  // First visit: parse Accept-Language header
  const acceptLang = (req.headers.get("accept-language") || "").toLowerCase();
  // Match primary language tags (e.g. "ru", "ru-RU", "en-US")
  if (/\bru\b/.test(acceptLang)) return "ru";
  if (/\ben\b/.test(acceptLang)) return "en";
  return "de";
}

export default clerkMiddleware(async (auth, request) => {
  const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || "";
  const isConfigured =
    clerkKey.startsWith("pk_live_") || clerkKey.startsWith("pk_test_");

  // Only protect routes when Clerk is properly configured
  if (isConfigured && !isPublicRoute(request)) {
    auth().protect();
  }

  // Always create an explicit response — never let clerkMiddleware
  // generate its own, which could interfere with cookie propagation.
  const response = NextResponse.next();

  // Apply locale detection cookie (first visit only)
  const locale = detectLocale(request);
  if (locale) {
    response.cookies.set("locale", locale, {
      path: "/",
      maxAge: 31536000,
      sameSite: "lax",
    });
  }

  return response;
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
