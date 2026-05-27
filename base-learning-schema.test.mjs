import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const baseSql = readFileSync("supabase/001_base_learning_schema.sql", "utf8");
const combinedSql = readFileSync("supabase/000_run_all_learning_platform.sql", "utf8");

test("base learning schema creates required foundation tables", () => {
  for (const table of [
    "students",
    "subjects",
    "knowledge_points",
    "diagnostic_sessions",
    "mastery_results",
    "learning_activities",
  ]) {
    assert.match(baseSql, new RegExp(`create table if not exists public\\.${table}`));
  }
});

test("base learning schema seeds MIA EVA and priority subjects", () => {
  assert.match(baseSql, /'MIA'/);
  assert.match(baseSql, /'EVA'/);
  assert.match(baseSql, /'8th Grade Math'/);
  assert.match(baseSql, /'English I'/);
  assert.match(baseSql, /'SAT\/PSAT Foundation'/);
});

test("combined Supabase setup contains every production script in order", () => {
  const order = [
    "001_base_learning_schema.sql",
    "003_seed_starter_questions.sql",
    "004_auth_and_plans.sql",
    "005_family_auth_helpers.sql",
    "009_mistake_reviews.sql",
    "010_skill_mastery.sql",
    "011_practice_sessions.sql",
    "012_learning_closure_tables.sql",
  ];
  let lastIndex = -1;
  for (const file of order) {
    const index = combinedSql.indexOf(file);
    assert.ok(index > lastIndex, `${file} should appear after the previous script`);
    lastIndex = index;
  }
});
