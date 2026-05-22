import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const sql = readFileSync(new URL("./supabase/009_mistake_reviews.sql", import.meta.url), "utf8");

test("mistake review table stores long-term student mistakes", () => {
  assert.match(sql, /create table if not exists public\.mistake_reviews/);
  for (const column of ["student_id", "subject_id", "question_key", "prompt", "skill", "attempts", "resolved"]) {
    assert.match(sql, new RegExp(column));
  }
  assert.match(sql, /unique \(student_id, subject_id, question_key\)/);
});

test("mistake review rows are protected by family roles", () => {
  assert.match(sql, /alter table public\.mistake_reviews enable row level security/);
  assert.match(sql, /Mistakes: parent can manage linked students/);
  assert.match(sql, /Mistakes: student can manage own mistakes/);
  assert.match(sql, /parent_student_links/);
  assert.match(sql, /user_profiles/);
});
