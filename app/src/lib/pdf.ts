// pdfkit is loaded at runtime only (not bundled by webpack)
// Install with: npm install pdfkit

interface ReportData {
  id: string;
  report_type: string;
  period_start: string;
  period_end: string;
  content_json: {
    title?: string;
    summary?: string;
    materials?: Array<{
      name: string;
      price_eur: number;
      unit: string;
      change_pct?: number;
      trend?: string;
    }>;
    [key: string]: any;
  };
  created_at: string;
}

function formatDeDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatDeNumber(n: number): string {
  return n.toLocaleString("de-DE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
function getPDFKit(): any {
  // Use eval to prevent webpack from trying to bundle pdfkit
  // pdfkit is a server-only runtime dependency installed via npm
  return eval('require')('pdfkit');
}

/** Generate a PDF buffer from a report row. */
export async function generateReportPdf(
  report: ReportData
): Promise<Buffer> {
  const PDFDocument = getPDFKit();

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: "A4",
      margins: { top: 60, bottom: 60, left: 50, right: 50 },
    });

    const chunks: Buffer[] = [];
    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const typeLabel =
      report.report_type === "daily"
        ? "Tagesbericht"
        : report.report_type === "weekly"
          ? "Wochenbericht"
          : "Monatsbericht";

    const periodStart = formatDeDate(report.period_start);
    const periodEnd = formatDeDate(report.period_end);
    const json = report.content_json;

    // Header
    doc.fontSize(20).font("Helvetica-Bold").text("BauPreis AI", { align: "left" });
    doc.moveDown(0.3);
    doc.fontSize(14).font("Helvetica").text(`${typeLabel}: ${periodStart} – ${periodEnd}`);
    doc.moveDown(0.5);

    // Divider
    doc
      .moveTo(50, doc.y)
      .lineTo(545, doc.y)
      .strokeColor("#e5e7eb")
      .stroke();
    doc.moveDown(0.5);

    // Summary
    if (json.summary) {
      doc.fontSize(11).font("Helvetica").text(json.summary, { width: 495 });
      doc.moveDown(1);
    }

    // Materials table
    if (json.materials && json.materials.length > 0) {
      doc.fontSize(13).font("Helvetica-Bold").text("Materialpreise");
      doc.moveDown(0.5);

      // Table header
      const tableTop = doc.y;
      const col = { name: 50, price: 250, unit: 350, change: 420, trend: 490 };

      doc.fontSize(9).font("Helvetica-Bold");
      doc.text("Material", col.name, tableTop);
      doc.text("Preis (EUR)", col.price, tableTop);
      doc.text("Einheit", col.unit, tableTop);
      doc.text("Änd. %", col.change, tableTop);
      doc.text("Trend", col.trend, tableTop);

      doc.moveDown(0.3);
      doc
        .moveTo(50, doc.y)
        .lineTo(545, doc.y)
        .strokeColor("#d1d5db")
        .stroke();
      doc.moveDown(0.3);

      // Table rows
      doc.fontSize(9).font("Helvetica");
      for (const mat of json.materials) {
        const y = doc.y;
        if (y > 750) {
          doc.addPage();
        }
        const rowY = doc.y;
        doc.text(mat.name, col.name, rowY, { width: 190 });
        doc.text(formatDeNumber(mat.price_eur), col.price, rowY);
        doc.text(mat.unit || "", col.unit, rowY);
        if (mat.change_pct !== undefined) {
          const sign = mat.change_pct > 0 ? "+" : "";
          doc.text(`${sign}${formatDeNumber(mat.change_pct)}%`, col.change, rowY);
        }
        if (mat.trend) {
          const trendLabel =
            mat.trend === "rising"
              ? "steigend"
              : mat.trend === "falling"
                ? "fallend"
                : "stabil";
          doc.text(trendLabel, col.trend, rowY);
        }
        doc.moveDown(0.6);
      }
    }

    // Footer
    const footerY = 780;
    doc
      .moveTo(50, footerY)
      .lineTo(545, footerY)
      .strokeColor("#e5e7eb")
      .stroke();
    doc
      .fontSize(8)
      .font("Helvetica")
      .fillColor("#9ca3af")
      .text(
        `BauPreis AI — Erstellt am ${formatDeDate(report.created_at)}`,
        50,
        footerY + 8,
        { align: "center", width: 495 }
      );

    doc.end();
  });
}
