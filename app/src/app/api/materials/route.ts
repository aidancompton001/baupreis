import { requireOrg } from "@/lib/auth";
import pool from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// GET: list all materials + which ones are selected by the org
export async function GET() {
  try {
    const org = await requireOrg();

    const result = await pool.query(
      `SELECT m.id, m.code, m.name_de, m.category, m.unit,
              CASE WHEN om.id IS NOT NULL THEN true ELSE false END AS selected
       FROM materials m
       LEFT JOIN org_materials om ON om.material_id = m.id AND om.org_id = $1
       ORDER BY m.category, m.name_de`,
      [org.id]
    );

    return NextResponse.json({
      materials: result.rows,
      max_materials: org.max_materials,
      plan: org.plan,
    });
  } catch (error: any) {
    if (error.message === "No organization found" || error.message === "Trial expired" || error.message === "Subscription cancelled") {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 });
  }
}

// POST: update selected materials for the org
export async function POST(req: NextRequest) {
  try {
    const org = await requireOrg();
    const { material_ids } = await req.json();

    if (!Array.isArray(material_ids)) {
      return NextResponse.json({ error: "material_ids muss ein Array sein" }, { status: 400 });
    }

    // Check max_materials limit for basis/trial
    if (
      (org.plan === "basis" || org.plan === "trial") &&
      material_ids.length > org.max_materials
    ) {
      return NextResponse.json(
        { error: `Maximal ${org.max_materials} Materialien in Ihrem Plan erlaubt.` },
        { status: 400 }
      );
    }

    // Validate all material IDs exist
    if (material_ids.length > 0) {
      const check = await pool.query(
        `SELECT id FROM materials WHERE id = ANY($1::uuid[])`,
        [material_ids]
      );
      if (check.rows.length !== material_ids.length) {
        return NextResponse.json({ error: "Ungültige Material-IDs" }, { status: 400 });
      }
    }

    // Replace org_materials: delete all then insert new
    await pool.query(`DELETE FROM org_materials WHERE org_id = $1`, [org.id]);

    if (material_ids.length > 0) {
      const values = material_ids
        .map((_: string, i: number) => `($1, $${i + 2})`)
        .join(", ");
      await pool.query(
        `INSERT INTO org_materials (org_id, material_id) VALUES ${values}`,
        [org.id, ...material_ids]
      );
    }

    return NextResponse.json({ success: true, count: material_ids.length });
  } catch (error: any) {
    if (error.message === "No organization found" || error.message === "Trial expired" || error.message === "Subscription cancelled") {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 });
  }
}
