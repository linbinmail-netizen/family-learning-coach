const learningSteps = [
  {
    id: "understand",
    label: "理解题意",
    instruction: "让学生用自己的话说出题目真正问什么，不要讨论选项对错。",
    fallback: "我们先从题意开始。你能用自己的话说说：这道题真正问你找什么吗？",
  },
  {
    id: "keywords",
    label: "找关键词",
    instruction: "让学生指出题干里的关键词，并解释这个关键词为什么重要。",
    fallback: "很好，下一步找关键词。题目里哪个词最能提醒你要用这个知识点？为什么？",
  },
  {
    id: "eliminate",
    label: "排除错误选项",
    instruction: "让学生排除一个明显不符合题意的选项，并说出理由。不要说正确选项。",
    fallback: "现在先不选最终答案。你能排除一个不符合题意的选项吗？请说出理由。",
  },
  {
    id: "reason",
    label: "写一句理由",
    instruction: "让学生用“因为...所以...”写出选择依据，但不要替学生完成句子。",
    fallback: "接近了。请用一句话写理由：因为题目问的是____，所以我认为____更合适。",
  },
  {
    id: "reflect",
    label: "总结方法",
    instruction: "让学生总结下次遇到同类题时的第一步方法。",
    fallback: "最后做一个方法总结：下次遇到同类题，你第一步会先做什么？",
  },
];

export function getLearningStep(history = []) {
  const studentTurns = history.filter((message) => message.role === "student").length;
  return learningSteps[Math.min(studentTurns, learningSteps.length - 1)];
}

export function extractOpenAIText(data) {
  return (
    data.output_text ||
    data.output?.flatMap((item) => item.content || []).find((item) => item.text)?.text ||
    ""
  ).trim();
}

export function detectNeedsTeaching(studentReply = "") {
  const reply = String(studentReply).toLowerCase();
  return [
    "不懂",
    "不会",
    "不知道",
    "什么意思",
    "没学过",
    "看不懂",
    "不明白",
    "乱猜",
    "don't understand",
    "do not understand",
    "dont understand",
    "i don't know",
    "i dont know",
    "idk",
    "confused",
    "what does",
    "what is",
  ].some((signal) => reply.includes(signal));
}

function buildTeachingNote({ subject, skill, explanation }) {
  const concept = skill || "这个知识点";
  const base = explanation || `${concept} 是解这类题时要先弄清楚的核心概念。`;
  return [
    `如果学生概念不清，先进入“教练式讲解”模式。`,
    `用 1 句短讲解说明 ${concept}，语言适合 ${subject || "当前学科"} 学生。`,
    `再给 1 个小例子或正反对比，但不要用题目中的正确选项当例子。`,
    `最后再问一个问题，把学生带回当前题目。`,
    `仍然不要直接说出正确选项、答案字母或最终答案。`,
    `可参考但不要照抄的教师说明：${base}`,
  ].join("\n");
}

export function buildTutorRequest(body = {}) {
  const {
    studentName,
    grade,
    subject,
    question,
    answers = [],
    skill,
    explanation,
    coachHints = [],
    studentReply,
    history = [],
    recentSkillMistakes = [],
  } = body;
  const step = getLearningStep(history);
  const needsTeaching = detectNeedsTeaching(studentReply);
  const mistakeNote = recentSkillMistakes.length
    ? "Use recent same-skill mistakes to personalize the next hint, but do not mention private report details or reveal answers."
    : "";

  return {
    model: process.env.OPENAI_MODEL || "gpt-5-mini",
    instructions: [
      "You are a Socratic learning coach for a middle/high school student in Texas.",
      "Reply in simplified Chinese unless the student clearly asks to practice English.",
      "Use the student's name naturally, but not in every sentence.",
      "Do not directly say the correct option, answer letter, or final answer.",
      "不要直接说出正确选项、答案字母或最终答案。",
      "Guide with this five-step routine: 理解题意 → 找关键词 → 排除错误选项 → 写一句理由 → 总结方法.",
      "Ask exactly one short question at a time.",
      "If the student is stuck, give one small hint, then ask the student to try.",
      "If the student is conceptually confused, teach briefly before asking again.",
      "教练式讲解格式：小讲解：... 例子：... 回到这题：...？",
      "Keep the reply under 110 Chinese characters.",
      mistakeNote,
      `Current step: ${step.label}. ${step.instruction}`,
      needsTeaching ? buildTeachingNote({ subject, skill, explanation }) : "",
    ].join("\n"),
    input: [
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: JSON.stringify({
              studentName,
              grade,
              subject,
              currentQuestion: question,
              answerChoices: answers,
              targetSkill: skill,
              teacherExplanationForInternalUseOnly: explanation,
              availableHints: coachHints,
              recentSkillMistakes: recentSkillMistakes.slice(0, 3),
              currentStep: step,
              needsTeaching,
              recentHistory: history.slice(-8),
              studentReply,
              task:
                "Move the student one step forward. If needsTeaching is true, give a short explanation plus a tiny example before asking one follow-up question. Do not reveal the correct answer.",
            }),
          },
        ],
      },
    ],
  };
}

export function buildFallbackReply(body = {}) {
  const step = getLearningStep(body.history || []);
  const hints = body.coachHints || [];
  const needsTeaching = detectNeedsTeaching(body.studentReply || "");
  const mistakePrefix = body.recentSkillMistakes?.length
    ? `你之前在同类题上卡过 ${body.recentSkillMistakes[0].attempts || 1} 次，`
    : "";

  if (needsTeaching) {
    const skill = body.skill || "这个知识点";
    const shortExplanation =
      body.explanation ||
      `${skill} 是这类题里帮助你判断方向的核心概念，不是让你先猜答案。`;
    return `${mistakePrefix}小讲解：${shortExplanation} 例子：先分清“主想法”和“细节”。回到这题：题目要你找哪一类信息？`;
  }

  if (step.id === "understand" && hints[0]) {
    return `${mistakePrefix}${hints[0]} 先不用选答案，请用自己的话说说题目真正问什么。`;
  }

  if (step.id === "keywords" && hints[0]) {
    return `${mistakePrefix}${hints[0]} 现在找一个关键词，并说说它为什么重要。`;
  }

  if (step.id === "eliminate" && hints[1]) {
    return `${mistakePrefix}${hints[1]} 先排除一个不合理选项，并说出理由。`;
  }

  return `${mistakePrefix}${step.fallback}`;
}

function localMasterySignal(reply = "", expectedMethod = "", skill = "") {
  const text = String(reply).trim().toLowerCase();
  if (text.length < 18) return false;
  if (/猜|随便|不知道|不会|不确定|答案是|选[a-d]|choose|guess|idk/.test(text)) return false;
  const methodWords = ["先", "因为", "所以", "题目", "关键词", "证据", "方法", "第一步", "看", "判断", "条件", "关系", "变化", "除以", "because", "first", "evidence", "method"];
  const hasMethodLanguage = methodWords.some((word) => text.includes(word.toLowerCase()));
  const expectedRaw = [expectedMethod, skill].join(" ").toLowerCase();
  const expectedWords = expectedRaw
    .split(/[\s，。,.、：:；;]+/)
    .filter((word) => word.length >= 3)
    .slice(0, 10);
  if (/斜率|变化率|slope|rate of change|rise over run/.test(expectedRaw)) {
    expectedWords.push("斜率", "变化率", "除以", "x 变化", "y 变化", "rise", "run");
  }
  const keywordHits = expectedWords.filter((word) => text.includes(String(word).toLowerCase())).length;
  return hasMethodLanguage && (keywordHits >= 1 || text.length >= 32);
}

export function buildFallbackMasteryEvaluation(body = {}) {
  const passed = localMasterySignal(body.variantReply, body.expectedMethod, body.skill);
  if (passed) {
    return {
      passed: true,
      reply: "解释通过：你说清楚了第一步和理由。现在可以进入下一题。",
      nextPrompt: "",
    };
  }
  return {
    passed: false,
    reply: "还需要再具体一点。请写出第一步看什么，以及为什么这一步能帮助你判断。",
    nextPrompt: "请用“先看...因为...”写一句完整方法。",
  };
}

export function extractMasteryEvaluation(data) {
  const text = extractOpenAIText(data);
  try {
    const parsed = JSON.parse(text);
    return {
      passed: Boolean(parsed.passed),
      reply: String(parsed.reply || parsed.nextPrompt || "").slice(0, 160),
      nextPrompt: String(parsed.nextPrompt || "").slice(0, 160),
    };
  } catch {
    return null;
  }
}

export function buildMasteryEvaluationRequest(body = {}) {
  const {
    studentName,
    grade,
    subject,
    question,
    skill,
    explanation,
    expectedMethod,
    variantReply,
    history = [],
  } = body;

  return {
    model: process.env.OPENAI_MODEL || "gpt-5-mini",
    instructions: [
      "You are grading whether a student can explain the method for a middle/high school learning question.",
      "Return only valid JSON with keys: passed, reply, nextPrompt.",
      "passed must be true only when the student explains a reusable method, not just an answer choice.",
      "Accept simplified Chinese, English, or mixed Chinese-English explanations when the method is mathematically or conceptually equivalent.",
      "Do not reveal the correct answer, correct option, or answer letter.",
      "不要直接说出正确选项、答案字母或最终答案。",
      "If not passed, reply with one concrete coaching prompt in simplified Chinese.",
      "Keep reply and nextPrompt each under 80 Chinese characters.",
    ].join("\n"),
    input: [
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: JSON.stringify({
              mode: "mastery_evaluation",
              studentName,
              grade,
              subject,
              currentQuestion: question,
              targetSkill: skill,
              teacherExplanationForInternalUseOnly: explanation || expectedMethod,
              expectedReusableMethod: expectedMethod,
              recentHistory: history.slice(-8),
              studentOpenExplanation: variantReply,
              rubric: [
                "Does the student name a first step?",
                "Does the student explain why that step matters?",
                "Can this method transfer to a similar question?",
                "Reject guessing, answer letters, or answer-only replies.",
              ],
            }),
          },
        ],
      },
    ],
  };
}

export async function fetchOpenAIWithTimeout(payload, apiKey, fetcher = fetch, timeoutMs = 16000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetcher("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeoutId);
  }
}

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.status(405).json({ error: "Method not allowed" });
    return;
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    if (request.body?.mode === "mastery_evaluation") {
      response.status(200).json(buildFallbackMasteryEvaluation(request.body || {}));
      return;
    }
    response.status(200).json({
      reply:
        "AI 服务还没有配置好。请先在 Vercel 环境变量里添加 OPENAI_API_KEY。现在我先用本地提示方式引导：请你先说明题目在问什么，再找一个已知条件。",
    });
    return;
  }

  try {
    if (request.body?.mode === "mastery_evaluation") {
      const evaluationRequest = buildMasteryEvaluationRequest(request.body || {});
      const openaiResponse = await fetchOpenAIWithTimeout(evaluationRequest, apiKey);

      if (!openaiResponse.ok) {
        const message = await openaiResponse.text();
        throw new Error(message);
      }

      const data = await openaiResponse.json();
      const evaluation = extractMasteryEvaluation(data) || buildFallbackMasteryEvaluation(request.body || {});
      response.status(200).json(evaluation);
      return;
    }

    const tutorRequest = buildTutorRequest(request.body || {});

    const openaiResponse = await fetchOpenAIWithTimeout(tutorRequest, apiKey);

    if (!openaiResponse.ok) {
      const message = await openaiResponse.text();
      throw new Error(message);
    }

    const data = await openaiResponse.json();
    const reply = extractOpenAIText(data) || buildFallbackReply(request.body || {});

    response.status(200).json({ reply });
  } catch (error) {
    if (request.body?.mode === "mastery_evaluation") {
      response.status(200).json({
        ...buildFallbackMasteryEvaluation(request.body || {}),
        detail: error.message,
      });
      return;
    }
    response.status(200).json({
      reply: buildFallbackReply(request.body || {}),
      detail: error.message,
    });
  }
}
