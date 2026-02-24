import { requireOrg, canAccess } from "@/lib/auth";
import pool from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { BASE_METALS } from "@/lib/alloys";

const MAX_FORMULAS = 20;
const VALID_ELEMENTS = Object.keys(BASE_METALS);

/** GET: List user's custom formulas */
export async function GET() {
  try {
    const org = await requireOrg();
    if (!canAccess(org, "forecast")) {
      return NextResponse.json({ error: "Pro-Plan erforderlich." }, { status: 403 });
    }

    const result = await pool.query(
      `SELECT id, name, composition, created_at
       FROM alloy_formulas
       WHERE org_id = $1
       ORDER BY created_at DESC
       LIMIT 50`,
      [org.id]
    );

    return NextResponse.json({ formulas: result.rows });
  } catch (error: any) {
    if (["No organization found", "Trial expired", "Subscription cancelled"].includes(error.message)) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 });
  }
}

/** POST: Create a custom formula */
export async function POST(req: NextRequest) {
  try {
    const org = await requireOrg();
    if (!canAccess(org, "forecast")) {
      return NextResponse.json({ error: "Pro-Plan erforderlich." }, { status: 403 });
    }

    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Ungültiges JSON." }, { status: 400 });
    }

    const { name, composition } = body;

    // Validate name
    if (!name || typeof name !== "string" || name.trim().length < 1 || name.length > 100) {
      return NextResponse.json({ error: "Name ist erforderlich (max 100 Zeichen)." }, { status: 400 });
    }

    // Validate composition
    if (!composition || typeof composition !== "object" || Array.isArray(composition)) {
      return NextResponse.json({ error: "composition muss ein Objekt sein." }, { status: 400 });
    }

    const entries = Object.entries(composition) as [string, unknown][];
    if (entries.length < 2 || entries.length > 15) {
      return NextResponse.json({ error: "Zusammensetzung: 2-15 Elemente erforderlich." }, { status: 400 });
    }

    let sum = 0;
    const cleanComp: Record<string, number> = {};
    for (const [element, value] of entries) {
      if (!VALID_ELEMENTS.includes(element)) {
        return NextResponse.json({ error: `Unbekanntes Element: ${element}. Verfügbar: ${VALID_ELEMENTS.join(", ")}` }, { status: 400 });
      }
      const fraction = Number(value);
      if (isNaN(fraction) || fraction <= 0 || fraction > 1) {
        return NextResponse.json({ error: `${element}: Anteil muss zwischen 0 und 1 liegen.` }, { status: 400 });
      }
      sum += fraction;
      cleanComp[element] = Math.round(fraction * 10000) / 10000;
    }

    if (Math.abs(sum - 1.0) > 0.02) {
      return NextResponse.json(
        { error: `Summe der Anteile = ${(sum * 100).toFixed(1)}%. Muss ~100% sein (±2%).` },
        { status: 400 }
      );
    }

    // Check formula count limit
    const countResult = await pool.query(
      "SELECT COUNT(*) FROM alloy_formulas WHERE org_id = $1",
      [org.id]
    );
    if (Number(countResult.rows[0].count) >= MAX_FORMULAS) {
      return NextResponse.json({ error: `Maximal ${MAX_FORMULAS} Formeln erlaubt.` }, { status: 400 });
    }

    const result = await pool.query(
      `INSERT INTO alloy_formulas (org_id, name, composition)
       VALUES ($1, $2, $3)
       RETURNING id, name, composition, created_at`,
      [org.id, name.trim(), JSON.stringify(cleanComp)]
    );

    return NextResponse.json({ formula: result.rows[0] }, { status: 201 });
  } catch (error: any) {
    if (["No organization found", "Trial expired", "Subscription cancelled"].includes(error.message)) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 });
  }
}

/** DELETE: Remove a custom formula */
export async function DELETE(req: NextRequest) {
  try {
    const org = await requireOrg();

    const { searchParams } = new URL(req.url);
    const formulaId = searchParams.get("id");
    if (!formulaId) {
      return NextResponse.json({ error: "id parameter fehlt." }, { status: 400 });
    }

    await pool.query(
      "DELETE FROM alloy_formulas WHERE id = $1 AND org_id = $2",
      [formulaId, org.id]
    );

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    if (["No organization found", "Trial expired", "Subscription cancelled"].includes(error.message)) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 });
  }
}
