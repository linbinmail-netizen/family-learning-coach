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
  assert.equal(typeof body.openAiConfigured, "boolean");
  assert.equal(typeof body.digestEmailFromConfigured, "boolean");
  assert.equal(typeof body.scheduledDigestConfigured, "boolean");
  assert.equal(typeof body.supabaseServiceConfigured, "boolean");
  assert.equal(typeof body.parentDigestEmailConfigured, "boolean");
  assert.equal(body.learningApiConfigured, true);
  assert.equal(body.databaseSetupReady, true);
  assert.equal(Array.isArray(body.launchChecklist), true);
  assert.deepEqual(
    body.launchChecklist.map((item) => item.id),
    ["database", "learning-api", "openai", "email"]
  );
  assert.deepEqual(body.requiredSupabaseScripts, [
    "000_run_all_learning_platform.sql",
    "001_base_learning_schema.sql",
    "003_seed_starter_questions.sql",
    "004_auth_and_plans.sql",
    "005_family_auth_helpers.sql",
    "009_mistake_reviews.sql",
    "010_skill_mastery.sql",
    "011_practice_sessions.sql",
    "012_learning_closure_tables.sql",
  ]);
});
