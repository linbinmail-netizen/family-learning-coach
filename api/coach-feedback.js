const allowedMistakeTypes = [
  "concept_gap",
  "careless",
  "calculation_step",
  "reading_comprehension",
  "logic_reasoning",
  "guessed",
  "unclear",
];

function sendJson(response, statusCode, payload) {
  response.statusCode = statusCode;
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.end(JSON.stringify(payload));
}

function normalizeChoiceLabel(answer = "") {
  const match = String(answer).trim().match(/^[A-D]/i);
  return match ? match[0].toUpperCase() : String(answer).trim();
}

function detectMistakeType(body = {}) {
  const confidence = String(body.confidence || "").toLowerCase();
  const explanation = String(body.studentExplanation || body.studentAnswer || "").toLowerCase();
  const question = String(body.question || "").toLowerCase();
  const skill = String(body.skill || "").toLowerCase();

  if (confidence === "guess" || /guess|猜|随便|不知道|不会|idk/.test(explanation)) return "guessed";
  if (/calculate|equation|linear|slope|rate|algebra|math|函数|方程|斜率|比例/.test(`${question} ${skill}`)) {
    if (/sign|negative|multiply|divide|加|减|乘|除|算/.test(explanation)) return "calculation_step";
    return "concept_gap";
  }
  if (/read|text|evidence|main idea|inference|作者|证据|主旨|推断/.test(`${question} ${skill}`)) {
    return "reading_comprehension";
  }
  if (/because|therefore|claim|reason|logic|所以|因为|理由/.test(explanation)) return "logic_reasoning";
  if (explanation.length < 8) return "unclear";
  return "concept_gap";
}

function needsTeachFirstMicroTask(body = {}) {
  const text = `${body.studentExplanation || ""} ${body.studentAnswer || ""}`.toLowerCase();
  return /知识点没吃透|打不出来|写不出来|说不出来|不知道|不会|不懂|idk|stuck|confused/.test(text);
}

function studentFriendlyConceptLine(skill = "this skill") {
  const text = String(skill || "").toLowerCase();
  if (/evidence|claim|support|证据|主张|支持/.test(text)) return "小讲解：证据必须直接支持题目里的主张，不能只选看起来相关的句子。";
  if (/linear|slope|rate|函数|斜率|变化率|比例/.test(text)) return "小讲解：这类题先分清起点和每一步怎么变化，不能只看哪个数字大。";
  if (/equation|方程|代数/.test(text)) return "小讲解：解方程就是用相反操作把变量一步步单独留下。";
  if (/experiment|variable|实验|变量/.test(text)) return "小讲解：实验题先分清改变什么、测量什么、保持什么不变。";
  return `小讲解：${skill} 这类题先抓核心概念，再把概念接回题目。`;
}

function buildFallbackCoachFeedback(body = {}) {
  const answerLabel = normalizeChoiceLabel(body.studentAnswer);
  const commonMistakes = body.commonMistakes || {};
  const specificMistake = commonMistakes[answerLabel] || commonMistakes[body.studentAnswer] || "";
  const mistakeType = detectMistakeType(body);
  const skill = body.skill || "this skill";
  const teachFirst = needsTeachFirstMicroTask(body);
  const hintSteps = Array.isArray(body.hintSteps) ? body.hintSteps : [];
  const hintLevel1 = teachFirst ? studentFriendlyConceptLine(skill) : hintSteps[0] || "先找题目中不变的量或最关键的证据。";
  const hintLevel2 = teachFirst ? "现在不用写完整解释，只做一小步：先找题目里的关键词或最关键证据。" : hintSteps[1] || "再找会变化的量，并说明它为什么影响答案。";

  return {
    mistakeType,
    diagnosis: specificMistake || `Student needs more support with ${skill}.`,
    hintLevel1,
    hintLevel2,
    restatePrompt: teachFirst
      ? "先不要完整解释，只做一小步：补一个空或二选一。我第一步先看____。"
      : `请不要只写答案。用一句话说明：这题第一步要看什么，为什么？`,
    variantPrompt:
      body.variantPrompt ||
      body.variantQuestion?.question_text ||
      body.variantQuestion?.prompt ||
      `请用同样方法解释一道新的 ${skill} 题。`,
    parentNote:
      specificMistake ||
      `Needs more practice on ${skill}, especially explaining the method instead of choosing by elimination.`,
  };
}

function buildCoachFeedbackRequest(body = {}) {
  return {
    model: process.env.OPENAI_MODEL || "gpt-5-mini",
    instructions: [
      "You are an AI learning coach for middle and high school students.",
      "Do not directly reveal the final answer unless the student has completed guided steps.",
      "Diagnose the mistake type.",
      "Use short, age-appropriate language.",
      "Ask one question at a time.",
      "Require the student to explain the method in their own words.",
      "If the student says the knowledge point is not solid, they cannot type, or they do not know how to explain, first teach the concept briefly, then give a tiny micro-task.",
      "知识点没吃透、打不出来、说不出来时，先讲清概念，再让学生只补一个空或做二选一；不要先追问完整题意。",
      "Use questions after the short explanation, not before it, when the gap is conceptual.",
      "Return strict JSON only.",
      `mistakeType must be one of: ${allowedMistakeTypes.join(", ")}.`,
      "Do not include markdown.",
    ].join("\n"),
    input: [
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: JSON.stringify({
              studentId: body.studentId,
              question: body.question,
              choices: body.choices || [],
              correctAnswer: body.correctAnswer,
              studentAnswer: body.studentAnswer,
              studentExplanation: body.studentExplanation,
              confidence: body.confidence,
              skill: body.skill,
              gradeLevel: body.gradeLevel,
              commonMistakes: body.commonMistakes || {},
              hintSteps: body.hintSteps || [],
              requiredShape: {
                mistakeType: "concept_gap",
                diagnosis: "short diagnosis",
                hintLevel1: "first hint",
                hintLevel2: "second hint",
                restatePrompt: "student restatement prompt",
                variantPrompt: "similar question prompt",
                parentNote: "short parent-facing note",
              },
            }),
          },
        ],
      },
    ],
  };
}

function parseCoachFeedback(data) {
  const text =
    data.output_text ||
    data.output?.flatMap((item) => item.content || []).find((item) => item.text)?.text ||
    "";
  const parsed = JSON.parse(text);
  if (!allowedMistakeTypes.includes(parsed.mistakeType)) parsed.mistakeType = "unclear";
  return {
    mistakeType: parsed.mistakeType,
    diagnosis: String(parsed.diagnosis || "").slice(0, 240),
    hintLevel1: String(parsed.hintLevel1 || "").slice(0, 180),
    hintLevel2: String(parsed.hintLevel2 || "").slice(0, 180),
    restatePrompt: String(parsed.restatePrompt || "").slice(0, 180),
    variantPrompt: String(parsed.variantPrompt || "").slice(0, 220),
    parentNote: String(parsed.parentNote || "").slice(0, 220),
  };
}

async function fetchOpenAI(payload, apiKey) {
  return fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

export {
  allowedMistakeTypes,
  buildCoachFeedbackRequest,
  buildFallbackCoachFeedback,
  detectMistakeType,
  parseCoachFeedback,
};

export default async function handler(request, response) {
  if (request.method !== "POST") {
    sendJson(response, 405, { error: "Method not allowed" });
    return;
  }

  const body = request.body || {};
  const fallback = buildFallbackCoachFeedback(body);
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    sendJson(response, 200, { ...fallback, source: "local_fallback" });
    return;
  }

  try {
    const openaiResponse = await fetchOpenAI(buildCoachFeedbackRequest(body), apiKey);
    if (!openaiResponse.ok) throw new Error(await openaiResponse.text());
    const data = await openaiResponse.json();
    sendJson(response, 200, { ...fallback, ...parseCoachFeedback(data), source: "openai" });
  } catch (error) {
    sendJson(response, 200, { ...fallback, source: "local_fallback", detail: error.message });
  }
}
