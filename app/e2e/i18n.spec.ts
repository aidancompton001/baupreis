import { test, expect } from "@playwright/test";

test.describe("Internationalization (i18n)", () => {
  test("default language is German", async ({ page }) => {
    await page.goto("/");
    const html = page.locator("html");
    await expect(html).toHaveAttribute("lang", "de");
    // Verify German text is present (nav pricing label = "Preise")
    await expect(page.locator("body")).toContainText("Preise");
  });

  test("setting locale cookie to 'en' changes language", async ({
    page,
    context,
  }) => {
    await context.addCookies([
      {
        name: "locale",
        value: "en",
        domain: "localhost",
        path: "/",
      },
    ]);
    await page.goto("/");
    const html = page.locator("html");
    await expect(html).toHaveAttribute("lang", "en");
    // Verify English text is present (nav pricing label = "Pricing")
    await expect(page.locator("body")).toContainText("Pricing");
  });

  test("setting locale cookie to 'ru' changes language", async ({
    page,
    context,
  }) => {
    await context.addCookies([
      {
        name: "locale",
        value: "ru",
        domain: "localhost",
        path: "/",
      },
    ]);
    await page.goto("/");
    const html = page.locator("html");
    await expect(html).toHaveAttribute("lang", "ru");
  });
});
