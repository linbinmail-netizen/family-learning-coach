function sendJson(response, statusCode, payload) {
  response.statusCode = statusCode;
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.end(JSON.stringify(payload));
}

function percent(correct = 0, total = 0) {
  return total > 0 ? Math.round((correct / total) * 100) : 0;
}

function topCounts(items = [], key) {
  const counts = new Map();
  for (const item of items) {
    const value = item?.[key];
    if (!value) continue;
    counts.set(value, (counts.get(value) || 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({ name, count }));
}

function difficultyAdvice({ accuracy = 0, guessingCount = 0, slowCount = 0 }) {
  if (guessingCount >= 2 && accuracy >= 70) {
    return "正确率不低但猜题信号明显，明天减少纯选择题，增加解释验证和方法复述，确认孩子不是靠排除选项猜对。";
  }
  if (guessingCount >= 2) {
    return "猜题信号明显，明天先补薄弱概念，再用少量解释验证题确认方法。";
  }
  if (accuracy >= 85) return "当前难度略低，明天可以加入 1-2 道挑战题。";
  if (accuracy < 60 || slowCount >= 2) return "当前难度偏高，明天先复习薄弱技能，再做同类变式题。";
  return "当前难度合适，明天保持同级难度并加入少量复习题。";
}

export function buildParentReport({
  studentName = "Student",
  answers = [],
  mistakes = [],
  mastery = [],
  sessions = [],
  minutesSpent,
} = {}) {
  const answered = answers.length || sessions.reduce((sum, item) => sum + (item.questions_answered || item.questionsAnswered || 0), 0);
  const correct =
    answers.filter((answer) => answer.is_correct || answer.isCorrect).length ||
    sessions.reduce((sum, item) => sum + (item.correct_count || item.correctCount || 0), 0);
  const accuracy = percent(correct, answered);
  const totalMinutes =
    minutesSpent ??
    sessions.reduce((sum, item) => sum + (item.minutes_spent || item.minutesSpent || 0), 0);
  const weakSkillCounts = topCounts(mistakes, "skill");
  const mistakeTypeCounts = topCounts(mistakes, "mistake_type").concat(topCounts(mistakes, "mistakeType"));
  const weakMastery = mastery
    .filter((item) => (item.mastery_score ?? item.mastery ?? 100) < 70 || item.status === "needs_review")
    .map((item) => item.skill)
    .filter(Boolean);
  const weakSkills = [...new Set(weakSkillCounts.map((item) => item.name).concat(weakMastery))].slice(0, 5);
  const guessingCount = answers.filter((answer) => answer.confidence === "guess" || answer.confidence === "unsure").length +
    sessions.reduce((sum, item) => sum + (item.guessing_count || item.guessingCount || 0), 0);
  const slowCount = sessions.reduce((sum, item) => sum + (item.slow_count || item.slowCount || 0), 0);
  const nextFocus = weakSkills[0] || "today's main skill";
  const advice = difficultyAdvice({ accuracy, guessingCount, slowCount });

  return {
    studentName,
    completedTasks: answered,
    totalTasks: Math.max(answered, 1),
    accuracy,
    minutesSpent: totalMinutes,
    weakSkills,
    highFrequencyMistakes: mistakeTypeCounts.slice(0, 3),
    nextSteps: [
      `明天先用 10 分钟复习 ${nextFocus}。`,
      "再做 3-4 道同技能变式题，并要求写出方法。",
      advice,
    ],
    summary: `今天 ${studentName} 完成了 ${answered} 道题，用时 ${totalMinutes || 0} 分钟，正确率 ${accuracy}%。`,
  };
}

export default async function handler(request, response) {
  if (request.method !== "POST") {
    sendJson(response, 405, { error: "Method not allowed" });
    return;
  }

  const report = buildParentReport(request.body || {});
  sendJson(response, 200, report);
}
