import { test, expect } from "@playwright/test";

const PROTECTED_ROUTES = [
  "/dashboard",
  "/alerts",
  "/einstellungen",
];

test.describe("Auth protection — redirects to sign-in", () => {
  for (const route of PROTECTED_ROUTES) {
    test(`${route} redirects to /sign-in`, async ({ page }) => {
      // Follow redirects and check final URL
      await page.goto(route, { waitUntil: "commit" });
      const url = new URL(page.url());
      expect(url.pathname).toBe("/sign-in");
    });

    test(`${route} redirect includes original path in query`, async ({
      page,
    }) => {
      await page.goto(route, { waitUntil: "commit" });
      const url = new URL(page.url());
      expect(url.searchParams.get("redirect")).toBe(route);
    });
  }
});
