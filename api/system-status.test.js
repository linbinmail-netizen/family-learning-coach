import test from "node:test";
import assert from "node:assert/strict";
import handler from "./system-status.js";

function mockResponse() {
  return {
    statusCode: 0,
    headers: {},
    body: "",
    setHeader(key, value) {
      this.headers[key] = value;
    },
    end(value) {
      this.body = value;
    },
  };
}

test("system status reports production readiness flags", () => {
  const response = mockResponse();
  handler({}, response);
  const body = JSON.parse(response.body);

  assert.equal(response.statusCode, 200);
  assert.equal(typeof body.emailConfigured, "boolean");
  assert.equal(typeof body.digestEmailFromConfigured, "boolean");
  assert.equal(typeof body.scheduledDigestConfigured, "boolean");
  assert.equal(typeof body.supabaseServiceConfigured, "boolean");
  assert.equal(typeof body.parentDigestEmailConfigured, "boolean");
  assert.deepEqual(body.requiredSupabaseScripts, ["010_skill_mastery.sql", "011_practice_sessions.sql"]);
});
