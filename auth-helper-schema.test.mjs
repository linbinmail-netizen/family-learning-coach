import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const sql = readFileSync(new URL("./supabase/005_family_auth_helpers.sql", import.meta.url), "utf8");

test("family auth helper functions exist", () => {
  assert.match(sql, /function public\.ensure_my_profile/);
  assert.match(sql, /function public\.ensure_family_links/);
  assert.match(sql, /function public\.get_my_family_students/);
});

test("parent helper links MIA and EVA safely", () => {
  assert.match(sql, /role <> 'parent'/);
  assert.match(sql, /display_name in \('MIA', 'EVA'\)/);
  assert.match(sql, /on conflict \(parent_user_id, student_id\) do nothing/);
});

test("helpers are available to authenticated users only", () => {
  assert.match(sql, /grant execute on function public\.ensure_my_profile\(\) to authenticated/);
  assert.match(sql, /grant execute on function public\.ensure_family_links\(\) to authenticated/);
  assert.match(sql, /grant execute on function public\.get_my_family_students\(\) to authenticated/);
});
