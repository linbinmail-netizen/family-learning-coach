import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const sql = readFileSync(new URL("./supabase/011_practice_sessions.sql", import.meta.url), "utf8");

test("practice sessions table stores student learning behavior", () => {
  assert.match(sql, /create table if not exists public\.practice_sessions/);
  for (const column of ["local_session_id", "student_id", "subject_id", "skill", "questions_answered", "correct_count", "hints_used", "difficulty_start", "difficulty_end", "slow_count", "guessing_count"]) {
    assert.match(sql, new RegExp(column));
  }
  assert.match(sql, /unique \(student_id, local_session_id\)/);
});

test("practice sessions are protected by family roles", () => {
  assert.match(sql, /alter table public\.practice_sessions enable row level security/);
  assert.match(sql, /Practice sessions: parent can manage linked students/);
  assert.match(sql, /Practice sessions: student can manage own sessions/);
  assert.match(sql, /parent_student_links/);
  assert.match(sql, /user_profiles/);
});
