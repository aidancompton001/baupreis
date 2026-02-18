import { NextResponse } from "next/server";
import { requireOrg, getUser } from "@/lib/auth";
import pool from "@/lib/db";

export async function POST(request: Request) {
  try {
    const org = await requireOrg();
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    if (user.role !== "owner") {
      return NextResponse.json(
        { error: "Only the account owner can delete the account" },
        { status: 403 }
      );
    }

    const body = await request.json();
    if (body.confirm !== "DELETE") {
      return NextResponse.json(
        { error: "Confirmation required" },
        { status: 400 }
      );
    }

    // Cancel Paddle subscription if active
    if (org.paddle_subscription_id) {
      try {
        const { cancelSubscription } = await import("@/lib/paddle");
        await cancelSubscription(org.paddle_subscription_id, "immediately");
      } catch {
        // Continue even if Paddle cancellation fails
      }
    }

    // Delete org (cascades to users, org_materials, alert_rules, etc.)
    await pool.query(`UPDATE organizations SET is_active = false, plan = 'cancelled' WHERE id = $1`, [
      org.id,
    ]);
    await pool.query(`UPDATE users SET is_active = false WHERE org_id = $1`, [org.id]);

    // Try to delete Clerk user
    try {
      const { clerkClient } = require("@clerk/nextjs/server");
      const client = clerkClient();
      await client.users.deleteUser(user.clerk_user_id);
    } catch {
      // Continue even if Clerk deletion fails
    }

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 403 });
  }
}
