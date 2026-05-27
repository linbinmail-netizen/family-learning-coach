const defaultQuestions = [
  {
    id: "math-linear-1",
    subject: "Math",
    gradeLevel: 8,
    skill: "linear relationships",
    difficulty: 3,
    questionText: "A taxi charges $4 plus $2 per mile. Which equation represents the total cost y for x miles?",
    choices: ["y=2x+4", "y=4x+2", "y=6x", "y=x+6"],
    correctAnswer: "A",
    explanation: "The starting fee is 4 and each mile adds 2, so the equation is y = 2x + 4.",
    commonMistakes: { B: "Confused fixed fee and rate", C: "Added constants instead of forming an equation" },
    hintSteps: ["Find the starting fee.", "Find what changes each mile.", "Use y = rate x + starting fee."],
    variantQuestion: {
      questionText: "A gym charges $10 plus $5 per class. Write the equation for total cost y after x classes.",
      expectedMethod: "Use y = 5x + 10 because 10 is fixed and 5 changes per class.",
    },
  },
  {
    id: "reading-evidence-1",
    subject: "Reading",
    gradeLevel: 8,
    skill: "text evidence",
    difficulty: 3,
    questionText: "Which sentence best supports the author's claim that practice improves performance?",
    choices: ["A detail about practice results", "A setting description", "A character name", "A transition word"],
    correctAnswer: "A",
    explanation: "Evidence must directly support the claim, not just sound related.",
    commonMistakes: { B: "Picked background detail instead of evidence" },
    hintSteps: ["Find the claim.", "Find the sentence that proves it.", "Check whether the detail directly supports the claim."],
    variantQuestion: {
      questionText: "Find one sentence that proves a claim in a short passage.",
      expectedMethod: "First name the claim, then choose evidence that directly proves it.",
    },
  },
];

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function clampNumber(value, fallback, min, max) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.max(min, Math.min(max, Math.round(number)));
}

function normalizeSettings(settings = {}) {
  return {
    dailyMinutes: clampNumber(settings.dailyMinutes ?? settings.daily_minutes, 30, 10, 180),
    dailyQuestionCount: clampNumber(settings.dailyQuestionCount ?? settings.daily_question_count, 6, 1, 40),
    difficultyStrategy: ["steady", "auto", "challenge"].includes(settings.difficultyStrategy || settings.difficulty_strategy)
      ? settings.difficultyStrategy || settings.difficulty_strategy
      : "auto",
    focusSubjects: Array.isArray(settings.focusSubjects || settings.focus_subjects)
      ? settings.focusSubjects || settings.focus_subjects
      : ["Math", "Reading"],
  };
}

function weakSkillsFromRecords({ mastery = [], mistakes = [] } = {}) {
  const weakMastery = mastery
    .filter((item) => (item.masteryScore ?? item.mastery_score ?? item.mastery ?? 100) < 70 || item.status === "needs_review")
    .map((item) => item.skill);
  const mistakeSkills = mistakes.map((item) => item.skill);
  return [...new Set(weakMastery.concat(mistakeSkills).filter(Boolean))];
}

function selectQuestions({ questions = defaultQuestions, settings = {}, mastery = [], mistakes = [], count } = {}) {
  const normalized = normalizeSettings(settings);
  const targetCount = clampNumber(count ?? normalized.dailyQuestionCount, 6, 1, 40);
  const weakSkills = weakSkillsFromRecords({ mastery, mistakes });
  const focusSubjects = normalized.focusSubjects;
  const scored = questions.map((question, index) => {
    let score = 0;
    if (weakSkills.includes(question.skill)) score += 60;
    if (focusSubjects.includes(question.subject)) score += 25;
    if (normalized.difficultyStrategy === "challenge" && Number(question.difficulty) >= 3) score += 15;
    if (normalized.difficultyStrategy === "steady" && Number(question.difficulty) <= 3) score += 10;
    return { question, score, index };
  });

  return scored
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, targetCount)
    .map((item, sequence) => ({
      ...item.question,
      sequenceOrder: sequence + 1,
      status: "not_started",
    }));
}

export function generateDailyPlan({ studentId = "student", student = {}, settings = {}, mastery = [], mistakes = [], questions = defaultQuestions } = {}) {
  const normalized = normalizeSettings(settings);
  const selected = selectQuestions({ questions, settings: normalized, mastery, mistakes });
  return {
    studentId,
    planDate: todayIso(),
    status: "planned",
    subject: normalized.focusSubjects[0] || "Mixed",
    targetMinutes: normalized.dailyMinutes,
    targetQuestionCount: normalized.dailyQuestionCount,
    studentName: student.displayName || student.display_name || student.name || "Student",
    items: selected,
  };
}

export function buildStudentDashboard({ studentId = "student", student = {}, plan, answers = [], mistakes = [], mastery = [], xp = 0, streak = 0 } = {}) {
  const dailyPlan = plan || generateDailyPlan({ studentId, student, mastery, mistakes });
  const answered = answers.length;
  const correct = answers.filter((answer) => answer.isCorrect || answer.is_correct).length;
  const reviewedMistakes = mistakes.filter((mistake) => mistake.reviewStatus === "reviewed" || mistake.review_status === "reviewed").length;
  const todayXp = correct * 10 + reviewedMistakes * 15 + (answered >= dailyPlan.targetQuestionCount ? 30 : 0);
  const totalXp = xp + todayXp;
  const weakSkills = weakSkillsFromRecords({ mastery, mistakes }).slice(0, 5);

  return {
    studentId,
    studentName: dailyPlan.studentName,
    today: dailyPlan.planDate,
    progress: {
      answered,
      target: dailyPlan.targetQuestionCount,
      accuracy: answered ? Math.round((correct / answered) * 100) : 0,
      estimatedMinutes: dailyPlan.targetMinutes,
      openMistakes: mistakes.filter((mistake) => (mistake.reviewStatus || mistake.review_status || "needs_review") !== "mastered").length,
    },
    level: Math.floor(totalXp / 100) + 1,
    todayXp,
    totalXp,
    streak,
    weakestSkills: weakSkills,
    nextAction: weakSkills.length ? `先复习 ${weakSkills[0]}` : "开始今日任务",
    plan: dailyPlan,
  };
}

export function submitAnswerRecord({ studentId = "student", question = {}, studentAnswer = "", confidence = "unsure", timeSpentSeconds = 0 } = {}) {
  const selected = String(studentAnswer).trim().toUpperCase();
  const correct = String(question.correctAnswer || question.correct || "").trim().toUpperCase();
  const isCorrect = Boolean(correct && selected === correct);
  const mistakeType = isCorrect ? null : confidence === "guess" ? "guessed" : "concept_gap";
  return {
    studentId,
    questionId: question.id,
    studentAnswer: selected || studentAnswer,
    confidence,
    isCorrect,
    mistakeType,
    timeSpentSeconds: clampNumber(timeSpentSeconds, 0, 0, 7200),
    aiFeedback: isCorrect
      ? { summary: question.explanation || "Correct. Continue to the next question." }
      : {
          restatePrompt: "请写出第一步看什么，以及为什么。",
          hintSteps: question.hintSteps || question.hint_steps || [],
        },
    mistakeNotebookEntry: isCorrect
      ? null
      : {
          studentId,
          questionId: question.id,
          subject: question.subject,
          skill: question.skill,
          mistakeType,
          reviewStatus: "needs_review",
          nextReviewDate: todayIso(),
        },
  };
}

export function reviewMistakeRecord({ mistake = {}, variantPassed = false } = {}) {
  const currentCount = clampNumber(mistake.correctVariantCount || mistake.correct_variant_count, 0, 0, 20);
  const nextCount = variantPassed ? currentCount + 1 : 0;
  return {
    ...mistake,
    correctVariantCount: nextCount,
    reviewStatus: nextCount >= 2 ? "mastered" : "reviewed",
    nextReviewDate: nextCount >= 2 ? null : new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
  };
}

export function buildMasteryReport({ answers = [], mistakes = [], mastery = [] } = {}) {
  const answered = answers.length;
  const correct = answers.filter((answer) => answer.isCorrect || answer.is_correct).length;
  const correctRate = answered ? correct / answered : 0;
  const consistencyScore = answered >= 20 ? 1 : answered >= 5 ? 0.6 : 0.25;
  const recentImprovementScore = mastery.some((item) => (item.status || "") === "mastered") ? 1 : 0.5;
  const masteryScore = Math.round(correctRate * 60 + consistencyScore * 20 + recentImprovementScore * 20);
  const weakSkills = weakSkillsFromRecords({ mastery, mistakes }).slice(0, 5);
  const guessed = answers.filter((answer) => answer.confidence === "guess").length;
  const difficultyFit = correctRate > 0.85 && guessed === 0 ? "too_easy" : correctRate < 0.6 || guessed > 2 ? "too_hard" : "right_fit";

  return {
    answered,
    masteryScore,
    reliability: answered >= 20 ? "reliable" : answered >= 5 ? "early_signal" : "needs_more_data",
    weakSkills,
    highFrequencyMistakes: mistakes.slice(0, 5).map((mistake) => mistake.mistakeType || mistake.mistake_type || "unclear"),
    difficultyFit,
    sevenDayPlan: weakSkills.length
      ? weakSkills.slice(0, 3).map((skill, index) => ({ day: index + 1, focus: skill, task: "review mistakes, then complete variant practice" }))
      : [{ day: 1, focus: "daily mission", task: "complete today's practice and one reflection" }],
  };
}

export function updateLearningSettings(current = {}, updates = {}) {
  return normalizeSettings({ ...current, ...updates });
}

export function sendJson(response, statusCode, payload) {
  response.statusCode = statusCode;
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.end(JSON.stringify(payload));
}
