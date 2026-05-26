import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const sql = readFileSync(new URL("./supabase/004_auth_and_plans.sql", import.meta.url), "utf8");

test("auth and plan tables are defined", () => {
  for (const table of ["user_profiles", "parent_student_links", "study_plan_settings", "daily_task_progress"]) {
    assert.match(sql, new RegExp(`create table if not exists public\\.${table}`));
  }
});

test("auth trigger creates user profile", () => {
  assert.match(sql, /handle_new_auth_user/);
  assert.match(sql, /after insert on auth\.users/);
  assert.match(sql, /raw_user_meta_data/);
});

test("RLS policies protect parent and student data", () => {
  assert.match(sql, /enable row level security/);
  assert.match(sql, /auth\.uid\(\)/);
  assert.match(sql, /parent_user_id = \(select auth\.uid\(\)\)/);
  assert.match(sql, /profile\.student_id = study_plan_settings\.student_id/);
});
