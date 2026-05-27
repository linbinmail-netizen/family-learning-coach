import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const requiredRoutes = [
  "api/student/[id]/dashboard.js",
  "api/student/[id]/daily-plan.js",
  "api/student/[id]/generate-plan.js",
  "api/answer/submit.js",
  "api/coach-feedback.js",
  "api/mistake/review.js",
  "api/student/[id]/mistakes.js",
  "api/student/[id]/mastery-report.js",
  "api/generate-parent-report.js",
  "api/learning-settings/update.js",
];

test("execution plan API route checklist is present", () => {
  for (const route of requiredRoutes) {
    assert.equal(existsSync(route), true, `${route} should exist`);
  }
});

test("new API routes use shared learning logic instead of fixed page text", () => {
  for (const route of requiredRoutes.filter((route) => !route.includes("coach-feedback") && !route.includes("generate-parent-report"))) {
    const content = readFileSync(route, "utf8");
    assert.match(content, /learning-core|buildStudentDashboard|generateDailyPlan|submitAnswerRecord|reviewMistakeRecord|buildMasteryReport|updateLearningSettings/);
  }
});
