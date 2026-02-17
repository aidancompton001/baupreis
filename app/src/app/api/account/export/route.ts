import { NextResponse } from "next/server";
import { requireOrg, getUser } from "@/lib/auth";
import pool from "@/lib/db";

export async function POST() {
  try {
    const org = await requireOrg();
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Collect all user-related data
    const [profileRes, materialsRes, alertsRes, reportsRes] = await Promise.all([
      pool.query(
        `SELECT u.email, u.name, u.first_name, u.last_name, u.phone,
                u.position_title, u.role, u.created_at,
                o.name as company, o.plan, o.vat_id,
                o.billing_street, o.billing_city, o.billing_zip, o.billing_country
         FROM users u JOIN organizations o ON u.org_id = o.id
         WHERE u.id = $1`,
        [user.id]
      ),
      pool.query(
        `SELECT m.code, m.name_de FROM org_materials om
         JOIN materials m ON m.id = om.material_id
         WHERE om.org_id = $1`,
        [org.id]
      ),
      pool.query(
        `SELECT ar.rule_type, ar.threshold_pct, ar.channel, ar.is_active,
                m.name_de as material
         FROM alert_rules ar
         JOIN materials m ON m.id = ar.material_id
         WHERE ar.org_id = $1`,
        [org.id]
      ),
      pool.query(
        `SELECT report_type, period_start, period_end, created_at
         FROM reports WHERE org_id = $1 ORDER BY created_at DESC LIMIT 50`,
        [org.id]
      ),
    ]);

    const exportData = {
      exportedAt: new Date().toISOString(),
      profile: profileRes.rows[0] || {},
      selectedMaterials: materialsRes.rows,
      alertRules: alertsRes.rows,
      reports: reportsRes.rows,
    };

    return NextResponse.json(exportData);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 403 });
  }
}
