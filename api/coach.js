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
  } = body;
  const step = getLearningStep(history);
  const needsTeaching = detectNeedsTeaching(studentReply);

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

  if (needsTeaching) {
    const skill = body.skill || "这个知识点";
    const shortExplanation =
      body.explanation ||
      `${skill} 是这类题里帮助你判断方向的核心概念，不是让你先猜答案。`;
    return `小讲解：${shortExplanation} 例子：先分清“主想法”和“细节”。回到这题：题目要你找哪一类信息？`;
  }

  if (step.id === "understand" && hints[0]) {
    return `${hints[0]} 先不用选答案，请用自己的话说说题目真正问什么。`;
  }

  if (step.id === "keywords" && hints[0]) {
    return `${hints[0]} 现在找一个关键词，并说说它为什么重要。`;
  }

  if (step.id === "eliminate" && hints[1]) {
    return `${hints[1]} 先排除一个不合理选项，并说出理由。`;
  }

  return step.fallback;
}

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.status(405).json({ error: "Method not allowed" });
    return;
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    response.status(200).json({
      reply:
        "AI 服务还没有配置好。请先在 Vercel 环境变量里添加 OPENAI_API_KEY。现在我先用本地提示方式引导：请你先说明题目在问什么，再找一个已知条件。",
    });
    return;
  }

  try {
    const tutorRequest = buildTutorRequest(request.body || {});

    const openaiResponse = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tutorRequest),
    });

    if (!openaiResponse.ok) {
      const message = await openaiResponse.text();
      throw new Error(message);
    }

    const data = await openaiResponse.json();
    const reply = extractOpenAIText(data) || buildFallbackReply(request.body || {});

    response.status(200).json({ reply });
  } catch (error) {
    response.status(200).json({
      reply: buildFallbackReply(request.body || {}),
      detail: error.message,
    });
  }
}
