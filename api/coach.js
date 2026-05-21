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
      "Keep the reply under 110 Chinese characters.",
      `Current step: ${step.label}. ${step.instruction}`,
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
              recentHistory: history.slice(-8),
              studentReply,
              task:
                "Move the student one step forward in the currentStep. Do not reveal the correct answer. Do not solve the problem for the student.",
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
