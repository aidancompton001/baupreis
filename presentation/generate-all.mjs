import puppeteer from "puppeteer";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const files = [
  { html: "index-en.html", pdf: "BauPreis_AI_Pitch_Deck_2026_EN.pdf" },
  { html: "index-ru.html", pdf: "BauPreis_AI_Pitch_Deck_2026_RU.pdf" },
];

async function main() {
  const browser = await puppeteer.launch({ headless: true });

  for (const { html, pdf } of files) {
    const page = await browser.newPage();
    const htmlPath = path.join(__dirname, html);
    const pdfPath = path.join(__dirname, pdf);

    await page.goto(`file://${htmlPath}`, { waitUntil: "networkidle0", timeout: 30000 });

    await page.pdf({
      path: pdfPath,
      width: "297mm",
      height: "210mm",
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      preferCSSPageSize: true,
    });

    await page.close();
    console.log(`PDF saved: ${pdfPath}`);
  }

  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
