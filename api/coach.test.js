import test from "node:test";
import assert from "node:assert/strict";

import {
  analyzeStudentReply,
  buildFallbackMasteryEvaluation,
  buildMasteryEvaluationRequest,
  buildFallbackReply,
  buildTutorRequest,
  coachingGapAnalysis,
  detectNeedsTeaching,
  extractOpenAIText,
  fetchOpenAIWithTimeout,
  getLearningStep,
  mergeMasteryEvaluation,
  safeTutorReply,
} from "./coach.js";
import handler from "./coach.js";

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
  assert.match(text, /replyAnalysis/);
  assert.match(text, /ask for method/);
});

test("buildTutorRequest uses layered hints and common mistakes for smarter coaching", () => {
  const request = buildTutorRequest({
    ...baseBody,
    layeredHints: ["先说题目目标", "再找直接线索", "最后写完整方法句"],
    commonMistakes: ["只看答案字母，没有解释证据和主张的关系"],
  });
  const text = JSON.stringify(request);

  assert.match(text, /layeredHints/);
  assert.match(text, /commonMistakes/);
  assert.match(text, /先说题目目标/);
  assert.match(text, /只看答案字母/);
});

test("student reply analysis detects low quality replies for smoother coaching", () => {
  assert.equal(analyzeStudentReply("B").type, "answer_only");
  assert.equal(analyzeStudentReply("我不知道").type, "stuck");
  assert.equal(analyzeStudentReply("maybe this").type, "thin");
  assert.equal(analyzeStudentReply("第一步先找关键词，因为证据要支持题目问的观点").type, "method_attempt");
});

test("coaching gap analysis names the missing piece", () => {
  assert.equal(coachingGapAnalysis("B").gap, "answer_only");
  assert.equal(coachingGapAnalysis("我先找证据，因为它有用").gap, "goal");
  assert.equal(coachingGapAnalysis("这题要我判断中心观点，因为这样有用").gap, "method");
  assert.equal(coachingGapAnalysis("这题要我判断中心观点，第一步先找证据").gap, "reason");
});

test("fallback reply adapts to answer-only and vague replies", () => {
  const context = {
    ...baseBody,
    layeredHints: ["先说题目目标", "再找直接线索", "最后写完整方法句"],
    commonMistakes: ["只看答案字母，没有解释证据和主张的关系"],
  };
  const answerOnly = buildFallbackReply({ ...context, studentReply: "B" });
  const vague = buildFallbackReply({ ...context, studentReply: "maybe this" });

  assert.match(answerOnly, /缺的是|只写了答案|第一步/);
  assert.match(answerOnly, /常见误区/);
  assert.match(vague, /缺的是|理由|我先看|直接线索/);
  assert.doesNotMatch(answerOnly, /The central idea or claim/);
});

test("fallback reply advances layered hints based on coaching history", () => {
  const reply = buildFallbackReply({
    ...baseBody,
    studentReply: "我不会",
    layeredHints: ["第一层：先说题目目标", "第二层：找直接线索", "第三层：写方法句"],
    commonMistakes: ["只看关键词，没有解释关系"],
    history: [
      { role: "student", text: "我不会" },
      { role: "coach", text: "先说题目目标" },
      { role: "student", text: "还是不会" },
      { role: "coach", text: "找直接线索" },
    ],
  });

  assert.match(reply, /第二层|找直接线索/);
  assert.match(reply, /常见误区/);
});

test("handler uses local coach when OpenAI key is missing instead of showing setup errors", async () => {
  const previousKey = process.env.OPENAI_API_KEY;
  delete process.env.OPENAI_API_KEY;
  const payload = await callHandler({ ...baseBody, studentReply: "B" });
  if (previousKey) process.env.OPENAI_API_KEY = previousKey;

  assert.equal(payload.mode, "local_coach");
  assert.match(payload.reply, /第一步|方法/);
  assert.doesNotMatch(payload.reply, /OPENAI_API_KEY|服务还没有配置好/);
});

function callHandler(body) {
  return new Promise((resolve) => {
    const response = {
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(payload) {
        resolve(payload);
      },
    };
    handler({ method: "POST", body }, response);
  });
}

test("buildTutorRequest includes recent mistakes for the same skill", () => {
  const request = buildTutorRequest({
    ...baseBody,
    recentSkillMistakes: [
      {
        skill: "识别中心观点",
        prompt: "Which sentence best states the central idea?",
        reason: "猜对后验证掌握",
        attempts: 2,
      },
    ],
  });
  const text = JSON.stringify(request);

  assert.match(text, /recentSkillMistakes/);
  assert.match(text, /Which sentence best states/);
  assert.match(text, /Use recent same-skill mistakes/);
});

test("fallback reply mentions same-skill mistake pattern when available", () => {
  const reply = buildFallbackReply({
    ...baseBody,
    recentSkillMistakes: [{ skill: "识别中心观点", attempts: 2 }],
  });

  assert.match(reply, /同类题|之前/);
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

test("safeTutorReply replaces answer-revealing AI replies with guided fallback", () => {
  const reply = safeTutorReply("正确答案是 B，因为 evidence should support the central idea.", {
    ...baseBody,
    studentReply: "B",
    commonMistakes: ["只看答案字母，没有解释证据和主张的关系"],
  });

  assert.match(reply, /第一步|方法|常见误区/);
  assert.doesNotMatch(reply, /正确答案|The central idea or claim|答案是 B/);
});

test("safeTutorReply blocks bare answer-letter explanations", () => {
  const reply = safeTutorReply("B because evidence should support the central idea.", {
    ...baseBody,
    studentReply: "B",
  });

  assert.match(reply, /第一步|方法|常见误区/);
  assert.doesNotMatch(reply, /^B because|The central idea or claim/);
});

test("safeTutorReply keeps normal short coaching questions", () => {
  const reply = safeTutorReply("先说题目真正问你找什么，不用选答案。", baseBody);

  assert.equal(reply, "先说题目真正问你找什么，不用选答案。");
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

test("fallback mastery evaluation accepts Chinese math method explanations", () => {
  const result = buildFallbackMasteryEvaluation({
    variantReply: "我会先找两个点的 x 变化和 y 变化，再用 y 的变化除以 x 的变化，因为斜率表示每增加 1 个 x，y 变多少。",
    expectedMethod: "Slope shows the rate of change between two points.",
    skill: "斜率与变化率",
  });

  assert.equal(result.passed, true);
});

test("local passing mastery can override an overly strict AI rejection", () => {
  const merged = mergeMasteryEvaluation(
    { passed: false, reply: "请再具体一点。", nextPrompt: "补公式。" },
    { passed: true, reply: "解释通过：你说清楚了第一步和理由。", nextPrompt: "" }
  );

  assert.equal(merged.passed, true);
  assert.match(merged.reply, /通过/);
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
