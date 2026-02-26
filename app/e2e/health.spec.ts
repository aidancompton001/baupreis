import { test, expect } from "@playwright/test";

test.describe("Health endpoint", () => {
  test("GET /api/health returns 200", async ({ request }) => {
    const response = await request.get("/api/health");
    expect(response.status()).toBe(200);
  });

  test("response is JSON with status ok", async ({ request }) => {
    const response = await request.get("/api/health");
    const body = await response.json();
    expect(body).toHaveProperty("status", "ok");
  });

  test("response contains database: true check", async ({ request }) => {
    const response = await request.get("/api/health");
    const body = await response.json();
    expect(body).toHaveProperty("checks");
    expect(body.checks).toHaveProperty("database", true);
  });
});
