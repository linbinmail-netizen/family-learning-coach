import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const requiredRoutes = [
  "student/:id/dashboard",
  "student/:id/daily-plan",
  "student/:id/generate-plan",
  "answer/submit",
  "api/coach-feedback.js",
  "mistake/review",
  "student/:id/mistakes",
  "student/:id/mastery-report",
  "api/generate-parent-report.js",
  "learning-settings/update",
];

test("execution plan API route checklist is covered without exceeding Vercel Hobby function limits", () => {
  assert.equal(existsSync("api/learning.js"), true);
  assert.equal(existsSync("api/coach-feedback.js"), true);
  assert.equal(existsSync("api/generate-parent-report.js"), true);
  assert.equal(existsSync(".vercelignore"), true);
});

test("unified learning API maps every execution-plan route to shared learning logic", () => {
  const content = readFileSync("api/learning.js", "utf8");
  const vercelConfig = readFileSync("vercel.json", "utf8");
  for (const route of requiredRoutes.filter((route) => !route.startsWith("api/"))) {
    for (const part of route.split("/").filter((part) => !part.startsWith(":"))) {
      assert.match(vercelConfig, new RegExp(part.replace("-", "\\-")), `${route} should be rewritten`);
    }
  }
  assert.match(content, /buildStudentDashboard/);
  assert.match(content, /generateDailyPlan/);
  assert.match(content, /submitAnswerRecord/);
  assert.match(content, /reviewMistakeRecord/);
  assert.match(content, /buildMasteryReport/);
  assert.match(content, /updateLearningSettings/);
});
