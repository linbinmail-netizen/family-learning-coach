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

export function unsafeTutorReplyReason(reply = "", body = {}) {
  const text = String(reply || "").trim();
  if (!text) return "empty";
  const answerTexts = (body.answers || []).map((answer) => String(answer || "").trim()).filter((answer) => answer.length >= 4);
  const lowerText = text.toLowerCase();
  const studentCannotProduce = needsImmediateConceptTeaching(body.studentReply || "") || cannotProduceBecauseConceptGap(body.studentReply || "");
  if (/^\s*(答案|answer)?\s*[A-D]\s*[。.!]?\s*$/i.test(text) || /^\s*[A-D]\s*(是|because|因为|,|，)/i.test(text)) return "reveals_answer_letter";
  if (/正确答案|答案是|选项\s*[A-D]|choose\s*[A-D]|correct answer|the answer is/i.test(text)) return "reveals_answer_language";
  if (answerTexts.some((answer) => lowerText.includes(answer.toLowerCase()))) return "reveals_answer_text";
  if (studentCannotProduce && /题目.*问什么|问题.*问.*什么|先说.*题目|describe.*question|what.*question/i.test(text) && !/小讲解|例子|填空|只做一小步|前置概念/.test(text)) {
    return "repeats_meta_question_when_stuck";
  }
  if (text.length > 180) return "too_long";
  return "";
}

export function safeTutorReply(aiReply = "", body = {}) {
  const reason = unsafeTutorReplyReason(aiReply, body);
  if (!reason) return String(aiReply || "").trim();
  return buildFallbackReply(body);
}

export function detectNeedsTeaching(studentReply = "") {
  const reply = String(studentReply).toLowerCase();
  return [
    "不懂",
    "不会",
    "不知道",
    "什么意思",
    "没学过",
    "知识点没吃透",
    "概念没接上",
    "概念没懂",
    "打不出来",
    "说不出来",
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

export function analyzeStudentReply(studentReply = "") {
  const raw = String(studentReply || "").trim();
  const lower = raw.toLowerCase();
  if (!raw) return { type: "empty", quality: 0, action: "ask_for_first_thought" };
  if (detectNeedsTeaching(raw)) return { type: "stuck", quality: 1, action: "reteach_then_prompt" };
  if (/^[a-d]$|^选\s*[a-d]$|^choose\s*[a-d]$/i.test(raw)) return { type: "answer_only", quality: 1, action: "ask_for_method_not_letter" };
  if (raw.length < 12 || /不知道|随便|maybe|应该吧|不确定/.test(lower)) return { type: "thin", quality: 2, action: "give_sentence_frame" };
  const hasReason = /因为|所以|first|because|reason|evidence|关键词|方法|先|then|therefore/.test(lower);
  if (!hasReason) return { type: "claim_without_reason", quality: 3, action: "ask_why" };
  return { type: "method_attempt", quality: 4, action: "push_precision" };
}

export function coachingGapAnalysis(studentReply = "") {
  const text = String(studentReply || "").trim().toLowerCase();
  const answerOnly = /^[a-d]$|^选\s*[a-d]$|^choose\s*[a-d]$/i.test(text);
  const stuck = detectNeedsTeaching(text);
  const questionConfusion = /题目.*(问什么|什么意思|看不懂)|问题.*(问什么|什么意思)|不懂.*(题|问题).*问什么|看不懂.*题|what.*question|question.*ask/.test(text);
  const methodConfusion = /第一步|先看什么|怎么开始|从哪|不知道.*步骤|不知道.*方法|first step|where.*start/.test(text);
  const reasonConfusion = /为什么|原因|because|why|不知道.*解释|说不出.*理由/.test(text);
  const conceptConfusion = /知识点|概念|没学过|没吃透|前置|打不出来|写不出来|说不出来|完全不会|不明白|confused/.test(text);
  const hasGoal = /题目|问什么|要求|求什么|找什么|判断|比较|what|which|calculate|identify/.test(text);
  const hasMethod = /先|第一步|步骤|方法|看|找|变化|条件|证据|除以|比较|compare|divide|change|rate|evidence/.test(text);
  const hasReason = /因为|所以|为了|能帮|说明|证明|原因|why|because|so that|therefore/.test(text);
  const enoughDetail = text.replace(/\s+/g, "").length >= 18 || text.split(/\s+/).filter(Boolean).length >= 8;
  if (answerOnly) return { gap: "answer_only", label: "只写了答案", next: "不要先选答案，先写方法句。" };
  if (!text) return { gap: "stuck", label: "还没形成第一步", next: "先照老师给的第一步说一遍。" };
  if (stuck && reasonConfusion) return { gap: "reason_stuck", label: "原因说不出", next: "只补一句为什么这一步有用。" };
  if (stuck && methodConfusion) return { gap: "method_stuck", label: "第一步不会选", next: "只选第一步动作，不用完整解释。" };
  if (stuck && questionConfusion) return { gap: "question_goal", label: "题意没拆开", next: "先把题目翻译成一句话。" };
  if (stuck && conceptConfusion) return { gap: "concept", label: "概念没接上", next: "先补前置概念，再做半句填空。" };
  if (stuck) return { gap: "stuck", label: "还没形成第一步", next: "先照老师给的第一步说一遍。" };
  if (!hasGoal) return { gap: "goal", label: "题目目标不清楚", next: "先说这题要你判断什么。" };
  if (!hasMethod) return { gap: "method", label: "方法步骤不清楚", next: "补一句第一步看什么。" };
  if (!hasReason) return { gap: "reason", label: "原因说明不完整", next: "补一句为什么这一步有用。" };
  if (!enoughDetail) return { gap: "detail", label: "表达太短", next: "把目标、方法、原因连成完整句。" };
  return { gap: "precision", label: "需要更精确", next: "把关键词或证据说具体一点。" };
}

export function gapSentenceFrame(gap = {}, body = {}) {
  const skill = body.skill || "这个知识点";
  const hint = coachingHintForHistory(body) || mergedCoachHints(body)[0] || "题目里的关键词或条件";
  const frames = {
    answer_only: `这题考的是 ${skill}。我第一步先看____，因为____。`,
    stuck: `这题要我判断____。我可以先看 ${hint}。`,
    question_goal: `这题要我判断____。题目里的____是在提醒我。`,
    concept: `先记住：${skill} 是____。这题要我判断____。`,
    method_stuck: `我第一步先看 ${hint}。`,
    reason_stuck: `因为这一步能帮我____，所以不能只凭感觉选。`,
    goal: `这题要我判断 ${skill} 里的____。`,
    method: `我第一步先看 ${hint}，再判断____。`,
    reason: `因为这一步能帮我____，所以不能只凭感觉选。`,
    detail: `具体来说，题目里的____说明我的方法应该是____。`,
    precision: `我还要点出题目里的关键词：____，它说明____。`,
  };
  return frames[gap.gap] || "这题要我判断____。我第一步先看____，因为____。";
}

function oneStepFallbackPrompt(body = {}) {
  const coachingGap = coachingGapAnalysis(body.studentReply || "");
  return `我看到你现在缺的是：${coachingGap.label}。${coachingGap.next} 只补这一句：${gapSentenceFrame(coachingGap, body)}`;
}

function diagnosedGapLine(body = {}) {
  const coachingGap = coachingGapAnalysis(body.studentReply || "");
  return `卡点判断：${coachingGap.label}。`;
}

function stuckGapTeachingAction(body = {}) {
  const coachingGap = coachingGapAnalysis(body.studentReply || "");
  const skill = body.skill || "这个知识点";
  const shortExplanation = studentFriendlyConceptLineForApi(skill, body.subject, body.explanation);
  const example = teachingMiniExampleForApi(skill, body.subject);
  if (coachingGap.gap === "question_goal") {
    return `${diagnosedGapLine(body)}先把题目翻译成一句话。小讲解：${shortExplanation} 现在只做一小步：${gapSentenceFrame(coachingGap, body)}`;
  }
  if (coachingGap.gap === "concept") {
    return `${diagnosedGapLine(body)}这不是写作问题，先补前置概念。小讲解：${shortExplanation} 现在只做一小步：二选一：先看题干关键词，还是先看答案长短？再做半句填空：这题要我判断____。`;
  }
  if (coachingGap.gap === "method_stuck") {
    return `${diagnosedGapLine(body)}只选第一步动作。小讲解：${shortExplanation} 现在只做一小步：${gapSentenceFrame(coachingGap, body)}`;
  }
  if (coachingGap.gap === "reason_stuck") {
    return `${diagnosedGapLine(body)}只补因为。想一想这一步帮你找到什么线索：${gapSentenceFrame(coachingGap, body)}`;
  }
  return "";
}

function methodAttemptContinuation(body = {}) {
  const frame = "题目里的____说明____。";
  return `你已经说出方法雏形了，别重新开始。下一步只补具体条件：${frame}`;
}

function buildTeachingNote({ subject, skill, explanation }) {
  const concept = skill || "这个知识点";
  const base = explanation || `${concept} 是解这类题时要先弄清楚的核心概念。`;
  return [
    `如果学生概念不清，先进入“教练式讲解”模式。`,
    `如果学生说知识点没吃透、打不出来、说不出来，先讲清概念，不要要求学生先完整复述题意。`,
    `用 1 句短讲解说明 ${concept}，语言适合 ${subject || "当前学科"} 学生。`,
    `再给 1 个小例子或正反对比，但不要用题目中的正确选项当例子。`,
    `最后再问一个问题，但要用二选一或填空让学生只回答一个微步骤，把学生带回当前题目。`,
    `仍然不要直接说出正确选项、答案字母或最终答案。`,
    `可参考但不要照抄的教师说明：${base}`,
  ].join("\n");
}

function mergedCoachHints(body = {}) {
  return [...(body.layeredHints || []), ...(body.coachHints || [])].filter(Boolean);
}

function firstCommonMistake(body = {}) {
  return body.commonMistakes?.[0] || "";
}

function coachingHintForHistory(body = {}, offset = 0) {
  const hints = mergedCoachHints(body);
  const studentTurns = (body.history || []).filter((message) => message.role === "student").length;
  const coachTurns = (body.history || []).filter((message) => message.role === "coach").length;
  const index = Math.max(0, Math.min(Math.max(0, hints.length - 1), Math.max(studentTurns - 1, coachTurns - 1) + offset));
  return hints[index] || "";
}

function coachHistoryContains(body = {}, pattern) {
  return (body.history || []).some((message) => message.role === "coach" && pattern.test(String(message.text || "")));
}

function coachSessionMemory(body = {}) {
  const history = body.history || [];
  const studentMessages = history.filter((message) => message.role === "student").map((message) => String(message.text || ""));
  const coachMessages = history.filter((message) => message.role === "coach").map((message) => String(message.text || ""));
  const lastCoachMove = coachMessages.at(-1) || "";
  const repeatedStuck = [body.studentReply, ...studentMessages.slice(-3)].filter((reply) => detectNeedsTeaching(reply)).length >= 2;
  const priorGap = coachMessages.slice(-3).find((text) => /卡点判断/.test(text)) || "";
  return {
    repeatedStuck,
    priorGap,
    lastCoachMove,
    nextInstruction: repeatedStuck
      ? "延续上一轮卡点，不要重讲已经给过的同一句提示；直接降低任务，给下一小步。"
      : "根据最近一轮继续推进，不要像第一次辅导一样重新开始。",
  };
}

function needsImmediateConceptTeaching(studentReply = "") {
  return /不知道|不懂|看不懂|打不出来|写不出来|说不出来|没吃透|不清楚|完全不会|什么意思|概念没接上|概念没懂|don't understand|do not understand|dont understand|idk|confused/i.test(String(studentReply || ""));
}

function cannotProduceBecauseConceptGap(studentReply = "") {
  return /别人知识点没吃透|人家也打不出来|打不出来|写不出来|说不出来|没吃透|概念没接上|概念没懂/i.test(String(studentReply || ""));
}

export function needsSmallerTaskAfterRepeatedStuck(body = {}) {
  const studentMessages = (body.history || [])
    .filter((message) => message.role === "student")
    .map((message) => String(message.text || ""));
  const currentReply = String(body.studentReply || "");
  const currentIsStuck = detectNeedsTeaching(currentReply);
  const currentCannotProduceWords = needsImmediateConceptTeaching(currentReply);
  const stuckTurnCount = [body.studentReply, ...studentMessages.slice(-4)].filter((reply) => detectNeedsTeaching(reply)).length;
  return currentIsStuck && currentCannotProduceWords && (studentMessages.length >= 2 || stuckTurnCount >= 2);
}

function teachingMiniExampleForApi(skill = "", subject = "") {
  const text = `${skill} ${subject}`.toLowerCase();
  if (/slope|rate|linear|斜率|变化率|函数|比例/.test(text)) {
    return "小例子：如果 x 每多 1，y 都多 3，就先抓“每 1 个 x 变多少”。";
  }
  if (/equation|algebra|方程|代数|表达式|逆运算/.test(text)) {
    return "小例子：3x+5=20 先看 x 外面最后加了 5，所以第一步先处理 +5。";
  }
  if (/evidence|claim|central|reading|english|rla|证据|主张|中心|作者/.test(text)) {
    return "小例子：题目问作者观点时，先找观点句，再找能直接支持它的证据。";
  }
  if (/experiment|variable|science|biology|实验|变量|数据|科学|生物/.test(text)) {
    return "小例子：实验题先分清改变什么、测量什么、哪些条件保持不变。";
  }
  if (/geometry|triangle|proof|几何|三角形|证明|角/.test(text)) {
    return "小例子：证明题先标出已知边角，再判断这些条件能支持哪一步。";
  }
  return "小例子：先把题目目标和第一步拆开，再解释这一步为什么有用。";
}

function studentFriendlyConceptLineForApi(skill = "", subject = "", explanation = "") {
  const text = `${skill} ${subject} ${explanation}`.toLowerCase();
  const hasChineseExplanation = /[\u4e00-\u9fff]/.test(explanation || "");
  if (hasChineseExplanation && String(explanation).length <= 42) return explanation;
  if (/slope|rate|linear|斜率|变化率|函数|比例/.test(text)) return "斜率就是看 y 相对 x 怎么变，不能只看数字大小。";
  if (/evidence|claim|central|reading|english|rla|证据|主张|中心|作者/.test(text)) return "证据要支持观点，先找观点，再看证据是否直接相关。";
  if (/equation|algebra|方程|代数|表达式|逆运算/.test(text)) return "方程题先看未知数被做了什么运算，再用相反运算解开。";
  if (/experiment|variable|science|biology|实验|变量|数据|科学|生物/.test(text)) return "科学题先分清改变什么、测量什么，再看数据支持什么结论。";
  if (/geometry|triangle|proof|几何|三角形|证明|角/.test(text)) return "几何题先找已知边角关系，再判断能支持哪一步证明。";
  return `${skill || "这个知识点"} 要先分清题目目标和第一步线索。`;
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
    layeredHints = [],
    commonMistakes = [],
    studentReply,
    history = [],
    recentSkillMistakes = [],
  } = body;
  const step = getLearningStep(history);
  const needsTeaching = detectNeedsTeaching(studentReply);
  const replyAnalysis = analyzeStudentReply(studentReply);
  const coachingGap = coachingGapAnalysis(studentReply);
  const sessionMemory = coachSessionMemory({ ...body, history, studentReply });
  const currentStepForRequest = needsTeaching
    ? {
        ...step,
        instruction: "先教一个最小概念，再给一个小例子，只让学生补一个空，不要求完整复述题意。",
        fallback: "先听一句讲解，再只补半句填空。",
      }
    : step;
  const allHints = [...layeredHints, ...coachHints].filter(Boolean);
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
      "Respond to the student's actual reply quality: if answer-only, ask for method; if vague, give a sentence frame; if stuck, reteach briefly; if decent, push for precision.",
      "先用“卡点判断”命名学生缺少的部分，例如：卡点判断：题目目标不清楚。然后再教。",
      "卡住时固定顺序：卡点判断 → 小讲解 → 现在只做一小步。不要连续追问“题目问什么”。",
      "If the student cannot say what the question asks, do not keep asking the same meta-question. First teach the target concept in one sentence, give one tiny example, then provide a fill-in sentence.",
      "If the student says the knowledge point is not solid or they cannot type an answer, use teach-then-micro-step: 先讲清概念 → 小例子 → 二选一或填空. Do not demand a full restatement first.",
      "不要把“打不出来”当成懒得写；这是前置概念没接上。先补前置概念，再给半句填空，不能继续要求学生先说“问题问什么”。",
      "不要只让学生自己打出题目问什么；如果概念没接上，给两个可选小句或一个半句填空，学生只需要选择或补一个空，再过渡到完整方法句。",
      "Do not quote long English teacher explanations to the student. Rewrite them into short student-friendly Chinese.",
      "Use layeredHints in order: first clarify the goal, then the clue, then the full method sentence.",
      "Use commonMistakes to name the likely misconception before asking the next question.",
      "If the student is stuck, give one small hint, then ask the student to try.",
      "If the student is conceptually confused, teach briefly before asking again.",
      "教练式讲解格式：小讲解：... 例子：... 回到这题：...？",
      "Do not say Great job for incomplete or wrong reasoning; name the missing piece kindly.",
      "Use coachSessionMemory: 延续上一轮卡点，不要重讲已经给过的同一句提示；如果 lastCoachMove 已经给过填空，就给下一小步。",
      "Keep the reply under 110 Chinese characters.",
      mistakeNote,
      `Current step: ${currentStepForRequest.label}. ${currentStepForRequest.instruction}`,
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
              availableHints: allHints,
              commonMistakes,
              recentSkillMistakes: recentSkillMistakes.slice(0, 3),
              currentStep: currentStepForRequest,
              needsTeaching,
              replyAnalysis,
              coachingGap,
              coachSessionMemory: sessionMemory,
              recentHistory: history.slice(-8),
              studentReply,
              task:
                "Move the student one step forward. If the student cannot describe the question goal, teach first and give a fill-in sentence; do not simply ask them again what the question asks. If the student says they cannot type because the knowledge point is not solid, treat it as a concept gap, not a writing problem: 先补前置概念，再给半句填空. Use replyAnalysis, coachingGap, and coachSessionMemory to name the missing piece first with “卡点判断”, then give one concrete next sentence or question. If needsTeaching is true, follow this order: 卡点判断 → 小讲解 → 现在只做一小步. Do not reveal the correct answer.",
            }),
          },
        ],
      },
    ],
  };
}

export function buildFallbackReply(body = {}) {
  const step = getLearningStep(body.history || []);
  const hints = mergedCoachHints(body);
  const needsTeaching = detectNeedsTeaching(body.studentReply || "");
  const replyAnalysis = analyzeStudentReply(body.studentReply || "");
  const coachingGap = coachingGapAnalysis(body.studentReply || "");
  const sessionMemory = coachSessionMemory(body);
  const commonMistake = firstCommonMistake(body);
  const currentHint = coachingHintForHistory(body);
  const nextHint = coachingHintForHistory(body, 1);
  const mistakePrefix = body.recentSkillMistakes?.length
    ? `你之前在同类题上卡过 ${body.recentSkillMistakes[0].attempts || 1} 次，`
    : "";

  if (needsSmallerTaskAfterRepeatedStuck(body)) {
    return `${mistakePrefix}延续刚才的卡点，我来把任务再降一级：现在不要写完整解释，下一小步只完成一个空：我先看____，因为这一步能帮我判断方法。`;
  }

  if (sessionMemory.repeatedStuck && needsTeaching && /只做一小步|判断____|填空/.test(sessionMemory.lastCoachMove)) {
    return `${mistakePrefix}延续刚才的卡点。下一小步只补一个空：我先看____，因为这一步能帮我判断方法。`;
  }

  if (replyAnalysis.type === "answer_only") {
    if (coachHistoryContains(body, /第一步看____|只写了答案|答案字母/)) {
      return `${mistakePrefix}我们不重复刚才那句，直接做微练习：${gapSentenceFrame(coachingGap, body)}`;
    }
    return `${mistakePrefix}${commonMistake ? `常见误区：${commonMistake} ` : ""}${oneStepFallbackPrompt(body)}`;
  }

  if (replyAnalysis.type === "thin" || replyAnalysis.type === "claim_without_reason") {
    if (coachHistoryContains(body, /理由还不够|用这句补完整|原因说明不完整/)) {
      return `${mistakePrefix}换一种更小的任务：${gapSentenceFrame({ gap: "reason" }, body)}`;
    }
    return `${mistakePrefix}${nextHint ? `${nextHint} ` : ""}${oneStepFallbackPrompt(body)}`;
  }

  if (replyAnalysis.type === "method_attempt") {
    return `${mistakePrefix}${methodAttemptContinuation(body)}`;
  }

  if (needsTeaching && cannotProduceBecauseConceptGap(body.studentReply || "")) {
    return `${mistakePrefix}${stuckGapTeachingAction(body)}`;
  }

  if (needsTeaching && (needsImmediateConceptTeaching(body.studentReply || "") || !hints.length)) {
    const action = stuckGapTeachingAction(body);
    if (action) return `${mistakePrefix}${action}`;
    const skill = body.skill || "这个知识点";
    const shortExplanation = studentFriendlyConceptLineForApi(skill, body.subject, body.explanation);
    return `${mistakePrefix}${diagnosedGapLine(body)}你不是不努力，是概念没接上。小讲解：${shortExplanation} ${teachingMiniExampleForApi(skill, body.subject)} 先照这句改写，现在只做一小步：这题要我判断____。`;
  }

  if (step.id === "understand" && hints[0]) {
    return `${mistakePrefix}${hints[0]} 先不用选答案，${oneStepFallbackPrompt(body)}`;
  }

  if (step.id === "keywords" && hints[0]) {
    return `${mistakePrefix}${hints[0]} 现在找一个关键词，并说说它为什么重要。`;
  }

  if (step.id === "eliminate" && hints[1]) {
    return `${mistakePrefix}${hints[1]} ${commonMistake ? `常见误区：${commonMistake} ` : ""}先排除一个不合理想法，并说出理由。`;
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

export function mergeMasteryEvaluation(aiEvaluation, fallbackEvaluation) {
  if (!aiEvaluation) return fallbackEvaluation;
  if (fallbackEvaluation?.passed && !aiEvaluation.passed) return fallbackEvaluation;
  return aiEvaluation;
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
      reply: buildFallbackReply(request.body || {}),
      mode: "local_coach",
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
      const fallbackEvaluation = buildFallbackMasteryEvaluation(request.body || {});
      const evaluation = mergeMasteryEvaluation(extractMasteryEvaluation(data), fallbackEvaluation);
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
    const reply = safeTutorReply(extractOpenAIText(data), request.body || {});

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
