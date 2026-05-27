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
