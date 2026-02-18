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

  const acceptLang = (req.headers.get("accept-language") || "").toLowerCase();
  if (/\bru\b/.test(acceptLang)) return "ru";
  if (/\ben\b/.test(acceptLang)) return "en";
  return "de";
}

export default clerkMiddleware(async (auth, request) => {
  const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || "";
  const isConfigured =
    clerkKey.startsWith("pk_live_") || clerkKey.startsWith("pk_test_");

  if (isConfigured && !isPublicRoute(request)) {
    auth().protect();
  }

  // Set locale cookie via request headers so Clerk's internal
  // response (with Set-Cookie for __session, __client_uat) is preserved.
  const locale = detectLocale(request);
  if (locale) {
    const response = NextResponse.next({
      request: { headers: new Headers(request.headers) },
    });
    response.cookies.set("locale", locale, {
      path: "/",
      maxAge: 31536000,
      sameSite: "lax",
      secure: true,
    });
    return response;
  }
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
