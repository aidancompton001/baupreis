import { NextResponse } from "next/server";
import { requireOrg, getUser } from "@/lib/auth";
import pool from "@/lib/db";

export async function GET() {
  try {
    const org = await requireOrg();
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      firstName: user.first_name || "",
      lastName: user.last_name || "",
      email: user.email || "",
      phone: user.phone || "",
      position: user.position_title || "",
      company: org.name || "",
      vatId: org.vat_id || "",
      billingStreet: org.billing_street || "",
      billingCity: org.billing_city || "",
      billingZip: org.billing_zip || "",
      billingCountry: org.billing_country || "",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 403 });
  }
}

export async function PATCH(request: Request) {
  try {
    const org = await requireOrg();
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await request.json();
    const {
      firstName,
      lastName,
      phone,
      position,
      company,
      vatId,
      billingStreet,
      billingCity,
      billingZip,
      billingCountry,
    } = body;

    // Update user fields
    const fullName = [firstName, lastName].filter(Boolean).join(" ");
    await pool.query(
      `UPDATE users
       SET first_name = $1, last_name = $2, name = $3, phone = $4, position_title = $5
       WHERE id = $6`,
      [firstName || null, lastName || null, fullName || null, phone || null, position || null, user.id]
    );

    // Update organization fields
    await pool.query(
      `UPDATE organizations
       SET name = $1, vat_id = $2, billing_street = $3, billing_city = $4,
           billing_zip = $5, billing_country = $6, updated_at = NOW()
       WHERE id = $7`,
      [
        company || org.name,
        vatId || null,
        billingStreet || null,
        billingCity || null,
        billingZip || null,
        billingCountry || null,
        org.id,
      ]
    );

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 403 });
  }
}
