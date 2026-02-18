import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "svix";
import pool from "@/lib/db";

export async function POST(req: NextRequest) {
  const payload = await req.text();
  const svixId = req.headers.get("svix-id");
  const svixTimestamp = req.headers.get("svix-timestamp");
  const svixSignature = req.headers.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json({ error: "Missing svix headers" }, { status: 400 });
  }

  let evt: any;
  try {
    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);
    evt = wh.verify(payload, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as any;
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (evt.type === "user.created") {
    const { id, email_addresses, first_name, last_name } = evt.data;
    const email = email_addresses[0]?.email_address;
    const name = [first_name, last_name].filter(Boolean).join(" ");

    const slug =
      email
        .split("@")[0]
        .replace(/[^a-z0-9]/g, "-")
        .slice(0, 50) +
      "-" +
      Date.now();

    const dbClient = await pool.connect();
    try {
      await dbClient.query("BEGIN");

      const orgResult = await dbClient.query(
        `INSERT INTO organizations (name, slug, plan, trial_ends_at,
          max_materials, max_users, max_alerts,
          features_telegram, features_forecast, features_api, features_pdf_reports)
         VALUES ($1, $2, 'trial', NOW() + INTERVAL '7 days',
          99, 5, 999, true, true, true, true)
         RETURNING id`,
        [name || email, slug]
      );

      await dbClient.query(
        `INSERT INTO users (org_id, clerk_user_id, email, name, role)
         VALUES ($1, $2, $3, $4, 'owner')`,
        [orgResult.rows[0].id, id, email, name]
      );

      // Add all materials for Trial (full access)
      await dbClient.query(
        `INSERT INTO org_materials (org_id, material_id)
         SELECT $1, id FROM materials WHERE is_active = true`,
        [orgResult.rows[0].id]
      );

      await dbClient.query("COMMIT");
    } catch (e) {
      await dbClient.query("ROLLBACK");
      throw e;
    } finally {
      dbClient.release();
    }
  }

  if (evt.type === "user.deleted") {
    await pool.query(
      `UPDATE organizations SET is_active = false
       WHERE id = (SELECT org_id FROM users WHERE clerk_user_id = $1)`,
      [evt.data.id]
    );
  }

  return NextResponse.json({ received: true });
}
