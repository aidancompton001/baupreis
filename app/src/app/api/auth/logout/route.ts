import { NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/session";

export async function POST() {
  const response = NextResponse.json({ ok: true, redirect: "/" });
  response.cookies.set(SESSION_COOKIE, "", {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
  });
  return response;
}

export async function GET() {
  const response = NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_APP_URL || "https://baupreis.ais152.com"));
  response.cookies.set(SESSION_COOKIE, "", {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
  });
  return response;
}
