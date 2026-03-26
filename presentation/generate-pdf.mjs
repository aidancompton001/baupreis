import puppeteer from "puppeteer";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const htmlPath = path.join(__dirname, "index.html");
const pdfPath = path.join(__dirname, "BauPreis_AI_Pitch_Deck_2026.pdf");

async function main() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(`file://${htmlPath}`, { waitUntil: "networkidle0", timeout: 30000 });

  await page.pdf({
    path: pdfPath,
    width: "297mm",
    height: "210mm",
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    preferCSSPageSize: true,
  });

  await browser.close();
  console.log(`PDF saved: ${pdfPath}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
