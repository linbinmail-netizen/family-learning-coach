import test from "node:test";
import assert from "node:assert/strict";
import {
  buildMasteryReport,
  buildStudentDashboard,
  generateDailyPlan,
  reviewMistakeRecord,
  submitAnswerRecord,
  updateLearningSettings,
} from "./learning-core.js";

test("daily plan prioritizes weak skills and creates usable tasks", () => {
  const plan = generateDailyPlan({
    studentId: "mia",
    settings: { dailyQuestionCount: 2, focusSubjects: ["Reading", "Math"] },
    mastery: [{ skill: "linear relationships", masteryScore: 45 }],
  });

  assert.equal(plan.studentId, "mia");
  assert.equal(plan.items.length, 2);
  assert.equal(plan.items[0].skill, "linear relationships");
  assert.equal(plan.items[0].status, "not_started");
});

test("student dashboard shows progress xp level and next action from records", () => {
  const dashboard = buildStudentDashboard({
    studentId: "eva",
    answers: [{ isCorrect: true }, { isCorrect: false }],
    mistakes: [{ skill: "text evidence", reviewStatus: "needs_review" }],
    mastery: [{ skill: "text evidence", masteryScore: 55 }],
    xp: 95,
  });

  assert.equal(dashboard.progress.answered, 2);
  assert.equal(dashboard.progress.accuracy, 50);
  assert.ok(dashboard.level >= 2);
  assert.match(dashboard.nextAction, /text evidence/);
});

test("answer submit records wrong answers and creates a mistake notebook entry", () => {
  const result = submitAnswerRecord({
    studentId: "mia",
    studentAnswer: "B",
    confidence: "guess",
    question: {
      id: "q1",
      subject: "Math",
      skill: "linear relationships",
      correctAnswer: "A",
      hintSteps: ["Find fixed amount."],
    },
  });

  assert.equal(result.isCorrect, false);
  assert.equal(result.mistakeType, "guessed");
  assert.equal(result.mistakeNotebookEntry.reviewStatus, "needs_review");
});

test("mistake review marks mastered after two passed variants", () => {
  const result = reviewMistakeRecord({
    mistake: { correctVariantCount: 1, reviewStatus: "reviewed" },
    variantPassed: true,
  });

  assert.equal(result.reviewStatus, "mastered");
});

test("mastery report gives reliability and seven day plan from real records", () => {
  const report = buildMasteryReport({
    answers: Array.from({ length: 6 }, (_, index) => ({ isCorrect: index < 4 })),
    mistakes: [{ skill: "linear relationships", mistakeType: "concept_gap" }],
    mastery: [{ skill: "linear relationships", masteryScore: 50 }],
  });

  assert.equal(report.reliability, "early_signal");
  assert.equal(report.weakSkills[0], "linear relationships");
  assert.ok(report.sevenDayPlan.length >= 1);
});

test("learning settings update clamps values and keeps valid strategy", () => {
  const settings = updateLearningSettings({}, {
    dailyMinutes: 300,
    dailyQuestionCount: 0,
    difficultyStrategy: "challenge",
    focusSubjects: ["Math"],
  });

  assert.equal(settings.dailyMinutes, 180);
  assert.equal(settings.dailyQuestionCount, 1);
  assert.equal(settings.difficultyStrategy, "challenge");
  assert.deepEqual(settings.focusSubjects, ["Math"]);
});
