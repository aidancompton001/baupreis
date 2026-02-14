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

function isPublic(pathname: string): boolean {
  return PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + "/") || pathname.startsWith(p + "?")
  );
}

function detectLocale(req: NextRequest): string | null {
  if (req.cookies.get("locale")) return null; // already set
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

// Dev mode: skip Clerk entirely (Clerk API requires network access)
function devMiddleware(req: NextRequest) {
  return applyLocale(req, NextResponse.next());
}

// Production: use Clerk middleware
async function prodMiddleware(req: NextRequest) {
  const { clerkMiddleware, createRouteMatcher } = await import(
    "@clerk/nextjs/server"
  );

  const isPublicRoute = createRouteMatcher([
    "/",
    "/preise",
    "/ueber-uns",
    "/datenschutz",
    "/impressum",
    "/agb",
    "/blog(.*)",
    "/sign-in(.*)",
    "/sign-up(.*)",
    "/api/webhook/(.*)",
    "/api/v1/(.*)",
    "/api/index/calculate",
    "/api/cron/(.*)",
  ]);

  const handler = clerkMiddleware((auth, innerReq) => {
    if (!isPublicRoute(innerReq)) {
      const { userId } = auth();
      if (!userId) {
        const signInUrl = new URL("/sign-in", innerReq.url);
        signInUrl.searchParams.set("redirect_url", innerReq.nextUrl.pathname);
        return NextResponse.redirect(signInUrl);
      }
    }
  });

  const result = await handler(req, {} as any);
  const response = result ? NextResponse.next({ headers: result.headers }) : NextResponse.next();
  return applyLocale(req, response);
}

export default function middleware(req: NextRequest) {
  // Skip Clerk if in dev mode or if Clerk keys are not configured
  const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || "";
  if (process.env.NODE_ENV === "development" || !clerkKey.startsWith("pk_live_") && !clerkKey.startsWith("pk_test_c")) {
    return devMiddleware(req);
  }
  return prodMiddleware(req);
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
