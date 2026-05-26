import test from "node:test";
import assert from "node:assert/strict";

import {
  buildFallbackMasteryEvaluation,
  buildMasteryEvaluationRequest,
  buildFallbackReply,
  buildTutorRequest,
  detectNeedsTeaching,
  extractOpenAIText,
  fetchOpenAIWithTimeout,
  getLearningStep,
} from "./coach.js";

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

test("detectNeedsTeaching recognizes concept confusion", () => {
  assert.equal(detectNeedsTeaching("我不懂 central idea 是什么意思"), true);
  assert.equal(detectNeedsTeaching("I don't understand what evidence means"), true);
  assert.equal(detectNeedsTeaching("I think the keyword is evidence"), false);
});

test("buildTutorRequest switches to teach-then-ask mode for concept confusion", () => {
  const request = buildTutorRequest({
    ...baseBody,
    studentReply: "我不懂 central idea 是什么",
    explanation: "Evidence should support a claim or central idea, so identify that idea first.",
  });
  const text = JSON.stringify(request);

  assert.match(text, /短讲解/);
  assert.match(text, /小例子/);
  assert.match(text, /再问一个问题/);
  assert.match(text, /仍然不要直接说出正确选项/);
});

test("fallback teaches briefly when the student is conceptually stuck", () => {
  const reply = buildFallbackReply({
    ...baseBody,
    studentReply: "我不懂 central idea 是什么",
    explanation: "Evidence should support a claim or central idea, so identify that idea first.",
  });

  assert.match(reply, /小讲解/);
  assert.match(reply, /例子/);
  assert.match(reply, /回到这题/);
  assert.doesNotMatch(reply, /The central idea or claim/);
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

test("buildMasteryEvaluationRequest grades open explanations without revealing answers", () => {
  const request = buildMasteryEvaluationRequest({
    ...baseBody,
    variantReply: "第一步要先看题目问的中心观点，因为证据必须支持这个观点。",
    expectedMethod: "Evidence should support a claim or central idea, so identify that idea first.",
  });
  const text = JSON.stringify(request);

  assert.match(text, /mastery_evaluation/);
  assert.match(text, /passed/);
  assert.match(text, /nextPrompt/);
  assert.match(text, /不要直接说出正确选项/);
});

test("fallback mastery evaluation distinguishes method explanation from guessing", () => {
  const strong = buildFallbackMasteryEvaluation({
    variantReply: "第一步先看题目问的中心观点，因为证据要支持这个观点，所以不能只看最长选项。",
    expectedMethod: "Evidence should support a claim or central idea.",
    skill: "识别中心观点",
  });
  const weak = buildFallbackMasteryEvaluation({
    variantReply: "我觉得选 B，应该是这个。",
    expectedMethod: "Evidence should support a claim or central idea.",
    skill: "识别中心观点",
  });

  assert.equal(strong.passed, true);
  assert.match(strong.reply, /通过|清楚/);
  assert.equal(weak.passed, false);
  assert.match(weak.reply, /第一步|为什么|方法/);
});

test("fetchOpenAIWithTimeout aborts slow OpenAI requests", async () => {
  const startedAt = Date.now();
  await assert.rejects(
    fetchOpenAIWithTimeout(
      { model: "test", input: [] },
      "fake-key",
      async (_url, options) => {
        await new Promise((resolve, reject) => {
          options.signal.addEventListener("abort", () => reject(Object.assign(new Error("aborted"), { name: "AbortError" })));
        });
      },
      20
    ),
    /aborted|AbortError/
  );
  assert.ok(Date.now() - startedAt < 500);
});
