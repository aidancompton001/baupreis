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

function detectLocale(req: NextRequest): string | null {
  if (req.cookies.get("locale")) return null;
  const acceptLang = req.headers.get("accept-language") || "";
  if (acceptLang.includes("ru")) return "ru";
  if (acceptLang.includes("en")) return "en";
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

  // Apply locale detection cookie
  const locale = detectLocale(request);
  if (locale) {
    const response = NextResponse.next();
    response.cookies.set("locale", locale, {
      path: "/",
      maxAge: 31536000,
      sameSite: "lax",
    });
    return response;
  }
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
