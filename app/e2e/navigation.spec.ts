import { test, expect } from "@playwright/test";

const PUBLIC_PAGES = [
  { path: "/", titleContains: "BauPreis" },
  { path: "/preise", titleContains: "BauPreis" },
  { path: "/kontakt", titleContains: "BauPreis" },
  { path: "/ueber-uns", titleContains: "BauPreis" },
  { path: "/blog", titleContains: "BauPreis" },
  { path: "/datenschutz", titleContains: "BauPreis" },
  { path: "/impressum", titleContains: "BauPreis" },
  { path: "/agb", titleContains: "BauPreis" },
];

test.describe("Public pages navigation", () => {
  for (const { path, titleContains } of PUBLIC_PAGES) {
    test(`${path} returns 200`, async ({ page }) => {
      const response = await page.goto(path);
      expect(response).not.toBeNull();
      expect(response!.status()).toBe(200);
    });

    test(`${path} has proper title containing "${titleContains}"`, async ({
      page,
    }) => {
      await page.goto(path);
      const title = await page.title();
      expect(title).toContain(titleContains);
    });
  }

  test("navigation links on landing page work", async ({ page }) => {
    await page.goto("/");

    // Desktop nav links (hidden on mobile via md:flex)
    const preiseLink = page.locator('nav a[href="/preise"]');
    await expect(preiseLink).toBeAttached();

    const ueberUnsLink = page.locator('nav a[href="/ueber-uns"]');
    await expect(ueberUnsLink).toBeAttached();

    // Footer links
    const impressumLink = page.locator('footer a[href="/impressum"]');
    await expect(impressumLink).toBeVisible();

    const datenschutzLink = page.locator('footer a[href="/datenschutz"]');
    await expect(datenschutzLink).toBeVisible();

    const agbLink = page.locator('footer a[href="/agb"]');
    await expect(agbLink).toBeVisible();
  });
});
