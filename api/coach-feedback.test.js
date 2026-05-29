import test from "node:test";
import assert from "node:assert/strict";
import {
  allowedMistakeTypes,
  buildCoachFeedbackRequest,
  buildFallbackCoachFeedback,
  detectMistakeType,
  parseCoachFeedback,
} from "./coach-feedback.js";

test("coach feedback returns strict learning-diagnosis fields", () => {
  const feedback = buildFallbackCoachFeedback({
    question: "A taxi charges $4 plus $2 per mile.",
    studentAnswer: "B",
    confidence: "unsure",
    skill: "linear relationships",
    commonMistakes: {
      B: "Confused fixed fee and rate",
    },
    hintSteps: ["Find the starting fee.", "Find what changes each mile."],
  });

  assert.equal(feedback.mistakeType, "concept_gap");
  assert.equal(feedback.diagnosis, "Confused fixed fee and rate");
  assert.match(feedback.restatePrompt, /不要只写答案/);
  assert.ok(feedback.variantPrompt);
  assert.ok(allowedMistakeTypes.includes(feedback.mistakeType));
});

test("coach feedback marks guessed or stuck replies differently", () => {
  assert.equal(detectMistakeType({ confidence: "guess", studentExplanation: "idk" }), "guessed");
});

test("coach feedback OpenAI request requires JSON and blocks final answers", () => {
  const payload = buildCoachFeedbackRequest({ skill: "linear relationships" });
  assert.match(payload.instructions, /Return strict JSON only/);
  assert.match(payload.instructions, /Do not directly reveal the final answer/);
  assert.match(payload.instructions, /mistakeType must be one of/);
});

test("coach feedback teaches first when a student cannot explain the concept", () => {
  const feedback = buildFallbackCoachFeedback({
    question: "Which evidence best supports the claim?",
    studentAnswer: "我知识点没吃透，打不出来",
    studentExplanation: "我知识点没吃透，打不出来",
    confidence: "unsure",
    skill: "evidence support",
  });
  const payload = buildCoachFeedbackRequest({
    studentExplanation: "知识点没吃透，人家也打不出来",
    skill: "evidence support",
  });

  assert.match(feedback.hintLevel1, /小讲解|先讲|证据|支持/);
  assert.match(feedback.restatePrompt, /只做一小步|补一个空|二选一/);
  assert.match(payload.instructions, /知识点没吃透/);
  assert.match(payload.instructions, /先讲清概念/);
  assert.doesNotMatch(payload.instructions, /Use Socratic hints before giving explanations/);
});

test("coach feedback parser normalizes invalid mistake types", () => {
  const parsed = parseCoachFeedback({
    output_text: JSON.stringify({
      mistakeType: "random",
      diagnosis: "Needs help.",
      hintLevel1: "Find the fixed amount.",
      hintLevel2: "Find the rate.",
      restatePrompt: "Explain the first step.",
      variantPrompt: "Try a similar equation.",
      parentNote: "Practice fixed fee vs rate.",
    }),
  });

  assert.equal(parsed.mistakeType, "unclear");
  assert.equal(parsed.hintLevel1, "Find the fixed amount.");
});
