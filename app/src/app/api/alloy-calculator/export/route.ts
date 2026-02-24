import { requireOrg, canAccess } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import {
  ALLOYS,
  BASE_METALS,
  LAST_PRICE_UPDATE,
  calculateAlloyPrice,
  PRODUCT_FORM_LABELS,
  type ProductForm,
} from "@/lib/alloys";

function getPDFKit(): any {
  return eval("require")("pdfkit");
}

function fmtDe(n: number): string {
  return n.toLocaleString("de-DE", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function fmtPct(n: number): string {
  return (n * 100).toFixed(1).replace(".", ",") + "%";
}

export async function GET(req: NextRequest) {
  try {
    const org = await requireOrg();
    if (!canAccess(org, "forecast")) {
      return NextResponse.json(
        { error: "Legierungsrechner ist ab dem Pro-Plan verfügbar." },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const alloyCode = searchParams.get("code");
    const productForm = (searchParams.get("form") || "blech") as ProductForm;
    const weightKg = Math.max(1, Math.min(1_000_000, Number(searchParams.get("weight")) || 1000));

    if (!alloyCode) {
      return NextResponse.json({ error: "code parameter fehlt." }, { status: 400 });
    }

    const result = calculateAlloyPrice(alloyCode, productForm, weightKg);
    if (!result) {
      return NextResponse.json({ error: "Legierung nicht gefunden." }, { status: 404 });
    }

    const PDFDocument = getPDFKit();
    const pdfBuffer = await new Promise<Buffer>((resolve, reject) => {
      const doc = new PDFDocument({
        size: "A4",
        margins: { top: 50, bottom: 50, left: 50, right: 50 },
      });

      const chunks: Buffer[] = [];
      doc.on("data", (chunk: Buffer) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", reject);

      const alloy = result.alloy;
      const formLabel = PRODUCT_FORM_LABELS[productForm]?.de || productForm;

      // --- Header ---
      doc.fontSize(18).font("Helvetica-Bold").text("BauPreis AI — Legierungsrechner");
      doc.moveDown(0.3);
      doc.fontSize(10).font("Helvetica").fillColor("#6b7280")
        .text(`Erstellt am ${new Date().toLocaleDateString("de-DE")} | Preisstand: ${LAST_PRICE_UPDATE}`);
      doc.moveDown(0.5);
      doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor("#e5e7eb").stroke();
      doc.moveDown(0.8);

      // --- Alloy Info ---
      doc.fillColor("#111827");
      doc.fontSize(14).font("Helvetica-Bold").text(alloy.nameDE);
      doc.moveDown(0.2);
      doc.fontSize(10).font("Helvetica").fillColor("#6b7280");
      const infoLine = [alloy.din, alloy.aisi ? `AISI ${alloy.aisi}` : "", alloy.standard].filter(Boolean).join(" | ");
      doc.text(infoLine);
      doc.text(`Produktform: ${formLabel} | Gewicht: ${weightKg.toLocaleString("de-DE")} kg`);
      doc.moveDown(1);

      // --- Price Box ---
      const boxY = doc.y;
      doc.rect(50, boxY, 495, 60).fillColor("#eff6ff").fill();
      doc.fillColor("#1e40af").fontSize(12).font("Helvetica-Bold")
        .text("Preisspanne", 70, boxY + 10);
      doc.fontSize(20).font("Helvetica-Bold")
        .text(`${fmtDe(result.totalPerTonneMin)} — ${fmtDe(result.totalPerTonneMax)} EUR/t`, 70, boxY + 28);
      if (weightKg !== 1000) {
        doc.fontSize(10).font("Helvetica").fillColor("#374151")
          .text(`= ${fmtDe(result.totalForWeight)} EUR für ${weightKg.toLocaleString("de-DE")} kg`, 350, boxY + 35);
      }
      doc.y = boxY + 70;
      doc.moveDown(0.5);

      // --- LZ Section (stainless only) ---
      if (result.legierungszuschlag != null) {
        doc.fillColor("#111827").fontSize(11).font("Helvetica-Bold").text("Legierungszuschlag-System");
        doc.moveDown(0.3);
        doc.fontSize(9).font("Helvetica").fillColor("#374151");
        const bpMin = result.basispreis?.min || 0;
        const bpMax = result.basispreis?.max || 0;
        doc.text(`Basispreis: ${fmtDe(bpMin)} — ${fmtDe(bpMax)} EUR/t`);
        doc.text(`Legierungszuschlag: ${fmtDe(result.legierungszuschlag)} EUR/t${result.publishedLZ ? " (veröffentlicht)" : " (berechnet)"}`);
        doc.text(`Metallwert: ${fmtDe(result.metallwert)} EUR/t`);
        doc.moveDown(0.8);
      }

      // --- Scrap Section (carbon steel) ---
      if (result.scrapBasis != null) {
        doc.fillColor("#111827").fontSize(11).font("Helvetica-Bold").text("Schrottbasierte Preisbildung");
        doc.moveDown(0.3);
        doc.fontSize(9).font("Helvetica").fillColor("#374151");
        doc.text(`Schrottbasispreis: ${fmtDe(result.scrapBasis)} EUR/t`);
        doc.text(`Verarbeitungsfaktor: ${result.processingMultiplier.toFixed(1)}x`);
        doc.moveDown(0.8);
      }

      // --- Element Breakdown Table ---
      doc.fillColor("#111827").fontSize(11).font("Helvetica-Bold").text("Zusammensetzung & Metallwert");
      doc.moveDown(0.4);

      const col = { el: 50, share: 150, price: 250, contrib: 400 };
      const tableTop = doc.y;

      doc.fontSize(8).font("Helvetica-Bold").fillColor("#6b7280");
      doc.text("Element", col.el, tableTop);
      doc.text("Anteil", col.share, tableTop);
      doc.text("Metallpreis (EUR/t)", col.price, tableTop);
      doc.text("Beitrag (EUR/t)", col.contrib, tableTop);
      doc.moveDown(0.3);
      doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor("#d1d5db").stroke();
      doc.moveDown(0.3);

      doc.fontSize(9).font("Helvetica").fillColor("#374151");
      for (const el of result.elementBreakdown) {
        if (doc.y > 720) doc.addPage();
        const rowY = doc.y;
        const metalName = BASE_METALS[el.element]?.nameDE || el.element;
        doc.text(`${el.element} (${metalName})`, col.el, rowY, { width: 95 });
        doc.text(fmtPct(el.fraction), col.share, rowY);
        doc.text(fmtDe(el.pricePerTonne), col.price, rowY);
        doc.font("Helvetica-Bold").text(fmtDe(el.contribution), col.contrib, rowY);
        doc.font("Helvetica");
        doc.moveDown(0.5);
      }

      // Metallwert total row
      doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor("#d1d5db").stroke();
      doc.moveDown(0.3);
      const totalY = doc.y;
      doc.fontSize(9).font("Helvetica-Bold").fillColor("#111827");
      doc.text("Metallwert gesamt", col.el, totalY);
      doc.text(`${fmtDe(result.metallwert)} EUR/t`, col.contrib, totalY);
      doc.moveDown(1.5);

      // --- Disclaimer ---
      if (doc.y > 680) doc.addPage();
      const disclaimerY = doc.y;
      doc.rect(50, disclaimerY, 495, 55).fillColor("#fffbeb").fill();
      doc.fillColor("#92400e").fontSize(8).font("Helvetica-Bold")
        .text("Haftungsausschluss", 60, disclaimerY + 8);
      doc.font("Helvetica").fontSize(7).fillColor("#78350f")
        .text(
          "Die berechneten Preise sind Richtwerte basierend auf aktuellen Börsenpreisen und typischen Verarbeitungsaufschlägen. " +
          "Tatsächliche Marktpreise können je nach Lieferant, Bestellmenge, Produktform und Marktlage um ±20–40% abweichen. Keine Finanzberatung.",
          60, disclaimerY + 22, { width: 475 }
        );

      // --- Footer ---
      doc.moveTo(50, 780).lineTo(545, 780).strokeColor("#e5e7eb").stroke();
      doc.fontSize(7).font("Helvetica").fillColor("#9ca3af")
        .text("BauPreis AI — baupreis.ais152.com — Legierungsrechner", 50, 788, { align: "center", width: 495 });

      doc.end();
    });

    const filename = `BauPreis_Legierung_${alloyCode.replace(/\s+/g, "_")}_${productForm}.pdf`;

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error: any) {
    if (["No organization found", "Trial expired", "Subscription cancelled"].includes(error.message)) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 });
  }
}
