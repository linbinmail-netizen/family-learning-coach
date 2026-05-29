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
  metaQuestionComplaint,
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

test("coach request carries session memory so AI continues instead of restarting", () => {
  const request = buildTutorRequest({
    ...baseBody,
    studentReply: "还是不知道怎么写",
    history: [
      { role: "student", text: "我不知道这题问什么" },
      { role: "coach", text: "卡点判断：题意没拆开。小讲解：先找题目目标。" },
      { role: "student", text: "还是不会" },
      { role: "coach", text: "现在只做一小步：这题要我判断____。" },
    ],
  });
  const text = JSON.stringify(request);

  assert.match(text, /coachSessionMemory/);
  assert.match(text, /不要重讲已经给过的同一句提示/);
  assert.match(text, /延续上一轮卡点/);
  assert.match(text, /lastCoachMove/);
});

test("fallback reply uses session memory to avoid restarting the same guidance", () => {
  const reply = buildFallbackReply({
    ...baseBody,
    studentReply: "还是不会",
    history: [
      { role: "student", text: "我不知道这题问什么" },
      { role: "coach", text: "卡点判断：题意没拆开。小讲解：先找题目目标。" },
      { role: "student", text: "还是不会" },
      { role: "coach", text: "现在只做一小步：这题要我判断____。" },
    ],
  });

  assert.match(reply, /延续刚才/);
  assert.match(reply, /下一小步/);
  assert.doesNotMatch(reply, /重新开始/);
});

test("fallback reply avoids repeating the same answer-only prompt", () => {
  const reply = buildFallbackReply({
    ...baseBody,
    studentReply: "B",
    history: [{ role: "coach", text: "我看到你现在缺的是：只写了答案。请写方法：第一步看____，因为____。" }],
  });

  assert.match(reply, /不重复|微练习/);
  assert.doesNotMatch(reply, /The central idea or claim/);
});

test("fallback reply builds on a partial method attempt instead of restarting", () => {
  const reply = buildFallbackReply({
    ...baseBody,
    studentReply: "这题要我判断中心观点，我先找证据，因为证据要支持观点",
    layeredHints: ["先说题目目标", "再找直接证据", "最后解释证据和观点的关系"],
  });

  assert.match(reply, /你已经说对/);
  assert.match(reply, /中心观点|证据/);
  assert.match(reply, /这部分保留|直接接下一句/);
  assert.match(reply, /补题目里的具体关键词或证据/);
  assert.doesNotMatch(reply, /重新开始|先说题目问什么/);
  assert.doesNotMatch(reply, /正确答案|答案是/);
});

test("partial method reply gets specific praise plus one next sentence", () => {
  const reply = buildFallbackReply({
    ...baseBody,
    studentReply: "我先看斜率，因为要比较变化率",
    skill: "斜率与变化率",
  });

  assert.match(reply, /你说对的是/);
  assert.match(reply, /斜率\/变化率/);
  assert.match(reply, /下一句只补/);
  assert.match(reply, /题目里的____说明____/);
  assert.doesNotMatch(reply, /重做整题|先说题目问什么|正确答案|答案是/);
});

test("AI coach prompt tells remote model to name the correct part of a partial method", () => {
  const request = buildTutorRequest({
    ...baseBody,
    studentReply: "这题要我判断中心观点，我先找证据，因为证据要支持观点",
  });
  const text = JSON.stringify(request);

  assert.match(text, /半对思路/);
  assert.match(text, /先指出学生已经说对的部分/);
  assert.match(text, /不要重做整题/);
  assert.match(text, /补题目里的具体关键词或证据/);
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

test("detectNeedsTeaching recognizes student knowledge-gap wording", () => {
  assert.equal(detectNeedsTeaching("知识点没吃透，人家也打不出来"), true);
  assert.equal(detectNeedsTeaching("我说不出来这题问什么"), true);
  assert.equal(detectNeedsTeaching("不是不想答，是这个概念没接上"), true);
});

test("meta question complaints are recognized as a concept support problem", () => {
  const quote = "引导你让你自己去说比如说这问题问的什么之类的但这些如果是别人知识点没吃透人家也打不出来";

  assert.equal(metaQuestionComplaint(quote), true);
  assert.equal(detectNeedsTeaching(quote), true);
  assert.equal(coachingGapAnalysis(quote).gap, "concept");
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

test("buildTutorRequest uses micro-step teaching when knowledge is not ready", () => {
  const request = buildTutorRequest({
    ...baseBody,
    studentReply: "知识点没吃透，人家也打不出来",
    explanation: "Evidence should support a claim or central idea, so identify that idea first.",
  });
  const text = JSON.stringify(request);

  assert.match(text, /先讲清概念/);
  assert.match(text, /二选一或填空/);
  assert.match(text, /不要要求学生先完整复述题意/);
});

test("buildTutorRequest asks AI to diagnose the gap before coaching", () => {
  const request = buildTutorRequest({
    ...baseBody,
    studentReply: "我不知道这题问什么",
    explanation: "Evidence should support a claim or central idea, so identify that idea first.",
  });
  const text = JSON.stringify(request);

  assert.match(text, /先用“卡点判断”命名学生缺少的部分/);
  assert.match(text, /卡点判断 → 小讲解 → 现在只做一小步/);
  assert.match(text, /不要连续追问“题目问什么”/);
  assert.match(text, /coachingGap/);
});

test("AI coach treats cannot-produce replies as a teaching problem, not a writing problem", () => {
  const request = buildTutorRequest({
    ...baseBody,
    studentReply: "引导你让你自己去说问题问的什么，但别人知识点没吃透人家也打不出来",
    explanation: "Evidence should support a claim or central idea, so identify that idea first.",
  });
  const text = JSON.stringify(request);

  assert.match(text, /不要把“打不出来”当成懒得写/);
  assert.match(text, /先补前置概念/);
  assert.match(text, /再给半句填空/);
  assert.match(text, /不能继续要求学生先说“问题问什么”/);
});

test("AI coach removes conflicting meta-question step when concepts are not ready", () => {
  const request = buildTutorRequest({
    ...baseBody,
    studentReply: "知识点没吃透，问我这题问什么我也打不出来",
    history: [],
  });
  const text = JSON.stringify(request);

  assert.match(text, /先教一个最小概念/);
  assert.match(text, /只让学生补一个空/);
  assert.doesNotMatch(text, /让学生用自己的话说出题目真正问什么/);
});

test("AI coach default first step teaches a model before asking for the question goal", () => {
  const request = buildTutorRequest({
    ...baseBody,
    studentReply: "我不知道怎么写",
    history: [],
  });
  const text = JSON.stringify(request);

  assert.match(text, /先给老师示范句/);
  assert.match(text, /再让学生补一个空/);
  assert.doesNotMatch(text, /让学生用自己的话说出题目真正问什么/);
});

test("AI coach offers choice or fill-in scaffolds when students cannot type the idea", () => {
  const request = buildTutorRequest({
    ...baseBody,
    studentReply: "这些如果是别人知识点没吃透人家也打不出来",
    explanation: "Evidence should support a claim or central idea, so identify that idea first.",
  });
  const text = JSON.stringify(request);

  assert.match(text, /不要只让学生自己打出题目问什么/);
  assert.match(text, /给两个可选小句/);
  assert.match(text, /学生只需要选择或补一个空/);
  assert.match(text, /再过渡到完整方法句/);
});

test("AI coach does not use a question-only instruction when teaching is needed", () => {
  const request = buildTutorRequest({
    ...baseBody,
    studentReply: "知识点没吃透，打不出来",
    explanation: "Evidence should support a claim or central idea, so identify that idea first.",
  });
  const text = JSON.stringify(request);

  assert.doesNotMatch(text, /Ask exactly one short question at a time/);
  assert.match(text, /学生已经有方法雏形时，最多问一个短问题/);
  assert.match(text, /学生卡住或概念没接上时，先教再问/);
  assert.match(text, /卡点判断：\.\.\. 小讲解：\.\.\. 小例子：\.\.\. 现在只做一小步/);
});

test("fallback teaches briefly when the student is conceptually stuck", () => {
  const reply = buildFallbackReply({
    ...baseBody,
    studentReply: "我不懂 central idea 是什么",
    explanation: "Evidence should support a claim or central idea, so identify that idea first.",
  });

  assert.match(reply, /小讲解/);
  assert.match(reply, /例子/);
  assert.match(reply, /先照这句改写/);
  assert.doesNotMatch(reply, /The central idea or claim/);
});

test("fallback for cannot-produce replies teaches before asking for a tiny fill-in", () => {
  const reply = buildFallbackReply({
    ...baseBody,
    studentReply: "别人知识点没吃透人家也打不出来",
    explanation: "Evidence should support a claim or central idea, so identify that idea first.",
  });

  assert.match(reply, /不是写作问题/);
  assert.match(reply, /先补前置概念/);
  assert.match(reply, /半句填空/);
  assert.match(reply, /二选一/);
  assert.match(reply, /先看题干关键词，还是先看答案长短/);
  assert.doesNotMatch(reply, /继续说题目问什么/);
  assert.doesNotMatch(reply, /答案是/);
});

test("exact student complaint gets teacher-first support instead of another meta question", () => {
  const quote = "引导你让你自己去说比如说这问题问的什么之类的但这些如果是别人知识点没吃透人家也打不出来";
  const reply = buildFallbackReply({
    ...baseBody,
    studentReply: quote,
    explanation: "Evidence should support a claim or central idea, so identify that idea first.",
  });

  assert.match(reply, /老师先说给你听/);
  assert.match(reply, /你只需要选一个按钮或补一个空/);
  assert.doesNotMatch(reply, /你能用自己的话说.*题目/);
  assert.doesNotMatch(reply, /正确答案|答案是|选项\s*[A-D]/);
});

test("fallback changes teaching style after repeated concept stuck replies", () => {
  const reply = buildFallbackReply({
    ...baseBody,
    studentReply: "知识点没吃透，人家也打不出来",
    history: [
      { role: "student", text: "我不知道这题问什么" },
      { role: "coach", text: "卡点判断：题意没拆开。现在只做一小步：这题要我判断____。" },
      { role: "student", text: "还是不会，打不出来" },
      { role: "coach", text: "下一小步只补一个空：我先看____。" },
    ],
  });

  assert.match(reply, /换一种讲法/);
  assert.match(reply, /小例子/);
  assert.match(reply, /二选一/);
  assert.match(reply, /不用打完整句/);
  assert.doesNotMatch(reply, /你能用自己的话说说.*题目真正问/);
  assert.doesNotMatch(reply, /正确答案|答案是/);
});

test("fallback third stuck reply leaves the original question for a worked mini example", () => {
  const reply = buildFallbackReply({
    ...baseBody,
    studentReply: "还是不会，知识点没吃透，打不出来",
    history: [
      { role: "student", text: "我不知道这题问什么" },
      { role: "coach", text: "卡点判断：题意没拆开。现在只做一小步：这题要我判断____。" },
      { role: "student", text: "还是不会，打不出来" },
      { role: "coach", text: "换一种讲法，任务再降一级：不用打完整句。小讲解：证据要支持观点。小例子：题目问作者观点时，先找观点句。" },
      { role: "student", text: "我还是不会" },
      { role: "coach", text: "下一小步只补一个空：我先看____。" },
    ],
  });

  assert.match(reply, /第三次卡住/);
  assert.match(reply, /不再围着原题/);
  assert.match(reply, /非原题小例子/);
  assert.match(reply, /只填一个空/);
  assert.doesNotMatch(reply, /正确答案|答案是|选项\s*[A-D]/);
});

test("fallback reteaching uses concrete subject examples", () => {
  const reply = buildFallbackReply({
    ...baseBody,
    subject: "English I",
    skill: "claim and evidence",
    studentReply: "我不懂",
  });

  assert.match(reply, /小例子/);
  assert.match(reply, /观点句|证据|作者观点/);
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

test("safeTutorReply rejects repeated meta questions when the student cannot produce an explanation", () => {
  const reply = safeTutorReply("你先说题目问什么，然后再想第一步。", {
    ...baseBody,
    studentReply: "我知识点没吃透，打不出来",
    explanation: "Evidence should support a claim or central idea, so identify that idea first.",
  });

  assert.match(reply, /小讲解|前置概念|半句填空|现在只做一小步/);
  assert.doesNotMatch(reply, /你先说题目问什么/);
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
