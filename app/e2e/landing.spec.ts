import { test, expect } from "@playwright/test";

test.describe("Landing page", () => {
  test("loads with 200 status", async ({ page }) => {
    const response = await page.goto("/");
    expect(response).not.toBeNull();
    expect(response!.status()).toBe(200);
  });

  test('contains "BauPreis" text', async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("body")).toContainText("BauPreis");
  });

  test("pricing section is visible", async ({ page }) => {
    await page.goto("/");
    // The landing page has a pricing preview section with plan prices
    const pricingHeading = page.locator("text=€49");
    await expect(pricingHeading.first()).toBeVisible();
    const proPrice = page.locator("text=€149");
    await expect(proPrice.first()).toBeVisible();
    const teamPrice = page.locator("text=€299");
    await expect(teamPrice.first()).toBeVisible();
  });

  test("CTA button exists and links to sign-up", async ({ page }) => {
    await page.goto("/");
    const ctaLink = page.locator('a[href="/sign-up"]').first();
    await expect(ctaLink).toBeVisible();
  });

  test("mobile viewport: hamburger menu button visible", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");
    const hamburger = page.locator('button[aria-label]').filter({
      has: page.locator("span.block"),
    });
    await expect(hamburger.first()).toBeVisible();
  });
});
