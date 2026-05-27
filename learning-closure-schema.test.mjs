import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const sql = readFileSync("supabase/012_learning_closure_tables.sql", "utf8");

test("learning closure migration creates required daily learning tables", () => {
  for (const table of [
    "learning_settings",
    "daily_plans",
    "daily_plan_items",
    "mistake_notebook",
    "mastery_records",
    "parent_reports",
  ]) {
    assert.match(sql, new RegExp(`create table if not exists public\\.${table}`));
  }
});

test("learning closure migration extends question and answer records", () => {
  for (const column of [
    "grade_level",
    "standard_system",
    "standard_code",
    "skill",
    "difficulty_level",
    "choices",
    "correct_answer",
    "common_mistakes",
    "hint_steps",
    "variant_question",
  ]) {
    assert.match(sql, new RegExp(`add column if not exists ${column}`));
  }

  for (const column of ["daily_plan_item_id", "confidence", "mistake_type", "ai_feedback", "time_spent_seconds"]) {
    assert.match(sql, new RegExp(`add column if not exists ${column}`));
  }
});

test("learning closure migration protects student learning rows with family RLS", () => {
  assert.match(sql, /enable row level security/);
  assert.match(sql, /parent_student_links/);
  assert.match(sql, /auth\.uid\(\)/);
  assert.match(sql, /create or replace view public\.users_profile/);
});
