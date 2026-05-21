import test from "node:test";
import assert from "node:assert/strict";

import { buildFallbackReply, buildTutorRequest, extractOpenAIText, getLearningStep } from "./coach.js";

const baseBody = {
  studentName: "MIA",
  grade: "9",
  subject: "English I",
  question: "Before choosing evidence for an answer, what should you identify?",
  answers: ["The longest sentence", "The central idea or claim", "The paragraph number", "The author name only"],
  skill: "识别中心观点",
  studentReply: "I think I need to understand the question first.",
  history: [
    { role: "coach", text: "我们先不急着选答案。" },
    { role: "student", text: "I think I need to understand the question first." },
  ],
};

test("getLearningStep advances through the tutoring sequence", () => {
  assert.equal(getLearningStep([]).id, "understand");
  assert.equal(getLearningStep([{ role: "student", text: "I see the question." }]).id, "keywords");
  assert.equal(
    getLearningStep([
      { role: "student", text: "I see the question." },
      { role: "student", text: "central idea is important" },
    ]).id,
    "eliminate"
  );
});

test("buildTutorRequest includes the five-step rule and blocks direct answers", () => {
  const request = buildTutorRequest(baseBody);
  const text = JSON.stringify(request);

  assert.match(text, /理解题意/);
  assert.match(text, /找关键词/);
  assert.match(text, /排除错误选项/);
  assert.match(text, /不要直接说出正确选项/);
  assert.match(text, /English I/);
});

test("fallback reply gives one next step without revealing the answer", () => {
  const reply = buildFallbackReply(baseBody);

  assert.match(reply, /关键词|题目/);
  assert.doesNotMatch(reply, /The central idea or claim/);
  assert.doesNotMatch(reply, /答案是/);
});

test("extractOpenAIText handles Responses API output content", () => {
  const text = extractOpenAIText({
    output: [
      {
        content: [{ type: "output_text", text: "请先说出题目真正问的是什么。" }],
      },
    ],
  });

  assert.equal(text, "请先说出题目真正问的是什么。");
});
