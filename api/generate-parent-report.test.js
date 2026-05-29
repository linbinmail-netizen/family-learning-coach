import test from "node:test";
import assert from "node:assert/strict";
import { buildParentReport } from "./generate-parent-report.js";

test("parent report is generated from real learning records", () => {
  const report = buildParentReport({
    studentName: "MIA",
    minutesSpent: 28,
    answers: [
      { is_correct: true, confidence: "sure" },
      { is_correct: false, confidence: "unsure" },
      { is_correct: false, confidence: "guess" },
    ],
    mistakes: [
      { skill: "linear relationships", mistake_type: "concept_gap" },
      { skill: "linear relationships", mistake_type: "guessed" },
      { skill: "reading evidence", mistake_type: "reading_comprehension" },
    ],
    mastery: [{ skill: "linear relationships", mastery_score: 45 }],
  });

  assert.match(report.summary, /MIA/);
  assert.equal(report.completedTasks, 3);
  assert.equal(report.accuracy, 33);
  assert.deepEqual(report.weakSkills.slice(0, 2), ["linear relationships", "reading evidence"]);
  assert.match(report.nextSteps.join(" "), /linear relationships/);
});

test("parent report can summarize session records when individual answers are not supplied", () => {
  const report = buildParentReport({
    studentName: "EVA",
    sessions: [{ questions_answered: 6, correct_count: 5, minutes_spent: 31 }],
  });

  assert.equal(report.completedTasks, 6);
  assert.equal(report.accuracy, 83);
  assert.match(report.nextSteps.join(" "), /难度合适/);
});

test("parent report treats frequent unsure correct answers as a verification need", () => {
  const report = buildParentReport({
    studentName: "MIA",
    answers: [
      { is_correct: true, confidence: "guess" },
      { is_correct: true, confidence: "unsure" },
      { is_correct: true, confidence: "sure" },
    ],
    sessions: [{ questions_answered: 3, correct_count: 3, guessing_count: 2, slow_count: 0 }],
  });

  const nextSteps = report.nextSteps.join(" ");
  assert.match(nextSteps, /减少纯选择题/);
  assert.match(nextSteps, /解释验证|方法复述/);
  assert.doesNotMatch(nextSteps, /难度偏高/);
});
