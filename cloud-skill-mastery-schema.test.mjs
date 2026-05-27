import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const sql = readFileSync(new URL("./supabase/010_skill_mastery.sql", import.meta.url), "utf8");

test("skill mastery table stores long-term mastery by student subject and skill", () => {
  assert.match(sql, /create table if not exists public\.skill_mastery/);
  for (const column of ["student_id", "subject_id", "skill", "mastery", "attempts", "correct_count", "review_count", "accuracy", "status", "last_practiced_at"]) {
    assert.match(sql, new RegExp(column));
  }
  assert.match(sql, /unique \(student_id, subject_id, skill\)/);
});

test("skill mastery rows are protected by family roles", () => {
  assert.match(sql, /alter table public\.skill_mastery enable row level security/);
  assert.match(sql, /Skill mastery: parent can manage linked students/);
  assert.match(sql, /Skill mastery: student can manage own mastery/);
  assert.match(sql, /parent_student_links/);
  assert.match(sql, /user_profiles/);
});
