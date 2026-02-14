import { requireOrg, canAccess } from "@/lib/auth";
import pool from "@/lib/db";
import { generateApiKey } from "@/lib/api-keys";
import { NextRequest, NextResponse } from "next/server";

/** GET — list all API keys for the org. */
export async function GET() {
  try {
    const org = await requireOrg();
    if (!canAccess(org, "api")) {
      return NextResponse.json(
        { error: "API-Zugang ist nur im Team-Plan verfügbar." },
        { status: 403 }
      );
    }

    const result = await pool.query(
      `SELECT id, name, key_prefix, last_used_at, expires_at, is_active, created_at
       FROM api_keys
       WHERE org_id = $1
       ORDER BY created_at DESC`,
      [org.id]
    );

    return NextResponse.json(result.rows);
  } catch (error: any) {
    if (["No organization found", "Trial expired", "Subscription cancelled"].includes(error.message)) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 });
  }
}

/** POST — create a new API key. */
export async function POST(req: NextRequest) {
  try {
    const org = await requireOrg();
    if (!canAccess(org, "api")) {
      return NextResponse.json(
        { error: "API-Zugang ist nur im Team-Plan verfügbar." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    if (!name || name.length > 100) {
      return NextResponse.json(
        { error: "Name ist erforderlich (max. 100 Zeichen)." },
        { status: 400 }
      );
    }

    // Limit to 10 active keys per org
    const countResult = await pool.query(
      `SELECT COUNT(*) FROM api_keys WHERE org_id = $1 AND is_active = true`,
      [org.id]
    );
    if (parseInt(countResult.rows[0].count) >= 10) {
      return NextResponse.json(
        { error: "Maximal 10 aktive API-Schlüssel erlaubt." },
        { status: 400 }
      );
    }

    const { raw, hash, prefix } = generateApiKey();

    await pool.query(
      `INSERT INTO api_keys (org_id, name, key_hash, key_prefix)
       VALUES ($1, $2, $3, $4)`,
      [org.id, name, hash, prefix]
    );

    // Return full key ONCE — never shown again
    return NextResponse.json({ key: raw, prefix }, { status: 201 });
  } catch (error: any) {
    if (["No organization found", "Trial expired", "Subscription cancelled"].includes(error.message)) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 });
  }
}

/** DELETE — revoke an API key. */
export async function DELETE(req: NextRequest) {
  try {
    const org = await requireOrg();
    const { searchParams } = new URL(req.url);
    const keyId = searchParams.get("id");

    if (!keyId) {
      return NextResponse.json({ error: "ID fehlt." }, { status: 400 });
    }

    await pool.query(
      `UPDATE api_keys SET is_active = false WHERE id = $1 AND org_id = $2`,
      [keyId, org.id]
    );

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    if (["No organization found", "Trial expired", "Subscription cancelled"].includes(error.message)) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 });
  }
}
