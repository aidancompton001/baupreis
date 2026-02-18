import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const plan = req.nextUrl.searchParams.get("plan");
  const period = req.nextUrl.searchParams.get("period");

  if (!plan || !period) {
    return NextResponse.json(
      { error: "plan and period required" },
      { status: 400 }
    );
  }

  const envKey = `PAYPAL_PLAN_${plan.toUpperCase()}_${period.toUpperCase()}`;
  const planId = process.env[envKey];

  if (!planId) {
    return NextResponse.json({ error: "Plan not found" }, { status: 404 });
  }

  return NextResponse.json({ planId });
}
