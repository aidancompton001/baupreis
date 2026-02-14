import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = [
  "/",
  "/preise",
  "/ueber-uns",
  "/datenschutz",
  "/impressum",
  "/agb",
  "/blog",
  "/sign-in",
  "/sign-up",
  "/api/webhook/",
  "/api/v1/",
  "/api/index/calculate",
  "/api/cron/",
];

function detectLocale(req: NextRequest): string | null {
  if (req.cookies.get("locale")) return null;
  const acceptLang = req.headers.get("accept-language") || "";
  if (acceptLang.includes("ru")) return "ru";
  if (acceptLang.includes("en")) return "en";
  return "de";
}

function applyLocale(req: NextRequest, response: NextResponse): NextResponse {
  const locale = detectLocale(req);
  if (locale) {
    response.cookies.set("locale", locale, {
      path: "/",
      maxAge: 31536000,
      sameSite: "lax",
    });
  }
  return response;
}

function devMiddleware(req: NextRequest) {
  return applyLocale(req, NextResponse.next());
}

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + "/") || pathname.startsWith(p + "?")
  );
}

async function prodMiddleware(req: NextRequest) {
  // Public paths: no auth needed
  if (isPublicPath(req.nextUrl.pathname)) {
    return applyLocale(req, NextResponse.next());
  }

  // Protected paths: check Clerk session via cookies
  try {
    const token = req.cookies.get("__session")?.value;

    if (!token) {
      const signInUrl = new URL("/sign-in", req.url);
      signInUrl.searchParams.set("redirect_url", req.nextUrl.pathname);
      return NextResponse.redirect(signInUrl);
    }

    // Token exists — let the request through, auth.ts will validate via auth()
    return applyLocale(req, NextResponse.next());
  } catch {
    // If Clerk SDK fails, let request through (auth.ts will handle)
    return applyLocale(req, NextResponse.next());
  }
}

export default function middleware(req: NextRequest) {
  const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || "";
  if (process.env.NODE_ENV === "development" || (!clerkKey.startsWith("pk_live_") && !clerkKey.startsWith("pk_test_"))) {
    return devMiddleware(req);
  }
  return prodMiddleware(req);
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
