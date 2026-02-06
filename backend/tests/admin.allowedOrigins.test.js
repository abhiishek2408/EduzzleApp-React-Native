/* eslint-disable no-undef */
import assert from "assert";
import request from "supertest";

(async () => {
  // Ensure test env before importing server
  process.env.NODE_ENV = "test";
  process.env.ADMIN_TOKEN = "test-admin-token";
  process.env.ALLOWED_ORIGINS = "http://localhost:8081";

  const { app, allowedOrigins } = await import("../server.js");

  describe("GET /api/admin/allowed-origins", function () {
    it("returns allowed origins when authorized", async function () {
      const res = await request(app)
        .get("/api/admin/allowed-origins")
        .set("x-admin-token", "test-admin-token")
        .expect(200);

      assert.ok(Array.isArray(res.body.allowedOrigins));
      assert.deepStrictEqual(res.body.allowedOrigins, allowedOrigins);
    });

    it("returns 401 when unauthorized", async function () {
      await request(app).get("/api/admin/allowed-origins").expect(401);
    });
  });

  // Run the tests when this file is executed directly by mocha
  if (require.main === module) {
    // noop — mocha will run the suite
  }
})();
