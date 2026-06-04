import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const html = readFileSync(new URL("./index.html", import.meta.url), "utf8");
const js = readFileSync(new URL("./app.js", import.meta.url), "utf8");
const css = readFileSync(new URL("./styles.css", import.meta.url), "utf8");

test("account roles are applied by login state, not manual role buttons", () => {
  assert.doesNotMatch(html, /id="accountList"/);
  assert.match(js, /const accounts = \[/);
  assert.match(js, /accountRole/);
  assert.match(js, /applyProfileToLocalState/);
});

test("student daily task view exists", () => {
  assert.match(html, /data-view="today"/);
  assert.match(html, /id="todayView"/);
  assert.match(html, /id="todayTaskList"/);
  assert.match(js, /buildDailyTasks/);
  assert.match(js, /renderTodayPlan/);
});

test("student dashboard recommends a clear three-step coach queue", () => {
  assert.match(html, /class="coach-queue-list" id="dashboardNextTraining"/);
  assert.match(js, /function studentCoachQueue/);
  assert.match(js, /label: "现在"/);
  assert.match(js, /label: "卡住时"/);
  assert.match(js, /label: "收尾"/);
  assert.match(js, /coach-queue-item/);
  assert.match(css, /coach-queue-list/);
  assert.match(css, /coach-queue-item\.active/);
});

test("daily missions show explicit task statuses", () => {
  assert.match(js, /function dailyMissionStatus/);
  assert.match(js, /Pending/);
  assert.match(js, /In Progress/);
  assert.match(js, /Completed/);
  assert.match(js, /Skipped/);
  assert.match(js, /mission-status-chip/);
  assert.match(css, /mission-status-in-progress/);
});

test("student dashboard is a mission control page, not only a chat entry", () => {
  assert.match(html, /id="studentDashboardStats"/);
  assert.match(html, /id="dashboardGreeting"/);
  assert.match(html, /id="dashboardLevel"/);
  assert.match(html, /id="dashboardStreak"/);
  assert.match(html, /id="dashboardXp"/);
  assert.match(html, /id="dashboardNextTraining"/);
  assert.match(js, /function dashboardStats/);
  assert.match(js, /Today Mission/);
  assert.match(css, /student-dashboard-hero/);
  assert.match(css, /student-dashboard-grid/);
});

test("student progress report includes badges and a weekly challenge", () => {
  assert.match(html, /id="studentBadgeGrid"/);
  assert.match(html, /id="weeklyChallengeText"/);
  assert.match(html, /id="weeklyChallengeProgress"/);
  assert.match(js, /function studentAchievementBadges/);
  assert.match(js, /function weeklyChallengeForStudent/);
  assert.match(js, /function renderStudentAchievements/);
  assert.match(js, /Steady Starter/);
  assert.match(js, /Mistake Fixer/);
  assert.match(js, /Skill Master/);
  assert.match(css, /achievement-badge/);
});

test("student learning path page has subject modules and mastery status", () => {
  assert.match(html, /data-view="learningPath"/);
  assert.match(html, /id="learningPathView"/);
  assert.match(html, /id="learningPathSubjects"/);
  assert.match(html, /id="learningPathModules"/);
  assert.match(html, /id="localSchoolPathPanel"/);
  assert.match(html, /id="localSchoolPlan"/);
  assert.match(js, /const learningPathCatalog/);
  assert.match(js, /function localSchoolPathForStudent/);
  assert.match(js, /Frisco ISD \/ Liberty High School/);
  assert.match(js, /Math/);
  assert.match(js, /Reading/);
  assert.match(js, /Writing/);
  assert.match(js, /Vocabulary/);
  assert.match(js, /SAT \/ PSAT Foundation/);
  assert.match(js, /function learningPathModulesFor/);
  assert.match(js, /Not Started/);
  assert.match(js, /Needs Review/);
  assert.match(js, /Mastered/);
  assert.match(css, /path-module-grid/);
  assert.match(css, /local-school-path/);
});

test("skill mastery tracking updates learning path and reports", () => {
  assert.match(js, /skillMastery: {}/);
  assert.match(js, /function skillMasteryKey/);
  assert.match(js, /function updateSkillMastery/);
  assert.match(js, /function masteryForSkill/);
  assert.match(js, /function weakSkillMasteryItems/);
  assert.match(js, /attempts/);
  assert.match(js, /accuracy/);
  assert.match(js, /status: skillMasteryStatus/);
  assert.match(js, /updateSkillMastery\(question, { correct: true, seconds: practiceEvent\.seconds }\)/);
  assert.match(js, /updateSkillMastery\(question, { guided: true }\)/);
  assert.match(js, /updateSkillMastery\(question, { reviewed: true }\)/);
  assert.match(js, /tracked\?\.mastery/);
});

test("skill mastery can sync with Supabase without blocking local progress", () => {
  assert.match(js, /loadSkillMasteryFromCloud/);
  assert.match(js, /saveSkillMasteryToCloud/);
  assert.match(js, /syncSkillMasteryToCloud/);
  assert.match(js, /skill_mastery/);
  assert.match(js, /saveSkillMasteryToCloud\(state\.skillMastery\[key\]\)\.catch/);
  assert.match(js, /Skill mastery cloud load skipped/);
});

test("student mistake notebook is filterable and opens review practice", () => {
  assert.match(html, /data-view="mistakes"/);
  assert.match(html, /id="mistakesView"/);
  assert.match(html, /id="mistakeSubjectFilter"/);
  assert.match(html, /id="mistakeSkillFilter"/);
  assert.match(html, /id="mistakeTypeFilter"/);
  assert.match(html, /id="mistakeNotebookList"/);
  assert.match(js, /function renderMistakeNotebook/);
  assert.match(js, /function mistakeTypeFor/);
  assert.match(js, /function nextReviewDateForMistake/);
  assert.match(js, /data-review-mistake/);
  assert.match(css, /mistake-filter-bar/);
});

test("practice page shows current subject skill difficulty and tool actions", () => {
  assert.match(html, /id="practiceContextPanel"/);
  assert.match(html, /id="practiceSubject"/);
  assert.match(html, /id="practiceSkill"/);
  assert.match(html, /id="practiceDifficulty"/);
  assert.match(html, /id="practiceProgress"/);
  assert.match(html, /id="practiceHintButton"/);
  assert.match(html, /id="practiceExplainButton"/);
  assert.match(html, /id="practiceSimilarButton"/);
  assert.match(html, /id="raiseDifficultyButton"/);
  assert.match(js, /practiceSubject"\)\.textContent = subject\.label/);
  assert.match(js, /questionTypeLabel\(question\)/);
  assert.match(js, /practiceSimilarButton"\)\.addEventListener/);
  assert.match(css, /practice-context-panel/);
});

test("student can manually raise difficulty when questions feel too easy", () => {
  assert.match(html, /太简单/);
  assert.match(js, /function raiseDifficultyOnDemand/);
  assert.match(js, /challengeBoostRemaining: 3/);
  assert.match(js, /手动升难度/);
  assert.match(js, /nextAdaptiveQuestionIndex\(questions, state\.currentQuestion, \{ isCorrect: true, level: nextLevel, challengeMode: true, raisedLevel: true \}\)/);
  assert.match(js, /raiseDifficultyButton"\)\.addEventListener\("click", raiseDifficultyOnDemand\)/);
  assert.match(js, /state\.lastAdvanceNotice = "你觉得太简单，系统已切到同一个知识点的更高难度解释题或挑战题，证明不是靠选项猜对。"/);
});

test("manual too-easy boost forces the next question to require written method proof", () => {
  assert.match(js, /forcedChallengeQuestionKeys: \{\}/);
  assert.match(js, /state\.forcedChallengeQuestionKeys\[questionStableKey\(questions\[preferredIndex\]\)\] = true/);
  assert.match(js, /manualTooEasyChallenge/);
  assert.match(js, /你说太简单后，这题必须先写方法证明/);
  assert.match(js, /不再做基础选择题/);
  assert.match(js, /state\.forcedChallengeQuestionKeys\?\.hasOwnProperty\(questionStableKey\(question\)\)/);
  assert.match(js, /requiresPreAnswerThought\(question\)/);
});

test("student sees why the difficulty is changing and what comes next", () => {
  assert.match(html, /id="difficultyCoachCard"/);
  assert.match(html, /id="difficultyCoachLevel"/);
  assert.match(html, /id="difficultyCoachReason"/);
  assert.match(html, /id="difficultyCoachNext"/);
  assert.match(js, /function difficultyCoachState/);
  assert.match(js, /function renderDifficultyCoachCard/);
  assert.match(js, /renderDifficultyCoachCard\(question, adaptiveLevel, challengeMode\)/);
  assert.match(js, /答得太顺/);
  assert.match(js, /下一题会优先安排解释型或学校考试深度题/);
  assert.match(js, /前 6 题会穿插至少 2 道深度题/);
  assert.match(css, /difficulty-coach-card/);
});

test("manual too-easy message explains same-skill depth verification", () => {
  const boostBlock = js.match(/function raiseDifficultyOnDemand[\s\S]*?function activeQuestions/)?.[0] || "";

  assert.match(boostBlock, /同一个知识点/);
  assert.match(boostBlock, /解释题/);
  assert.match(boostBlock, /证明不是靠选项猜对/);
});

test("manual too-easy boost stores the current skill for same-skill variant missions", () => {
  const boostBlock = js.match(/function raiseDifficultyOnDemand[\s\S]*?function activeQuestions/)?.[0] || "";
  const completionBlock = js.match(/function questionCompletesChallengeMission[\s\S]*?function challengeMissionCompletionNotice/)?.[0] || "";

  assert.match(boostBlock, /const currentQuestion = activeQuestions\(\)\[state\.currentQuestion\] \|\| \{\}/);
  assert.match(boostBlock, /challengeQueue: buildChallengeMissionQueue\(currentQuestion, \{ correctStreak: 2 \}\)/);
  assert.match(boostBlock, /challengeSkill: currentQuestion\?\.skill \|\| activeDiagnostic\(\)\.skills\[0\]\[0\]/);
  assert.match(completionBlock, /state\.adaptiveStats\[subjectId\]\?\.challengeSkill/);
  assert.match(completionBlock, /question\.skill === previousSkill/);
  assert.doesNotMatch(boostBlock + completionBlock, /正确答案是|答案是/);
});

test("voice coach input is available as an optional browser feature", () => {
  assert.match(html, /id="coachVoiceButton"/);
  assert.match(html, /id="inlineVoiceButton"/);
  assert.match(html, /id="coachVoiceStatus"/);
  assert.match(html, /id="inlineVoiceStatus"/);
  assert.match(js, /function startVoiceInput/);
  assert.match(js, /SpeechRecognition \|\| window\.webkitSpeechRecognition/);
  assert.match(js, /startVoiceInput\("studentReply", "coachVoiceStatus"\)/);
  assert.match(js, /startVoiceInput\("inlineCoachReply", "inlineVoiceStatus"\)/);
  assert.match(css, /voice-status/);
});

test("student home has clear action buttons", () => {
  assert.match(html, /id="studentActionBar"/);
  assert.match(html, /id="startDiagnosticButton"/);
  assert.match(html, /id="reviewMistakesButton"/);
  assert.match(html, /id="askCoachButton"/);
  assert.match(js, /renderStudentActionBar/);
  assert.match(js, /开始今日学习/);
  assert.match(js, /复习错题/);
  assert.match(js, /AI 教练/);
});

test("student home action buttons do not collapse into narrow vertical labels", () => {
  assert.match(css, /\.student-action-bar\s*{[\s\S]*display: flex/);
  assert.match(css, /\.student-action-bar button\s*{[\s\S]*min-width: 128px/);
  assert.match(css, /\.student-action-bar button\s*{[\s\S]*white-space: normal/);
});

test("family illustration sits under the platform title as a background without changing workspace layout", () => {
  assert.doesNotMatch(html, /id="familyMemoryCard"/);
  assert.doesNotMatch(css, /family-memory-card/);
  assert.match(css, /\.login-card::before\s*{[\s\S]*assets\/family-learning-memory\.png/);
  assert.match(css, /\.sidebar::before\s*{[\s\S]*assets\/family-learning-memory\.png/);
  assert.match(css, /\.login-card > \*,\s*\.sidebar > \*\s*{[\s\S]*z-index: 1/);
  assert.match(css, /\.workspace\s*{[\s\S]*display: block/);
  assert.doesNotMatch(css, /grid-template-columns: minmax\(170px, 220px\) minmax\(0, 1fr\)/);
});

test("parent report explains fit, issue type, and next action", () => {
  assert.match(html, /id="difficultyFit"/);
  assert.match(html, /id="issueType"/);
  assert.match(html, /id="nextAction"/);
  assert.match(js, /buildLearningInsights/);
  assert.match(js, /difficultyFit/);
  assert.match(js, /issueType/);
  assert.match(js, /nextAction/);
  assert.match(js, /难度是否合适/);
});

test("parent report uses too-easy evidence, not only accuracy", () => {
  assert.match(js, /function tooEasyEvidenceForSubject/);
  assert.match(js, /challengeBoostForSubject\(state\.subject\)/);
  assert.match(js, /challengeProofSummary\(state\.studentId\)\.total/);
  assert.match(js, /tooEasyEvidence\.active/);
  assert.match(js, /太容易信号/);
  assert.match(js, /下一轮直接增加学校考试深度题/);
  assert.match(js, /buildLearningInsights\(\{[\s\S]*tooEasyEvidence/);
  assert.doesNotMatch(js, /tooEasyEvidenceForSubject[\s\S]*正确答案是/);
});

test("student dashboard immediately surfaces too-easy evidence as challenge work", () => {
  assert.match(js, /const tooEasyEvidence = tooEasyEvidenceForSubject\(\)/);
  assert.match(js, /nextStudentAction\(tasks, tooEasyEvidence\)/);
  assert.match(js, /studentCoachQueue\(\{ focusSubject, stats, completion, tooEasyEvidence \}\)/);
  assert.match(js, /function nextStudentAction\(tasks = buildDailyTasks\(\), tooEasyEvidence = tooEasyEvidenceForSubject\(\)\)/);
  assert.match(js, /今天题目偏容易/);
  assert.match(js, /先做学校考试深度题/);
  assert.match(js, /先写方法，再选答案/);
  assert.doesNotMatch(js, /今天题目偏容易[\s\S]*正确答案是/);
});

test("student dashboard names completed challenge proofs when deciding next difficulty step", () => {
  const nextActionBlock = js.match(/function nextStudentAction[\s\S]*?function mergeQuestions/)?.[0] || "";
  const coachQueueBlock = js.match(/function studentCoachQueue[\s\S]*?function renderLearningPath/)?.[0] || "";
  assert.match(nextActionBlock, /tooEasyEvidence\.challengeProofs > 0/);
  assert.match(nextActionBlock, /已完成 \$\{tooEasyEvidence\.challengeProofs\} 条挑战证明/);
  assert.match(coachQueueBlock, /tooEasyEvidence\.challengeProofs > 0/);
  assert.match(coachQueueBlock, /挑战证明/);
  assert.doesNotMatch(nextActionBlock + coachQueueBlock, /正确答案是|答案是/);
});

test("missed questions feed a review loop", () => {
  assert.match(html, /id="mistakeReviewList"/);
  assert.match(html, /id="reportMistakes"/);
  assert.match(js, /mistakeLog/);
  assert.match(js, /recordMistake/);
  assert.match(js, /mistakesForStudent/);
  assert.match(js, /错题复习/);
  assert.match(js, /renderMistakeReview/);
});

test("mistake review can sync with Supabase", () => {
  assert.match(js, /loadMistakesFromCloud/);
  assert.match(js, /saveMistakeToCloud/);
  assert.match(js, /mistake_reviews/);
  assert.match(js, /syncMistakeLogToCloud/);
});

test("parent dashboard shows a weekly learning trend", () => {
  assert.match(html, /id="weeklyTrend"/);
  assert.match(html, /id="weeklyStats"/);
  assert.match(html, /id="weeklyMistakes"/);
  assert.match(html, /id="weeklyNextPlan"/);
  assert.match(js, /buildWeeklyTrend/);
  assert.match(js, /renderWeeklyTrend/);
  assert.match(js, /本周学习趋势/);
  assert.match(js, /高频错题知识点/);
  assert.match(js, /weeklySessions/);
  assert.match(js, /hintsUsed/);
  assert.match(js, /slowCount/);
  assert.match(js, /guessingCount/);
});

test("parent dashboard includes clear summary cards and recommendation", () => {
  assert.match(html, /id="parentDashboardSummary"/);
  assert.match(html, /id="parentTodayTime"/);
  assert.match(html, /id="parentCompletedTasks"/);
  assert.match(html, /id="parentMistakeCount"/);
  assert.match(html, /id="parentRecommendation"/);
  assert.match(js, /function renderParentDashboardSummary/);
  assert.match(js, /复习 \$\{weakSkills\[0\]\}/);
  assert.match(css, /parent-dashboard-grid/);
});

test("parent can send the daily digest as an email draft", () => {
  assert.match(html, /id="emailDigestButton"/);
  assert.match(html, /发送日报邮件/);
  assert.match(js, /function parentDigestMailtoUrl/);
  assert.match(js, /mailto:/);
  assert.match(js, /parentDigestEmailAddress/);
  assert.match(js, /linbinmail@gmail\.com/);
});

test("parent digest can use automatic email API with mailto fallback", () => {
  assert.match(js, /function sendParentDigestEmail/);
  assert.match(js, /\/api\/digest-email/);
  assert.match(js, /日报邮件已发送/);
  assert.match(js, /未配置自动邮件，已打开邮件草稿/);
});

test("parent dashboard shows production readiness status", () => {
  assert.match(html, /id="productionReadinessPanel"/);
  assert.match(html, /id="productionReadinessStatus"/);
  assert.match(html, /id="productionReadinessList"/);
  assert.match(js, /function renderProductionReadiness/);
  assert.match(js, /\/api\/system-status/);
  assert.match(js, /checkCloudTable\("skill_mastery"\)/);
  assert.match(js, /checkCloudTable\("practice_sessions"\)/);
  assert.match(js, /000_run_all_learning_platform\.sql/);
  assert.match(js, /完整学习闭环表/);
  assert.match(js, /标准学习 API/);
  assert.match(js, /launchChecklist/);
  assert.match(js, /上线验收/);
  assert.match(js, /下一步最优先/);
  assert.match(js, /每日自动日报/);
  assert.match(js, /scheduledDigestConfigured/);
  assert.match(css, /readiness-grid/);
});

test("student answer submission also syncs through the standard learning API", () => {
  assert.match(html, /id="answerSyncStatus"/);
  assert.match(js, /function callLearningApi/);
  assert.match(js, /function setAnswerSyncStatus/);
  assert.match(js, /function syncAnswerSubmitToApi/);
  assert.match(js, /\/api\/answer\/submit/);
  assert.match(js, /错题已记录/);
  assert.match(js, /本地已保存/);
  assert.match(js, /syncAnswerSubmitToApi\(question, selectedIndex, confidence, practiceEvent\)/);
  assert.match(js, /subjectLabelById/);
  assert.match(css, /sync-pill/);
});

test("parent can adjust study plan settings", () => {
  assert.match(html, /id="parentPlanForm"/);
  assert.match(html, /id="planMinutes"/);
  assert.match(html, /id="planQuestionTarget"/);
  assert.match(html, /id="planDifficultyMode"/);
  assert.match(html, /id="planFocusSubject"/);
  assert.match(js, /saveParentPlanSettings/);
  assert.match(js, /renderParentPlanControls/);
});

test("parent plan controls shape the student daily task", () => {
  assert.match(js, /questionTarget/);
  assert.match(js, /difficultyMode/);
  assert.match(js, /difficultyModeLabel/);
  assert.match(js, /applyDifficultyMode/);
  assert.match(js, /plan\.questionTarget/);
  assert.match(js, /plan\.difficultyMode/);
});

test("student daily plan supports a two-hour learning structure", () => {
  assert.match(html, /<option value="120">120 分钟<\/option>/);
  assert.match(html, /<option value="24">24 题<\/option>/);
  assert.match(js, /function buildTwoHourLearningBlocks/);
  assert.match(js, /概念讲解/);
  assert.match(js, /基础练习/);
  assert.match(js, /错题复盘/);
  assert.match(js, /挑战拔高/);
  assert.match(js, /今日总结/);
});

test("default student plans are two-hour sessions, not short templates", () => {
  assert.match(js, /older: \{ minutes: 120, questionTarget: 24, difficultyMode: "adaptive", focusSubject: "english1" \}/);
  assert.match(js, /younger: \{ minutes: 120, questionTarget: 24, difficultyMode: "adaptive", focusSubject: "math8" \}/);
  assert.match(js, /minutes: 120,\s*questionTarget: 24/);
  assert.match(js, /完成约 \$\{schoolDepthTarget\} 道学校考试深度题或解释题/);
  assert.match(js, /完成约 \$\{foundationTarget\} 道基础热身题/);
  assert.match(js, /完成约 \$\{challengeTarget\} 道挑战题或解释题/);
});

test("default two-hour plans reduce easy practice and favor school-depth work", () => {
  assert.match(js, /const schoolDepthTarget = plan\.difficultyMode === "adaptive"\s*\? Math\.max\(5, Math\.round\(targetQuestions \* 0\.25\)\)/);
  assert.match(js, /const foundationTarget = plan\.difficultyMode === "adaptive"\s*\? Math\.max\(1, Math\.round\(targetQuestions \* 0\.12\)\)/);
  assert.match(js, /const challengeTarget = Math\.max\(6, targetQuestions - schoolDepthTarget - foundationTarget - reviewTarget\)/);
  assert.match(js, /基础题只保留查漏补缺，不占用主要时间/);
  assert.match(js, /学校考试深度题和解释题占主要比例/);
  assert.match(js, /isTwoHourPlan\(plan\) && plan\.difficultyMode === "adaptive"\) return Math\.min\(limit, Math\.max\(8, Math\.round\(limit \* 0\.55\)\)\)/);
});

test("two-hour daily task list opens with school depth before foundation warmup", () => {
  const planBlock = js.match(/function buildTwoHourLearningBlocks[\s\S]*?function twoHourBlockMinutes/)?.[0] || js.match(/function buildTwoHourLearningBlocks[\s\S]*?function learningBlockForQuestionIndex/)?.[0] || "";
  assert.match(planBlock, /schoolDepthTarget/);
  assert.match(planBlock, /学校深度起步/);
  assert.match(planBlock, /基础热身/);
  assert.match(planBlock, /Math\.round\(targetQuestions \* 0\.25\)/);
  assert.match(planBlock, /Math\.round\(targetQuestions \* 0\.12\)/);
  assert.doesNotMatch(planBlock, /基础练习/);
  assert.doesNotMatch(planBlock, /targetQuestions \* 0\.45/);
});

test("saved old short default plans migrate to two-hour sessions without overwriting custom plans", () => {
  assert.match(js, /function upgradeSavedShortPlanSettings/);
  assert.match(js, /plan\.minutes === 30 && plan\.questionTarget === 8/);
  assert.match(js, /\{ \.\.\.plan, minutes: 120, questionTarget: 24 \}/);
  assert.match(js, /upgradeSavedShortPlanSettings\(state\.planSettings\)/);
});

test("parent can apply a one-click two-hour plan preset", () => {
  assert.match(html, /id="applyTwoHourPlanPreset"/);
  assert.match(html, /一键 2 小时计划/);
  assert.match(js, /function applyTwoHourPlanPreset/);
  assert.match(js, /planMinutes"\)\.value = "120"/);
  assert.match(js, /planQuestionTarget"\)\.value = "24"/);
  assert.match(js, /planDifficultyMode"\)\.value = "adaptive"/);
});

test("two-hour student plan shows estimated time for each learning block", () => {
  assert.match(js, /function twoHourBlockMinutes/);
  assert.match(js, /minutes: blockMinutes\.concept/);
  assert.match(js, /minutes: blockMinutes\.foundation/);
  assert.match(js, /minutes: blockMinutes\.review/);
  assert.match(js, /minutes: blockMinutes\.challenge/);
  assert.match(js, /minutes: blockMinutes\.summary/);
  assert.match(js, /预计/);
});

test("student lesson view shows the current learning route", () => {
  assert.match(html, /id="learningRouteMap"/);
  assert.match(js, /function learningRouteBlocks/);
  assert.match(js, /function renderLearningRouteMap/);
  assert.match(js, /route-step active/);
  assert.match(js, /route-step done/);
  assert.match(js, /learning-progress/);
  assert.match(js, /今日进度/);
  assert.match(js, /学习路线/);
});

test("two-hour route starts with school-depth work instead of a long foundation block", () => {
  const routeBlock = js.match(/function learningRouteBlocks[\s\S]*?function advancedQuestionRatio/)?.[0] || "";
  const blockForQuestion = js.match(/function learningBlockForQuestionIndex[\s\S]*?function learningRouteBlocks/)?.[0] || "";
  assert.match(js, /function twoHourQuestionBlockTargets/);
  assert.match(routeBlock, /学校深度起步/);
  assert.match(routeBlock, /schoolDepth/);
  assert.match(blockForQuestion, /学校深度起步/);
  assert.doesNotMatch(routeBlock, /targetQuestions \* 0\.45/);
  assert.doesNotMatch(blockForQuestion, /targetQuestions \* 0\.45/);
});

test("student lesson view gives a clear next-step instruction", () => {
  assert.match(html, /id="studentNextStepCard"/);
  assert.match(html, /id="studentNextStepBadge"/);
  assert.match(html, /id="studentNextStepTitle"/);
  assert.match(html, /id="studentNextStepBody"/);
  assert.match(js, /function studentNextStepState/);
  assert.match(js, /function renderStudentNextStep/);
  assert.match(js, /先独立作答/);
  assert.match(js, /讲解和方法步骤会在答错或不确定后出现/);
  assert.match(js, /完成 AI 引导/);
  assert.match(js, /可以进入下一题/);
});

test("student next-step card explains why correct answers trigger harder work", () => {
  assert.match(js, /const tooEasyEvidence = tooEasyEvidenceForSubject\(\)/);
  assert.match(js, /selectedAnswer === question\.correct && confidence === "sure" && tooEasyEvidence\.active/);
  assert.match(js, /准备拔高/);
  assert.match(js, /下一题切到深度题/);
  assert.match(js, /先写方法，再选答案/);
  assert.doesNotMatch(js, /下一题切到深度题[\s\S]*正确答案是/);
});

test("student does not see lesson hints before the first answer", () => {
  assert.match(js, /showLessonAfterAttempt/);
  assert.match(js, /miniLessonCard"\)\.classList\.toggle\("hidden", !showLessonAfterAttempt\)/);
  assert.match(css, /mini-lesson-card\.hidden/);
  assert.match(js, /先独立作答。不会、不确定或猜的，提交后系统再讲解和引导。/);
});

test("student is moved to guidance after a wrong or uncertain answer", () => {
  assert.match(js, /function focusGuidancePanel/);
  assert.match(js, /scrollIntoView/);
  assert.match(js, /inlineCoachReply"\)\?\.focus/);
  assert.match(js, /if \(issue\) focusGuidancePanel/);
});

test("student advances automatically after a correct confident answer", () => {
  assert.match(js, /function advanceToNextQuestionAfterCompletion/);
  assert.match(js, /advanceToNextQuestionAfterCompletion\(state\.currentQuestion, "correct", preferredNextIndex\)/);
  assert.match(js, /上一题答对了，已进入第/);
  assert.match(js, /state\.currentQuestion = canUsePreferred \? preferredIndex : Math\.min\(questions\.length - 1, answeredIndex \+ 1\)/);
});

test("automatic jump to a harder question explains the reason to the student", () => {
  assert.match(js, /function advanceNoticeForNextQuestion/);
  assert.match(js, /isExplanationFirstChallenge\(nextQuestion\)/);
  assert.match(js, /上一题太轻松/);
  assert.match(js, /这题会更像学校考试深度题/);
  assert.match(js, /先写方法，再选答案/);
  assert.match(js, /advanceNoticeForNextQuestion\(questions\[state\.currentQuestion\], mode, canUsePreferred\)/);
  assert.doesNotMatch(js, /上一题太轻松[\s\S]*正确答案是/);
});

test("automatic jump notice explains same-skill school-depth proof", () => {
  const noticeBlock = js.match(/function advanceNoticeForNextQuestion[\s\S]*?function recordChallengeProof/)?.[0] || "";
  assert.match(noticeBlock, /isProofCapableSchoolPractice\(nextQuestion\)/);
  assert.match(noticeBlock, /同一个知识点/);
  assert.match(noticeBlock, /学校考试深度题/);
  assert.match(noticeBlock, /不是随机加难/);
  assert.doesNotMatch(noticeBlock, /正确答案是|答案是/);
});

test("easy correct promotion explains the evidence behind the harder next question", () => {
  assert.match(js, /function adaptivePromotionEvidence/);
  assert.match(js, /答得快/);
  assert.match(js, /连续答对/);
  assert.match(js, /自己选择了“确定”/);
  assert.match(js, /adaptivePromotionEvidence\(adaptiveResult\)/);
  assert.match(js, /因为\$\{evidence\}/);
  assert.match(js, /下一题会更像学校考试深度题/);
  assert.doesNotMatch(js, /adaptivePromotionEvidence[\s\S]*正确答案是/);
});

test("student advances automatically after guided mastery is completed", () => {
  assert.match(js, /advanceToNextQuestionAfterCompletion\(state\.guidanceLock\.questionIndex, "guided", preferredIndex\)/);
  assert.match(js, /引导完成，已进入第/);
});

test("student guidance starts with a structured mistake insight card", () => {
  assert.match(html, /id="guidanceInsightCard"/);
  assert.match(html, /id="guidanceIssueType"/);
  assert.match(html, /id="guidanceSkillGap"/);
  assert.match(html, /id="guidanceRepairAction"/);
  assert.match(js, /function guidanceInsightForLock/);
  assert.match(js, /renderGuidanceInsight/);
  assert.match(js, /不显示正确答案/);
  assert.match(css, /guidance-insight-card/);
});

test("wrong-answer guidance uses coach feedback diagnosis in the student panel", () => {
  assert.match(js, /function requestCoachFeedbackForGuidance/);
  assert.match(js, /\/api\/coach-feedback/);
  assert.match(js, /coachFeedback/);
  assert.match(js, /diagnosis/);
  assert.match(js, /hintLevel1/);
  assert.match(js, /restatePrompt/);
  assert.match(js, /requestCoachFeedbackForGuidance\(question, selectedIndex, confidence, issue\)/);
  assert.match(js, /lock\.coachFeedback\?\.diagnosis/);
  assert.match(js, /lock\.coachFeedback\?\.hintLevel1/);
});

test("student guidance shows a single current task card", () => {
  assert.match(html, /id="guidanceTaskCard"/);
  assert.match(html, /id="guidanceTaskBadge"/);
  assert.match(html, /id="guidanceTaskTitle"/);
  assert.match(html, /id="guidanceTaskBody"/);
  assert.match(js, /function guidanceCurrentTaskForLock/);
  assert.match(js, /function renderGuidanceTask/);
  assert.match(html, /现在只做这一步/);
  assert.match(js, /第 3 步 \/ 变式验证/);
  assert.match(js, /卡住时可以补下一句/);
  assert.match(js, /renderGuidanceTask\(lock\)/);
  assert.match(css, /guidance-task-card/);
});

test("student guidance shows a visible teach-example-try ladder after mistakes", () => {
  assert.match(html, /id="guidanceLadderCard"/);
  assert.match(html, /id="guidanceLadderTeach"/);
  assert.match(html, /id="guidanceLadderExample"/);
  assert.match(html, /id="guidanceLadderTry"/);
  assert.match(js, /function guidanceLadderForLock/);
  assert.match(js, /function renderGuidanceLadder/);
  assert.match(js, /renderGuidanceLadder\(lock\)/);
  assert.match(js, /小讲解/);
  assert.match(js, /小例子/);
  assert.match(js, /你来一步/);
  assert.match(css, /guidance-ladder-card/);
  assert.doesNotMatch(js, /guidanceLadderForLock[\s\S]*正确答案是/);
});

test("student guidance shows next-question unlock conditions", () => {
  assert.match(html, /id="guidanceUnlockCard"/);
  assert.match(html, /id="guidanceUnlockList"/);
  assert.match(html, /解锁下一题需要完成/);
  assert.match(html, /通过一道变式验证/);
  assert.match(js, /function guidanceUnlockItemsForLock/);
  assert.match(js, /function renderGuidanceUnlockProgress/);
  assert.match(js, /听懂错因和方法/);
  assert.match(js, /跟着支架补方法/);
  assert.match(js, /renderGuidanceUnlockProgress\(lock\)/);
  assert.match(js, /renderGuidanceUnlockProgress\(\)/);
  assert.match(css, /guidance-unlock-card/);
});

test("student guidance includes a three-part method restatement scaffold", () => {
  assert.match(html, /id="guidanceScaffoldCard"/);
  assert.match(html, /id="scaffoldQuestionFocus"/);
  assert.match(html, /id="scaffoldFirstStep"/);
  assert.match(html, /id="scaffoldReasonStarter"/);
  assert.match(js, /function guidanceScaffoldForLock/);
  assert.match(js, /renderGuidanceScaffold/);
  assert.match(js, /题目目标：系统先帮你翻译/);
  assert.match(js, /第一步看什么/);
  assert.match(js, /为什么这样做/);
  assert.match(css, /guidance-scaffold-card/);
});

test("student guidance scaffold prefers layered AI hints and lesson steps", () => {
  assert.match(js, /question\?\.aiHintLevel1/);
  assert.match(js, /question\?\.aiHintLevel2/);
  assert.match(js, /question\?\.aiHintLevel3/);
  assert.match(js, /function coachingHintForTurn/);
  assert.match(js, /const firstHint = coachingHintForTurn/);
});

test("student guidance reply gives immediate quality feedback while typing", () => {
  assert.match(html, /id="replyQualityCard"/);
  assert.match(html, /id="replyQualityStatus"/);
  assert.match(html, /id="replyProgressText"/);
  assert.match(html, /id="qualityQuestionGoal"/);
  assert.match(html, /id="qualityMethodStep"/);
  assert.match(html, /id="qualityReasonWhy"/);
  assert.match(html, /id="qualitySpecificEvidence"/);
  assert.match(html, /id="replyNextSentenceText"/);
  assert.match(js, /function evaluateGuidanceReplyQuality/);
  assert.match(js, /function guidanceReplyProgressText/);
  assert.match(js, /function guidanceSubmitButtonText/);
  assert.match(js, /function renderReplyQuality/);
  assert.match(js, /function guidanceNextMissingSentence/);
  assert.match(js, /inlineCoachReply"\)\.addEventListener\("input"/);
  assert.match(css, /reply-quality-card/);
  assert.match(css, /reply-progress-text/);
});

test("student guidance quality checklist shows concrete evidence as its own step", () => {
  assert.match(html, /具体证据/);
  assert.match(html, /先完成题目目标、方法步骤、原因说明、具体证据 4 个部分/);
  assert.match(js, /\["qualitySpecificEvidence", quality\.specificEvidence\]/);
  assert.match(js, /已完成 \$\{completed\}\/4/);
  assert.doesNotMatch(html, /先完成题目目标、方法步骤、原因说明 3 个部分/);
});

test("student guidance entry copy does not ask stuck students to explain the question first", () => {
  assert.match(html, /告诉 AI 你卡在概念、第一步、原因还是具体证据/);
  assert.match(html, /先听讲解，再做一小步/);
  assert.doesNotMatch(html, /placeholder="用自己的话写：这题真正问什么/);
  assert.doesNotMatch(html, /<strong id="guidanceTaskTitle">先说题目问什么<\/strong>/);
});

test("student guidance quick replies include a concrete evidence stuck option", () => {
  assert.match(html, /不会找证据/);
  assert.match(html, /我会第一步和原因，但不知道题目里的具体证据怎么找。/);
  assert.match(js, /const evidenceConfusion =/);
  assert.match(js, /quality\.asksForHelp && evidenceConfusion/);
  assert.match(js, /label: "缺具体证据"/);
});

test("student stuck guidance copy uses scaffolds instead of full restatement demands", () => {
  assert.match(js, /跟着支架补方法/);
  assert.match(js, /先看讲解，再点按钮或补半句/);
  assert.match(js, /用按钮或半句确认/);
  assert.doesNotMatch(js, /label: "用自己的话复述方法"/);
  assert.doesNotMatch(js, /先用自己的话说出方法。通过变式验证后，系统会解锁下一题。/);
  assert.doesNotMatch(js, /系统会先讲清概念，再让你复述和做变式。/);
});

test("wrong-answer guidance opens with a non-answer starter instead of a blank input", () => {
  const startBlock = js.match(/function startGuidedMastery[\s\S]*?function completeGuidedMastery/)?.[0] || "";
  assert.match(startBlock, /replyDraft: startsWithVariant \? "" : guidanceReplyStarterForLock/);
  assert.match(js, /if \(lock\.replyDraft && !replyInput\.value\.trim\(\)\) replyInput\.value = lock\.replyDraft/);
  assert.doesNotMatch(startBlock, /replyDraft:[\s\S]{0,160}correctAnswer|正确答案/);
});

test("guidance next missing sentence becomes subject specific for thin replies", () => {
  assert.match(js, /function guidanceDetailSentenceForQuestion/);
  assert.match(js, /题目里的具体数字或变化关系/);
  assert.match(js, /文章里的具体证据或观点句/);
  assert.match(js, /变量、数据或实验条件/);
  assert.match(js, /guidanceDetailSentenceForQuestion\(question\)/);
  assert.doesNotMatch(js, /guidanceDetailSentenceForQuestion[\s\S]*正确答案是/);
});

test("student guidance always shows one explicit next action", () => {
  assert.match(html, /id="guidanceNextActionBar"/);
  assert.match(html, /id="guidanceNextActionLabel"/);
  assert.match(html, /id="guidanceNextActionText"/);
  assert.match(html, /下一步动作/);
  assert.match(js, /function guidanceNextActionForReply/);
  assert.match(js, /function renderGuidanceNextAction/);
  assert.match(js, /renderGuidanceNextAction\(reply, quality\)/);
  assert.match(js, /点“帮我填第一小句”/);
  assert.match(js, /提交给教练/);
  assert.match(js, /完成变式验证/);
  assert.match(js, /不用先打完整解释/);
  assert.match(css, /guidance-next-action-bar/);
});

test("student guidance reply quality rejects short keyword-only replies", () => {
  assert.match(js, /const enoughDetail = compactText\.length >= 18 \|\| wordCount >= 8/);
  assert.match(js, /ready: enoughDetail && hasQuestionGoal && hasMethodStep && hasReasonWhy/);
  assert.doesNotMatch(js, /const hasMethodStep = .*because/);
  assert.match(js, /解释要更完整/);
});

test("student guidance reply quality rejects generic reasons without question evidence", () => {
  assert.match(js, /function hasSpecificGuidanceEvidence/);
  assert.match(js, /const hasSpecificEvidence = hasSpecificGuidanceEvidence\(reply\)/);
  assert.match(js, /ready: enoughDetail && hasQuestionGoal && hasMethodStep && hasReasonWhy && hasSpecificEvidence/);
  assert.match(js, /genericReason/);
  assert.match(js, /有用\|可以\|合理\|重要/);
  assert.match(js, /题目里的____说明____/);
});

test("student guidance starter includes a concrete evidence blank", () => {
  const starterBlock = js.match(/function guidanceReplyStarterForLock[\s\S]*?function guidanceDetailSentenceForQuestion/)?.[0] || "";
  assert.match(starterBlock, /题目里的\[具体证据或条件\]说明\[为什么方法合理\]/);
  assert.match(starterBlock, /因为\[说明这一步为什么有用\]/);
  assert.doesNotMatch(starterBlock, /正确答案是/);
});

test("step builder has a separate concrete evidence step", () => {
  assert.match(html, /data-reply-step="evidence"/);
  assert.match(html, /具体证据或条件/);
  assert.match(html, /按顺序点 4 个按钮/);
  assert.match(js, /if \(part === "evidence"\) return guidanceEvidenceBuilderSentence\(question\)/);
  assert.match(js, /\["goal", "method", "reason", "evidence"\]/);
});

test("evidence step builder gives subject-specific evidence clues", () => {
  assert.match(js, /function guidanceEvidenceBuilderSentence/);
  assert.match(js, /具体数字或变化关系/);
  assert.match(js, /观点句或证据句/);
  assert.match(js, /变量、数据或实验条件/);
  assert.match(js, /return guidanceEvidenceBuilderSentence\(question\)/);
  assert.doesNotMatch(js, /guidanceEvidenceBuilderSentence[\s\S]*正确答案是/);
});

test("student guidance gives a concrete rescue prompt when the reply says they are stuck", () => {
  assert.match(html, /id="replyHelperCard"/);
  assert.match(html, /id="replyStarterText"/);
  assert.match(html, /id="applyReplyStarterButton"/);
  assert.match(js, /function guidanceReplyStarterForLock/);
  assert.match(js, /function guidanceMicroDrillForLock/);
  assert.match(js, /function buildGuidanceRescueMove/);
  assert.match(js, /const asksForHelp = .*不知道/);
  assert.match(js, /没关系，先教会，再让你只答一小步/);
  assert.match(js, /不会写时先不要硬猜/);
  assert.match(js, /老师示范句放到输入框/);
  assert.match(js, /微练习/);
  assert.match(js, /commonMistakeForQuestion/);
  assert.match(js, /coachingHintForTurn/);
  assert.match(js, /把方括号里的内容换成自己的话/);
  assert.match(js, /applyReplyStarterButton"\)\.addEventListener\("click"/);
  assert.match(html, /id="applyNextSentenceButton"/);
  assert.match(js, /applyNextSentenceButton"\)\.addEventListener\("click"/);
  assert.match(js, /建议下一句/);
  assert.match(css, /reply-helper-card/);
});

test("student can ask for another example without typing a perfect restatement", () => {
  assert.match(html, /id="applyConceptExampleButton"/);
  assert.match(html, /换个例子讲/);
  assert.match(js, /function requestConceptExampleReteach/);
  assert.match(js, /applyConceptExampleButton"\)\.addEventListener\("click"/);
  assert.match(js, /buildConceptBridgeMove\(currentDraft, state\.guidanceLock\)/);
  assert.match(js, /我还是没懂，换个例子讲/);
  assert.match(js, /state\.guidanceLock\.replyDraft = state\.guidanceLock\.microDrill\?\.starter \|\| guidanceTeacherModelForLock\(state\.guidanceLock\)/);
  assert.doesNotMatch(js, /requestConceptExampleReteach[\s\S]*正确答案是/);
});

test("student guidance has quick replies for common stuck states", () => {
  assert.match(html, /id="coachQuickReplies"/);
  assert.match(html, /不会写也可以继续/);
  assert.match(html, /不用先组织完整答案，先点一个卡住状态/);
  assert.match(html, /data-guidance-quick-reply="我不懂这题问什么。"/);
  assert.match(html, /data-guidance-quick-reply="我懂一点概念，但不知道第一步看什么。"/);
  assert.match(html, /class="secondary-button small-button recommended-reply" type="button" data-guidance-quick-reply="我知识点没吃透，先讲给我听，再让我只填一个空。"/);
  assert.match(html, /data-guidance-quick-reply="我还是没懂，换个例子讲。"/);
  assert.match(html, />先讲知识点</);
  assert.match(js, /function submitGuidanceQuickReply/);
  assert.match(js, /coachQuickReplies"\)\.addEventListener\("click"/);
  assert.match(js, /submitGuidanceQuickReply\(button\.dataset\.guidanceQuickReply, \$\("inlineCoachReply"\)\)/);
  assert.match(js, /rescueIncompleteGuidanceReply\(input\.value, input\)/);
  assert.match(css, /coach-quick-replies/);
  assert.match(css, /quick-replies-title/);
  assert.match(css, /recommended-reply/);
});

test("initial guidance task teaches before asking students to produce the question goal", () => {
  assert.match(js, /title: "先听讲解，再只填一个空"/);
  assert.match(js, /body: "不用先完整说题意/);
  assert.doesNotMatch(js, /title: "先说题目真正问什么"/);
});

test("student guidance offers a two-choice micro task when writing is hard", () => {
  assert.match(html, /id="replyMicroChoiceCard"/);
  assert.match(html, /id="replyMicroChoicePrompt"/);
  assert.match(html, /data-micro-choice="0"/);
  assert.match(html, /data-micro-choice="1"/);
  assert.match(js, /function guidanceMicroChoiceForLock/);
  assert.match(js, /renderGuidanceMicroChoice/);
  assert.match(js, /applyGuidanceMicroChoice/);
  assert.match(js, /const card = \$\("replyMicroChoiceCard"\)/);
  assert.match(js, /const showMicroChoice = !quality\.ready \|\| quality\.asksForHelp \|\| Boolean\(lock\.forceStepBuilder\)/);
  assert.match(js, /card\.classList\.toggle\("hidden", !showMicroChoice\)/);
  assert.match(js, /choice\.sentence/);
  assert.match(css, /micro-choice-card/);
});

test("knowledge gap guidance offers tappable concept bridge choices instead of relying on typing", () => {
  assert.match(html, /id="conceptBridgeCard"/);
  assert.match(html, /AI 先搭脚手架/);
  assert.match(html, /data-concept-bridge="goal"/);
  assert.match(html, /data-concept-bridge="method"/);
  assert.match(html, /data-concept-bridge="teach"/);
  assert.match(js, /function renderConceptBridgeChoices/);
  assert.match(js, /function applyConceptBridgeChoice/);
  assert.match(js, /guidanceCannotProduceThought\(reply\) \|\| quality\.asksForHelp/);
  assert.match(js, /conceptBridgeCard"\)\.classList\.toggle\("hidden", !showBridge\)/);
  assert.match(js, /button\.dataset\.conceptBridge/);
  assert.match(js, /state\.guidanceLock\.conceptBridgeReady = true/);
  assert.match(js, /input\.value = sentence/);
  assert.match(css, /concept-bridge-card/);
  assert.doesNotMatch(js, /applyConceptBridgeChoice[\s\S]*正确答案是/);
});

test("concept bridge can teach first when the student cannot produce words", () => {
  assert.match(html, /先补知识点/);
  assert.match(js, /teach: `我知识点没吃透，请先讲概念，再让我只填一个空。`/);
  assert.match(js, /key === "teach" \? "先补知识点"/);
  assert.match(js, /if \(choiceKey === "teach"\) \{/);
  assert.match(js, /rescueIncompleteGuidanceReply\(sentence, input\)/);
  assert.match(js, /return;/);
  assert.match(js, /不要再让孩子先完整说思路/);
});

test("concept bridge can continue by filling the next missing method sentence", () => {
  const submitHandler = js.match(/\$\("inlineCoachForm"\)\.addEventListener\("submit",[\s\S]*?\$\("inlineCoachReply"\)\.addEventListener/)?.[0] || "";
  assert.match(js, /function continueConceptBridgeSentence/);
  assert.match(js, /state\.guidanceLock\?\.conceptBridgeReady && !quality\.ready/);
  assert.match(submitHandler, /continueConceptBridgeSentence\(input\)/);
  assert.match(js, /state\.guidanceLock\.conceptBridgeReady = false/);
  assert.match(js, /renderReplyQuality\(input\.value\)/);
  assert.match(js, /if \(quality\.conceptBridgeReady\) return "继续补下一句"/);
  assert.doesNotMatch(js, /continueConceptBridgeSentence[\s\S]*正确答案是/);
});

test("student can build a method sentence by tapping smaller guidance steps", () => {
  assert.match(html, /id="replyStepBuilderCard"/);
  assert.match(html, /data-reply-step="goal"/);
  assert.match(html, /data-reply-step="method"/);
  assert.match(html, /data-reply-step="reason"/);
  assert.match(js, /function guidanceStepBuilderSentence/);
  assert.match(js, /function applyGuidanceStepBuilder/);
  assert.match(js, /button\.dataset\.replyStep/);
  assert.match(js, /state\.guidanceLock\.stepBuilderParts/);
  assert.match(js, /renderReplyQuality\(input\.value\)/);
  assert.match(css, /reply-step-builder-card/);
});

test("micro choice selection clearly moves the student into submit-ready guidance", () => {
  assert.match(js, /state\.guidanceLock\.microChoiceReady = true/);
  assert.match(js, /已帮你写好一个小步骤，可以直接提交给教练检查。/);
  assert.match(js, /if \(lock\?\.microChoiceReady\) return "提交示范句检查"/);
  assert.match(js, /state\.guidanceLock\?\.microChoiceReady/);
  assert.match(js, /已帮你写好一个小步骤，可以直接提交给教练检查。/);
  assert.match(js, /\$\("inlineCoachSubmit"\)\.focus\(\)/);
});

test("micro choice confirmation runs before incomplete-reply rescue", () => {
  const submitHandler = js.match(/\$\("inlineCoachForm"\)\.addEventListener\("submit",[\s\S]*?\$\("inlineCoachReply"\)\.addEventListener/)?.[0] || "";
  const microConfirmIndex = submitHandler.indexOf("confirmTeacherModelUnderstanding(reply, input)");
  const rescueIndex = submitHandler.indexOf("rescueIncompleteGuidanceReply(reply, input)", submitHandler.indexOf("if (!quality.ready)"));
  assert.ok(microConfirmIndex >= 0, "micro choice should confirm understanding");
  assert.ok(rescueIndex >= 0, "incomplete replies should still have rescue");
  assert.ok(microConfirmIndex < rescueIndex, "micro choice should not be blocked by incomplete-reply rescue");
  assert.match(submitHandler, /if \(state\.guidanceLock\?\.microChoiceReady && !state\.guidanceLock\?\.teacherModelConfirmed\) \{/);
  assert.doesNotMatch(submitHandler, /confirmTeacherModelUnderstanding[\s\S]*正确答案是/);
});

test("micro choice trap selections become teachable misconception feedback", () => {
  assert.match(js, /trap: true/);
  assert.match(js, /choice\.trap/);
  assert.match(js, /你点到常见误区/);
  assert.match(js, /系统已帮你改成避坑方法句/);
  assert.match(js, /看答案长度/);
  assert.match(js, /只看最大数/);
  assert.match(js, /先背名词/);
  assert.doesNotMatch(js, /choice\.trap[\s\S]*正确答案是/);
});

test("typed A or B in guidance input becomes the same micro choice flow", () => {
  const submitHandler = js.match(/\$\("inlineCoachForm"\)\.addEventListener\("submit",[\s\S]*?\$\("inlineCoachReply"\)\.addEventListener/)?.[0] || "";
  assert.match(js, /function typedGuidanceMicroChoiceIndex/);
  assert.match(js, /\^\[ab\]\$/);
  assert.match(submitHandler, /const typedMicroChoice = typedGuidanceMicroChoiceIndex\(reply, state\.guidanceLock\)/);
  assert.match(submitHandler, /applyGuidanceMicroChoice\(typedMicroChoice, input\)/);
  assert.match(submitHandler, /return;/);
  assert.doesNotMatch(js, /typedGuidanceMicroChoiceIndex[\s\S]*正确答案是/);
});

test("student stuck replies can submit for rescue instead of staying blocked", () => {
  const submitHandler = js.match(/\$\("inlineCoachForm"\)\.addEventListener\("submit",[\s\S]*?\$\("inlineCoachReply"\)\.addEventListener/)?.[0] || "";
  const stuckBranch = submitHandler.match(/if \(quality\.asksForHelp\) \{[\s\S]*?return;\n    \}/)?.[0] || "";
  assert.match(js, /const canAskForHelp = quality\.asksForHelp \|\| Boolean\(String\(reply \|\| ""\)\.trim\(\)\)/);
  assert.match(js, /const canContinueWithoutTyping = Boolean\(state\.guidanceLock\?\.forceStepBuilder/);
  assert.match(js, /\$\("inlineCoachSubmit"\)\.disabled = !quality\.ready && !\(canAskForHelp \|\| canContinueWithoutTyping\)/);
  assert.match(js, /\$\("inlineCoachSubmit"\)\.textContent = guidanceSubmitButtonText\(quality, state\.guidanceLock\)/);
  assert.match(js, /if \(lock\?\.forceStepBuilder && !quality\.ready\) return "不用打字，继续教我"/);
  assert.match(js, /if \(quality\.asksForHelp\) return "帮我开头"/);
  assert.match(js, /if \(quality\.ready\) return "提交给教练"/);
  assert.match(js, /return "让教练帮我补"/);
  assert.match(js, /if \(quality\.asksForHelp\)/);
  assert.match(js, /function rescueIncompleteGuidanceReply/);
  assert.match(js, /function buildConceptBridgeMove/);
  assert.match(submitHandler, /rescueIncompleteGuidanceReply\(reply, input\)/);
  assert.match(js, /state\.guidanceLock\.microDrill = guidanceMicroDrillForLock\(state\.guidanceLock\)/);
  assert.match(js, /state\.guidanceLock\.replyDraft = guidanceCannotProduceThought\(reply\) \? "" : teachFirstLadderDraft\(reply, state\.guidanceLock\)/);
  assert.match(js, /input\.value = state\.guidanceLock\.replyDraft/);
  assert.match(js, /renderReplyQuality\(input\.value\)/);
  assert.doesNotMatch(stuckBranch, /guidanceReplyStarterForLock/);
  assert.doesNotMatch(js, /buildGuidanceRescueMove[\s\S]*正确答案是/);
});

test("knowledge gap replies immediately lower to a teach-first ladder", () => {
  assert.match(js, /function shouldUseTeachFirstLadder/);
  assert.match(js, /function teachFirstLadderDraft/);
  assert.match(js, /guidanceCannotProduceThought\(reply\) \|\| quality\.asksForHelp/);
  assert.match(js, /state\.guidanceLock\.forceStepBuilder = shouldUseTeachFirstLadder\(reply, state\.guidanceLock\)/);
  assert.match(js, /state\.guidanceLock\.stepBuilderParts = \{ goal: guidanceStepBuilderSentence\("goal", state\.guidanceLock\) \}/);
  assert.match(js, /直接点按钮或回 A\/B/);
  assert.match(js, /选完后系统再帮你补第一小句/);
  assert.match(js, /不要先打完整思路/);
  assert.doesNotMatch(js, /teachFirstLadderDraft[\s\S]*正确答案是/);
});

test("incomplete guidance replies trigger teaching instead of blocking", () => {
  const submitHandler = js.match(/\$\("inlineCoachForm"\)\.addEventListener\("submit",[\s\S]*?\$\("inlineCoachReply"\)\.addEventListener/)?.[0] || "";
  assert.match(js, /conceptNotReady/);
  assert.match(js, /帮我拆题/);
  assert.match(submitHandler, /if \(!quality\.ready\) \{[\s\S]*?rescueIncompleteGuidanceReply\(reply, input\);[\s\S]*?return;/);
  assert.doesNotMatch(submitHandler, /先把复述补完整，再提交给 AI 教练/);
  assert.match(js, /知识点没吃透时确实很难自己说题意/);
  assert.match(js, /小讲解：\$\{skill\}/);
});

test("student knowledge-gap replies trigger teaching before asking for a full explanation", () => {
  assert.match(js, /知识点没吃透/);
  assert.match(js, /打不出来/);
  assert.match(js, /说不出来/);
  assert.match(js, /先教会，再让你只答一小步/);
  assert.match(js, /不用自己组织完整答案/);
  assert.match(js, /老师先示范怎么拆题/);
  assert.match(js, /二选一或填空/);
});

test("student can say they cannot produce words and continue without typing a long explanation", () => {
  assert.match(html, /data-guidance-quick-reply="我知识点没吃透，打不出来。不要再让我先说题目问什么，请先讲知识点并给我二选一。"/);
  assert.match(html, />说不出来</);
  assert.match(js, /不用打字也能继续/);
  assert.match(js, /可直接点按钮，不用打字/);
  assert.match(js, /先看题干关键词，还是先看答案长短/);
  assert.match(js, /点“先补知识点”/);
  assert.match(js, /点“帮我拼完整方法句”/);
  assert.doesNotMatch(js, /可直接点按钮，不用打字[\s\S]*正确答案是/);
});

test("cannot-produce guidance highlights one recommended support button", () => {
  assert.match(js, /recommendedSupportAction/);
  assert.match(js, /guidanceCannotProduceThought\(reply\) \? "build-method" : "fill-goal"/);
  assert.match(js, /data-recommended/);
  assert.match(js, /button\.classList\.toggle\("recommended", recommended\)/);
  assert.match(js, /推荐下一步：帮我拼完整方法句/);
  assert.match(css, /concept-support-actions \.recommended/);
  assert.doesNotMatch(js, /recommendedSupportAction[\s\S]*正确答案是/);
});

test("student stuck on concepts gets a no-typing support card", () => {
  assert.match(html, /id="conceptSupportCard"/);
  assert.match(html, /id="conceptSupportTeach"/);
  assert.match(html, /id="conceptSupportExample"/);
  assert.match(html, /data-concept-support="fill-goal"/);
  assert.match(html, /data-concept-support="build-method"/);
  assert.match(html, /data-concept-support="reteach"/);
  assert.match(js, /function conceptSupportForLock/);
  assert.match(js, /function renderConceptSupportCard/);
  assert.match(js, /function applyConceptSupportChoice/);
  assert.match(js, /不用先打完整解释/);
  assert.match(js, /先听一句讲解，再点按钮补第一小句/);
  assert.match(js, /renderConceptSupportCard\(reply, quality, state\.guidanceLock\)/);
  assert.match(js, /conceptSupportCard"\)\.classList\.toggle\("hidden", !showSupport\)/);
  assert.doesNotMatch(js, /conceptSupportForLock[\s\S]*正确答案是/);
});

test("pre-answer gate gives teaching help instead of asking stuck students to invent a full thought", () => {
  const gateBlock = js.match(/function renderPreAnswerGate[\s\S]*?function shouldEnterChallengeBoost/)?.[0] || "";
  const answerHandler = js.match(/\$\("answerGrid"\)\.addEventListener\("click",[\s\S]*?\n  \}\);/)?.[0] || "";
  assert.match(html, /知识点没吃透，先教我/);
  assert.match(gateBlock, /不会写时先点“知识点没吃透，先教我”或“给我句式”/);
  assert.match(gateBlock, /系统会先讲概念，再让你只补一个空/);
  assert.match(answerHandler, /如果知识点没吃透，点“先教我”或“给我句式”/);
  assert.doesNotMatch(answerHandler, /先写一句自己的解题思路，再选择答案/);
});

test("concept support lets students choose why the knowledge point is stuck", () => {
  const gapBlock = js.match(/function conceptGapChoiceForLock[\s\S]*?function renderConceptSupportCard/)?.[0] || "";
  const applyBlock = js.match(/function applyConceptGapChoice[\s\S]*?function continueConceptBridgeSentence/)?.[0] || "";
  assert.match(html, /id="conceptGapActions"/);
  assert.match(html, /data-concept-gap="new"/);
  assert.match(html, /data-concept-gap="forgot"/);
  assert.match(html, /data-concept-gap="apply"/);
  assert.match(html, /data-concept-gap="clue"/);
  assert.match(css, /concept-gap-actions/);
  assert.match(js, /function conceptGapChoiceForLock/);
  assert.match(js, /function applyConceptGapChoice/);
  assert.match(js, /applyConceptGapChoice\(button\.dataset\.conceptGap, \$\("inlineCoachReply"\)\)/);
  assert.match(gapBlock, /像没学过/);
  assert.match(gapBlock, /忘了这个知识点的定义/);
  assert.match(gapBlock, /懂一点概念，但不会用到这题/);
  assert.match(gapBlock, /看不出题目里的线索/);
  assert.match(applyBlock, /卡点判断：概念没接上/);
  assert.match(applyBlock, /state\.guidanceLock\.forceStepBuilder = true/);
  assert.match(applyBlock, /state\.guidanceLock\.stepBuilderParts/);
  assert.doesNotMatch(gapBlock + applyBlock, /正确答案是|答案是|选项\s*[A-D]/);
});

test("wrong-answer guidance shows no-typing support before the student has to explain", () => {
  const startBlock = js.match(/function startGuidedMastery[\s\S]*?\n}/)?.[0] || "";
  assert.match(startBlock, /forceStepBuilder: !startsWithVariant/);
  assert.match(startBlock, /recommendedSupportAction: "fill-goal"/);
  assert.match(startBlock, /microDrill: startsWithVariant \? null : guidanceMicroDrillForLock/);
  assert.match(js, /不用先打完整解释/);
  assert.match(js, /帮我填第一小句/);
  assert.doesNotMatch(startBlock, /correct|正确答案是/);
});

test("concept support can build a full method sentence without revealing answers", () => {
  assert.match(html, /帮我拼完整方法句/);
  assert.match(js, /choiceKey === "build-method"/);
  assert.match(js, /guidanceTeacherModelForLock\(state\.guidanceLock\)/);
  assert.match(js, /state\.guidanceLock\.microChoiceReady = true/);
  assert.match(js, /可以直接提交给教练检查/);
  assert.doesNotMatch(js, /choiceKey === "build-method"[\s\S]*正确答案是/);
});

test("student who cannot describe the question gets concept support before writing", () => {
  const cannotProduceBlock = js.match(/function guidanceCannotProduceThought[\s\S]*?\n}/)?.[0] || "";
  assert.match(js, /function guidanceCannotProduceThought/);
  assert.match(js, /别人知识点没吃透/);
  assert.match(js, /人家也打不出来/);
  assert.match(js, /不要再让孩子先完整说思路/);
  assert.match(js, /先帮你拆题和补概念/);
  assert.match(js, /只填一个空/);
  assert.match(js, /buildConceptBridgeMove[\s\S]*guidanceCannotProduceThought\(reply\)/);
  assert.doesNotMatch(cannotProduceBlock, /正确答案是/);
});

test("student complaint copy promises teacher-first support and no long typing", () => {
  assert.match(js, /老师先说给你听/);
  assert.match(js, /你只需要选一个按钮或补一个空/);
  assert.match(js, /不会表达不是问题/);
  assert.match(js, /不用先证明自己会说/);
  assert.doesNotMatch(js, /老师先说给你听[\s\S]*正确答案是/);
});

test("student complaint about meta questions switches to teach-choice-fill mode", () => {
  assert.match(js, /function guidanceMetaQuestionComplaint/);
  assert.match(js, /这问题问的什么/);
  assert.match(js, /别人知识点没吃透/);
  assert.match(js, /别再追问“这题问什么”/);
  assert.match(js, /先讲一个小知识点/);
  assert.match(js, /二选一判断/);
  assert.match(js, /最后只填一个空/);
  assert.match(js, /guidanceMetaQuestionComplaint\(reply\)/);
  assert.match(js, /guidanceMetaQuestionComplaint\(recentStudent\)/);
  assert.doesNotMatch(js, /guidanceMetaQuestionComplaint[\s\S]*正确答案是/);
});

test("child quote about not being able to type routes to teacher-first bridge", () => {
  assert.match(js, /function teacherFirstBridgeForMetaComplaint/);
  assert.match(js, /引导你让你自己去说/);
  assert.match(js, /这问题问的什么/);
  assert.match(js, /别人知识点没吃透人家也打不出来/);
  assert.match(js, /先不问“这题问什么”/);
  assert.match(js, /老师先搭桥/);
  assert.match(js, /不是不努力，是概念台阶不够/);
  assert.match(js, /不用自己组织题意/);
  assert.match(js, /只点一个选择或填一个空/);
  assert.match(js, /直接回 A 或 B/);
  assert.match(js, /teacherFirstBridgeForMetaComplaint\(recentStudent, question\)/);
  assert.match(js, /teacherFirstBridgeForMetaComplaint\(reply, question\)/);
  assert.match(js, /teacherFirstBridgeForMetaComplaint\(rawReply, question\)/);
  assert.doesNotMatch(js, /teacherFirstBridgeForMetaComplaint[\s\S]*正确答案是/);
});

test("cannot-produce replies show a two-choice bridge instead of auto-submitting a full model", () => {
  assert.match(js, /guidanceCannotProduceThought\(reply\)/);
  assert.match(js, /state\.guidanceLock\.replyDraft = ""/);
  assert.match(js, /state\.guidanceLock\.microChoiceReady = false/);
  assert.match(js, /直接点二选一按钮/);
  assert.match(js, /只打 A \/ B/);
  assert.match(js, /选完后系统再帮你补第一小句/);
  assert.match(js, /renderGuidanceMicroChoice/);
  assert.doesNotMatch(js, /guidanceCannotProduceThought\(reply\)[\s\S]*正确答案是/);
});

test("empty stuck guidance can continue through the primary coach button", () => {
  const renderBlock = js.match(/function renderReplyQuality[\s\S]*?function teachingMiniExampleForSkill/)?.[0] || "";
  const submitBlock = js.match(/\$\("inlineCoachForm"\)\.addEventListener\("submit"[\s\S]*?askAiCoach/)?.[0] || "";
  assert.match(renderBlock, /canContinueWithoutTyping/);
  assert.match(renderBlock, /state\.guidanceLock\?\.forceStepBuilder/);
  assert.match(renderBlock, /!\(canAskForHelp \|\| canContinueWithoutTyping\)/);
  assert.match(submitBlock, /if \(!reply && state\.guidanceLock\?\.forceStepBuilder\)/);
  assert.match(submitBlock, /applyCoachFollowupAction\("next", input\)/);
  assert.match(js, /不用打字，继续教我/);
  assert.doesNotMatch(submitBlock, /正确答案是|答案是/);
});

test("student guidance unpacks the question goal before asking the child to explain it", () => {
  assert.match(html, /id="questionUnpackText"/);
  assert.match(html, /id="applyQuestionGoalButton"/);
  assert.match(html, /AI 先帮你拆题/);
  assert.match(js, /function guidanceQuestionUnpackForLock/);
  assert.match(js, /不是让你先猜答案/);
  assert.match(js, /题目其实在问/);
  assert.match(js, /applyQuestionGoalButton"\)\.addEventListener\("click"/);
  assert.match(js, /guidanceStepBuilderSentence\("goal"/);
  assert.match(js, /state\.guidanceLock\.stepBuilderParts/);
  assert.doesNotMatch(js, /guidanceQuestionUnpackForLock[\s\S]*正确答案是/);
});

test("stuck students see a teacher question unpack card before typing", () => {
  const unpackBlock = js.match(/function questionUnpackForLock[\s\S]*?function renderQuestionUnpackCard/)?.[0] || "";
  assert.match(html, /id="questionUnpackCard"/);
  assert.match(html, /id="questionUnpackGoal"/);
  assert.match(html, /id="questionUnpackClue"/);
  assert.match(html, /id="questionUnpackWhy"/);
  assert.match(js, /function questionUnpackForLock/);
  assert.match(js, /renderQuestionUnpackCard/);
  assert.match(unpackBlock, /题目其实在考/);
  assert.match(unpackBlock, /先看这条线索/);
  assert.match(unpackBlock, /为什么这样看/);
  assert.match(css, /question-unpack-card/);
  assert.doesNotMatch(unpackBlock, /正确答案是|答案是/);
});

test("repeated stuck guidance lowers the task instead of asking for a full sentence again", () => {
  assert.match(js, /function guidanceNeedsLowerStep/);
  assert.match(js, /teachingTurns >= 2/);
  assert.match(js, /不用再打完整句/);
  assert.match(js, /先点下面的小台阶按钮/);
  assert.match(js, /state\.guidanceLock\.forceStepBuilder = true/);
  assert.match(js, /state\.guidanceLock\.stepBuilderParts = \{ goal:/);
  assert.match(js, /guidanceStepBuilderSentence\("goal"/);
  assert.match(js, /只完成一个空/);
  assert.doesNotMatch(js, /guidanceNeedsLowerStep[\s\S]*正确答案是/);
});

test("second stuck reply switches to no-typing micro support", () => {
  assert.match(js, /function repeatedStuckCoachNotice/);
  assert.match(js, /第二次卡住/);
  assert.match(js, /不用继续打字/);
  assert.match(js, /点“帮我拼完整方法句”/);
  assert.match(js, /state\.guidanceLock\.microChoiceNote = repeatedStuckCoachNotice\(\)/);
  assert.match(js, /renderGuidanceNextAction\(reply, quality\)/);
  assert.doesNotMatch(js, /repeatedStuckCoachNotice[\s\S]*正确答案是/);
});

test("help replies are replaced with a smaller actionable draft, not left as stuck text", () => {
  const rescueBlock = js.match(/function rescueIncompleteGuidanceReply[\s\S]*?function requestConceptExampleReteach/)?.[0] || "";
  assert.match(rescueBlock, /state\.guidanceLock\.replyDraft = guidanceStepBuilderSentence\("goal", state\.guidanceLock\)/);
  assert.match(rescueBlock, /input\.value = state\.guidanceLock\.replyDraft/);
  assert.doesNotMatch(rescueBlock, /if \(!state\.guidanceLock\.replyDraft\) state\.guidanceLock\.replyDraft = teachFirstLadderDraft/);
});

test("repeated stuck guidance switches explanation style instead of repeating fill-in", () => {
  assert.match(js, /function repeatedStuckAlternativeExplanation/);
  assert.match(js, /换一种讲法/);
  assert.match(js, /类比/);
  assert.match(js, /错因对比/);
  assert.match(js, /只选一个动作/);
  assert.match(js, /repeatedStuckAlternativeExplanation\(lock, question, skill\)/);
  assert.doesNotMatch(js, /repeatedStuckAlternativeExplanation[\s\S]*正确答案是/);
});

test("third stuck guidance switches to a worked mini example without using the original answer", () => {
  assert.match(js, /function thirdStuckMiniExampleRescue/);
  assert.match(js, /第三次卡住/);
  assert.match(js, /不再让你解释原题/);
  assert.match(js, /非原题小例子/);
  assert.match(js, /只填一个空/);
  assert.match(js, /guidanceNeedsWorkedMiniExample\(lock\)/);
  assert.match(js, /thirdStuckMiniExampleRescue\(lock, question, skill\)/);
  assert.doesNotMatch(js, /thirdStuckMiniExampleRescue[\s\S]*正确答案是/);
});

test("student guidance keeps the suggested rescue draft after re-render", () => {
  assert.match(js, /if \(lock\.replyDraft && !replyInput\.value\.trim\(\)\) replyInput\.value = lock\.replyDraft/);
  assert.match(js, /state\.guidanceLock\.replyDraft = ""/);
  assert.match(js, /state\.guidanceLock\.replyDraft = \$\("inlineCoachReply"\)\.value/);
  assert.match(js, /state\.guidanceLock\.replyDraft = input\.value/);
});

test("student guidance reply placeholder adapts to the skill", () => {
  assert.match(js, /function guidanceReplyPlaceholderForLock/);
  assert.match(js, /replyInput\.placeholder = guidanceReplyPlaceholderForLock\(lock\)/);
  assert.match(js, /x 和 y 怎么变/);
  assert.match(js, /中心句和证据/);
  assert.match(js, /离 x 最远的运算/);
  assert.match(js, /改变什么和测量什么/);
  assert.doesNotMatch(js, /guidanceReplyPlaceholderForLock[\s\S]*正确答案是/);
});

test("student can request a teacher model sentence without seeing the answer", () => {
  assert.match(html, /id="applyTeacherModelButton"/);
  assert.match(html, /看老师示范句/);
  assert.match(js, /function guidanceTeacherModelForLock/);
  assert.match(js, /题目要我判断/);
  assert.match(js, /第一步我先/);
  assert.match(js, /applyTeacherModelButton"\)\.addEventListener\("click"/);
  assert.match(js, /input\.value = guidanceTeacherModelForLock\(state\.guidanceLock\)/);
  assert.match(js, /renderReplyQuality\(input\.value\)/);
  assert.doesNotMatch(js, /guidanceTeacherModelForLock[\s\S]*正确答案是/);
  assert.match(css, /reply-helper-actions/);
});

test("student guidance starter placeholders do not pass the quality gate", () => {
  assert.match(js, /const hasPlaceholder = .*\\\[.*\\\]/);
  assert.match(js, /ready: enoughDetail && hasQuestionGoal && hasMethodStep && hasReasonWhy && hasSpecificEvidence && !asksForHelp && !hasPlaceholder/);
});

test("student cannot pass mastery until restatement is complete", () => {
  assert.match(html, /id="inlineCoachSubmit"/);
  assert.match(js, /\$\("inlineCoachSubmit"\)\.disabled = !quality\.ready && !\(canAskForHelp \|\| canContinueWithoutTyping\)/);
  assert.match(js, /const quality = evaluateGuidanceReplyQuality\(reply\)/);
  assert.match(js, /if \(!quality\.ready\)/);
  assert.match(js, /rescueIncompleteGuidanceReply\(reply, input\)/);
  assert.match(js, /shouldMoveToVariantAfterReply\(reply\)/);
  assert.match(js, /evaluateGuidanceReplyQuality\(reply\)\.ready/);
});

test("student guidance coach gives teaching feedback before variant verification", () => {
  assert.match(js, /function buildGuidedTeachingMove/);
  assert.match(js, /概念提醒/);
  assert.match(js, /小例子/);
  assert.match(js, /常见误区/);
  assert.match(js, /下一问/);
  assert.match(js, /buildGuidedTeachingMove\(reply/);
  assert.match(js, /state\.guidanceLock\.teachingTurns/);
  assert.doesNotMatch(js, /正确答案是/);
});

test("student guidance teaching move names completed parts and one missing part", () => {
  const teachingBlock = js.match(/function buildGuidedTeachingMove[\s\S]*?function buildGuidanceRescueMove/)?.[0] || "";
  assert.match(teachingBlock, /已经完成：/);
  assert.match(teachingBlock, /还差：/);
  assert.match(teachingBlock, /题目目标/);
  assert.match(teachingBlock, /第一步/);
  assert.match(teachingBlock, /原因/);
  assert.match(teachingBlock, /具体证据/);
  assert.match(teachingBlock, /不要重写全部/);
  assert.doesNotMatch(teachingBlock, /正确答案是|答案是/);
});

test("complete guidance restatement opens variant verification without a second coach turn", () => {
  assert.match(js, /function shouldMoveToVariantAfterReply/);
  assert.match(js, /evaluateGuidanceReplyQuality\(reply\)\.ready/);
  assert.match(js, /if \(state\.guidanceLock\?\.microChoiceReady && !state\.guidanceLock\?\.teacherModelConfirmed\) return false/);
  assert.doesNotMatch(
    js,
    /isReasonStrong\(reply\) && \(state\.guidanceLock\.teachingTurns \|\| 0\) >= 1/
  );
  assert.match(js, /现在做一道变式验证/);
});

test("teacher model submission checks understanding before variant verification", () => {
  const submitHandler = js.match(/\$\("inlineCoachForm"\)\.addEventListener\("submit",[\s\S]*?\$\("inlineCoachReply"\)\.addEventListener/)?.[0] || "";
  assert.match(js, /teacherModelConfirmed/);
  assert.match(js, /function confirmTeacherModelUnderstanding/);
  assert.match(js, /你已经选出第一步了/);
  assert.match(js, /不用重写整句/);
  assert.match(js, /直接点“继续补下一句”/);
  assert.match(js, /state\.guidanceLock\.conceptBridgeReady = true/);
  assert.match(js, /state\.guidanceLock\.replyDraft = reply/);
  assert.match(submitHandler, /if \(state\.guidanceLock\?\.microChoiceReady && !state\.guidanceLock\?\.teacherModelConfirmed\) \{/);
  assert.match(submitHandler, /confirmTeacherModelUnderstanding\(reply, input\)/);
  assert.doesNotMatch(submitHandler, /microChoiceReady[\s\S]{0,240}transitionGuidanceToVariantImmediately/);
  assert.doesNotMatch(js, /请把这句里的“第一步”换成自己的话/);
});

test("complete guidance restatement switches to variant immediately before remote AI returns", () => {
  const submitHandler = js.match(/\$\("inlineCoachForm"\)\.addEventListener\("submit",[\s\S]*?\$\("inlineCoachReply"\)\.addEventListener/)?.[0] || "";
  assert.match(js, /function transitionGuidanceToVariantImmediately/);
  assert.match(js, /本地已确认你的方法句够完整/);
  assert.match(js, /state\.guidanceLock\.status = "variant"/);
  assert.match(submitHandler, /const canMoveToVariant = shouldMoveToVariantAfterReply\(reply\)/);
  assert.match(submitHandler, /if \(canMoveToVariant\) transitionGuidanceToVariantImmediately\(reply, immediateReply\)/);
  assert.match(submitHandler, /transitionGuidanceToVariantImmediately\(reply, immediateReply\)[\s\S]*askAiCoach\(reply/);
  assert.doesNotMatch(submitHandler, /askAiCoach\(reply[\s\S]*?const canMoveToVariant = shouldMoveToVariantAfterReply\(reply\)/);
});

test("remote AI response does not pull the student back after variant starts", () => {
  const submitHandler = js.match(/\$\("inlineCoachForm"\)\.addEventListener\("submit",[\s\S]*?\$\("inlineCoachReply"\)\.addEventListener/)?.[0] || "";
  const variantThenBlock = submitHandler.match(/if \(canMoveToVariant\) \{[\s\S]*?\} else \{/)?.[0] || "";
  assert.match(submitHandler, /if \(canMoveToVariant\) \{/);
  assert.match(submitHandler, /AI 已记录你的方法句/);
  assert.match(submitHandler, /继续完成当前变式验证/);
  assert.doesNotMatch(variantThenBlock, /buildGuidedTeachingMove\(reply/);
});

test("local variant checks accept Chinese explanations for math skills", () => {
  assert.match(js, /function variantKeywordBank/);
  assert.match(js, /斜率/);
  assert.match(js, /变化率/);
  assert.match(js, /除以/);
  assert.match(js, /variantRetryPrompt/);
});

test("supabase auth sign in controls exist", () => {
  assert.match(html, /id="loginView"/);
  assert.match(html, /id="appShell"/);
  assert.match(html, /id="authForm"/);
  assert.match(html, /id="authEmail"/);
  assert.match(html, /id="authPassword"/);
  assert.match(html, /id="showSignupButton"/);
  assert.match(html, /id="signupForm"/);
  assert.match(html, /id="signupEmail"/);
  assert.match(html, /id="signupPassword"/);
  assert.match(html, /id="signupRole"/);
  assert.match(html, /id="signupStudent"/);
  assert.match(html, /id="showLoginButton"/);
  assert.doesNotMatch(html, /id="authRole"/);
  assert.doesNotMatch(html, /id="authStudentName"/);
  assert.match(html, /id="signInButton"/);
  assert.match(html, /id="signUpButton"/);
  assert.match(html, /id="signOutButton"/);
  assert.match(html, /@supabase\/supabase-js@2/);
});

test("login home shows only credential fields and registration entry by default", () => {
  const loginForm = html.match(/<form id="authForm"[\s\S]*?<\/form>/)?.[0] || "";
  const signupFormOpening = html.match(/<form id="signupForm"[^>]*>/)?.[0] || "";
  assert.match(loginForm, /用户名 \/ 邮箱/);
  assert.match(loginForm, /authPassword/);
  assert.match(loginForm, /signInButton/);
  assert.match(loginForm, /showSignupButton/);
  assert.doesNotMatch(loginForm, /signupRole/);
  assert.doesNotMatch(loginForm, /signupStudent/);
  assert.match(signupFormOpening, /auth-mode-hidden/);
});

test("login form does not ask for account type", () => {
  const loginForm = html.match(/<form id="authForm"[\s\S]*?<\/form>/)?.[0] || "";
  const signupForm = html.match(/<form id="signupForm"[\s\S]*?<\/form>/)?.[0] || "";
  assert.doesNotMatch(loginForm, /signupRole/);
  assert.doesNotMatch(loginForm, /signupStudent/);
  assert.match(signupForm, /signupRole/);
  assert.match(signupForm, /signupStudent/);
});

test("registration content is opened from the register entry and can return to login", () => {
  assert.match(js, /function showSignupMode/);
  assert.match(js, /function showLoginMode/);
  assert.match(js, /auth-mode-hidden/);
  assert.match(js, /showSignupButton"\)\.addEventListener\("click", showSignupMode\)/);
  assert.match(js, /showLoginButton"\)\.addEventListener\("click", showLoginMode\)/);
});

test("signed-out message is not shown on the initial auth check", () => {
  assert.match(js, /onAuthStateChange\(async \(_event, session\)/);
  assert.match(js, /if \(_event === "SIGNED_OUT"\) setAuthStatus\("已退出登录。"\)/);
});

test("sign out clears login and signup form fields", () => {
  assert.match(js, /function clearAuthForms/);
  assert.match(js, /authEmail/);
  assert.match(js, /signupEmail/);
  assert.match(js, /clearAuthForms\(\)/);
});

test("login is separated from the learning app", () => {
  assert.match(js, /renderAuthGate/);
  assert.match(js, /loginView/);
  assert.match(js, /appShell/);
  assert.match(js, /selectedSignupProfile/);
  assert.doesNotMatch(js, /authRole/);
  assert.doesNotMatch(js, /authStudentName/);
});

test("auth state maps signed in users to parent or student views", () => {
  assert.match(js, /createClient/);
  assert.match(js, /authRequest/);
  assert.match(js, /authStorageKey/);
  assert.match(js, /initAuth/);
  assert.match(js, /loadAuthProfile/);
  assert.match(js, /applyProfileToLocalState/);
  assert.match(js, /signInWithPassword/);
  assert.match(js, /signUp/);
  assert.match(js, /signOut/);
  assert.match(js, /token\?grant_type=password/);
  assert.match(js, /authRequest\("signup"/);
});

test("parent and student roles see different app areas", () => {
  assert.match(js, /roleAllowedViews/);
  assert.match(js, /applyRoleVisibility/);
  assert.match(js, /signupRole/);
  assert.match(js, /signupStudent/);
  assert.match(js, /parentOnly/);
  assert.match(js, /studentOnly/);
  assert.match(js, /switchView\("parent"\)/);
  assert.match(js, /switchView\("today"\)/);
});

test("diagnostic teaches first and only triggers guided mastery when needed", () => {
  assert.match(html, /今日学习课/);
  assert.match(html, /id="lessonStatusPanel"/);
  assert.match(html, /id="miniLessonCard"/);
  assert.match(html, /id="lessonConcept"/);
  assert.match(html, /id="workedExample"/);
  assert.match(html, /id="methodHint"/);
  assert.match(html, /id="lessonSteps"/);
  assert.match(html, /id="commonTrap"/);
  assert.match(html, /id="quickCheck"/);
  assert.match(html, /id="confidenceSelect"/);
  assert.match(html, /id="preAnswerCard"/);
  assert.match(html, /id="preAnswerThought"/);
  assert.match(html, /id="inlineCoachPanel"/);
  assert.match(html, /id="inlineCoachForm"/);
  assert.match(html, /id="masteryStepList"/);
  assert.match(html, /id="variantForm"/);
  assert.match(html, /id="variantReply"/);
  assert.match(html, /id="variantFeedback"/);
  assert.match(js, /answerConfidence/);
  assert.match(js, /preAnswerThoughts/);
  assert.match(js, /function requiresPreAnswerThought/);
  assert.match(js, /function isPreAnswerThoughtReady/);
  assert.match(js, /function renderPreAnswerGate/);
  assert.match(js, /不会写时不用硬憋/);
  assert.match(js, /先点“先教我”或“给我句式”/);
  assert.match(js, /locked-choice/);
  assert.match(js, /guidanceLock/);
  assert.match(js, /conceptMiniLesson/);
  assert.match(js, /lessonBlueprints/);
  assert.match(js, /lessonBlueprintForSkill/);
  assert.match(js, /lessonMasteryStatus/);
  assert.match(js, /mastery-status/);
  assert.match(js, /今日学习课/);
  assert.match(js, /变式验证/);
  assert.match(js, /shouldStartGuidance/);
  assert.match(js, /startGuidedMastery/);
  assert.match(js, /completeGuidedMastery/);
  assert.match(js, /buildVariantQuestion/);
  assert.match(js, /isVariantExplanationStrong/);
  assert.match(js, /askMasteryEvaluation/);
  assert.match(js, /nextQuestion"\)\.disabled = .*hasActiveGuidanceLock/s);
  assert.doesNotMatch(html, />诊断测试</);
  assert.doesNotMatch(html, /先写一句理由/);
});

test("deep questions require a thought before answer choices unlock", () => {
  assert.match(html, /先写思路，再看选项/);
  assert.match(js, /requiresPreAnswerThought\(question\) && selectedAnswer === undefined/);
  assert.match(js, /isPreAnswerThoughtReady\(preAnswerThought, question\)/);
  assert.match(js, /aria-disabled=\\"true\\"/);
  assert.match(js, /preAnswerThought"\)\.addEventListener\("input"/);
  assert.match(js, /state\.preAnswerThoughts\[questionProgressKey\(\)\] = event\.target\.value/);
  assert.match(js, /renderPreAnswerGate\(\)/);
  const inputHandler = js.match(/\$\("preAnswerThought"\)\.addEventListener\("input", \(event\) => \{[\s\S]*?\n  \}\);/)?.[0] || "";
  assert.doesNotMatch(inputHandler, /renderDiagnostic\(\)/);
  assert.match(js, /如果知识点没吃透，点“先教我”或“给我句式”/);
  assert.match(css, /pre-answer-card/);
  assert.match(css, /locked-choice/);
});

test("challenge pre-answer requires goal method reason and evidence before choices unlock", () => {
  assert.match(js, /function preAnswerThoughtQuality/);
  assert.match(js, /const hasGoal =/);
  assert.match(js, /const hasMethod =/);
  assert.match(js, /const hasReason =/);
  assert.match(js, /const hasEvidence =/);
  assert.match(js, /function isChallengePreAnswerQuestion/);
  assert.match(js, /if \(isChallengePreAnswerQuestion\(question\)\) return quality\.hasGoal && quality\.hasMethod && quality\.hasReason && quality\.hasEvidence/);
  assert.match(js, /if \(isSchoolExamPracticeQuestion\(question\)\) return quality\.hasGoal && quality\.hasMethod && quality\.hasReason && quality\.hasEvidence/);
  assert.match(js, /isPreAnswerThoughtReady\(preAnswerThought, question\)/);
  assert.match(js, /系统会先讲概念，再让你只补一个空/);
});

test("challenge pre-answer gives a live writing checklist before answer choices unlock", () => {
  assert.match(html, /id="preAnswerChecklist"/);
  assert.match(html, /id="preAnswerGoalCheck"/);
  assert.match(html, /id="preAnswerMethodCheck"/);
  assert.match(html, /id="preAnswerReasonCheck"/);
  assert.match(html, /id="preAnswerEvidenceCheck"/);
  assert.match(js, /function renderPreAnswerChecklist/);
  assert.match(js, /preAnswerThoughtQuality\(thought\)/);
  assert.match(js, /preAnswerGoalCheck/);
  assert.match(js, /preAnswerMethodCheck/);
  assert.match(js, /preAnswerReasonCheck/);
  assert.match(js, /preAnswerEvidenceCheck/);
  assert.match(js, /renderPreAnswerChecklist\(thought, question\)/);
  assert.match(css, /pre-answer-checklist/);
});

test("challenge pre-answer offers non-answer starters so students are not stuck on a blank box", () => {
  const starterBlock = js.match(/function preAnswerStarterText[\s\S]*?function applyPreAnswerStarter/)?.[0] || "";
  const qualityBlock = js.match(/function preAnswerThoughtQuality[\s\S]*?function isChallengePreAnswerQuestion/)?.[0] || "";
  assert.match(html, /id="preAnswerStarterBar"/);
  assert.match(html, /data-pre-answer-starter="frame"/);
  assert.match(html, /data-pre-answer-starter="keyword"/);
  assert.match(html, /data-pre-answer-starter="concept"/);
  assert.match(html, />知识点没吃透，先教我</);
  assert.match(html, /不会说题意时，不用硬写完整解释/);
  assert.match(js, /function preAnswerStarterText/);
  assert.match(js, /function applyPreAnswerStarter/);
  assert.match(js, /data-pre-answer-starter/);
  assert.match(js, /系统会先讲概念，再让你只补一个空/);
  assert.match(starterBlock, /kind === "concept"/);
  assert.match(starterBlock, /conceptMiniLesson/);
  assert.match(starterBlock, /localStudentFriendlyConceptLine/);
  assert.match(starterBlock, /老师先给方法/);
  assert.match(starterBlock, /现在只补一个空/);
  assert.match(css, /pre-answer-bridge-note/);
  assert.match(starterBlock, /____/);
  assert.match(qualityBlock, /____/);
  assert.doesNotMatch(starterBlock, /正确答案|答案是/);
});

test("challenge pre-answer names the exact missing blank after a starter is inserted", () => {
  const nextBlock = js.match(/function preAnswerNextMissingStep[\s\S]*?function renderPreAnswerChecklist/)?.[0] || "";
  assert.match(html, /id="preAnswerNextStep"/);
  assert.match(js, /function preAnswerNextMissingStep/);
  assert.match(js, /preAnswerNextStep/);
  assert.match(nextBlock, /先把第一个空补成题目要判断什么/);
  assert.match(nextBlock, /再把第二个空补成第一步看什么/);
  assert.match(nextBlock, /最后补“因为”后面的原因/);
  assert.match(nextBlock, /再补题目里的具体证据或条件/);
  assert.doesNotMatch(nextBlock, /正确答案|答案是/);
});

test("challenge pre-answer suggests the exact next sentence to write", () => {
  const suggestionBlock = js.match(/function preAnswerSuggestedSentence[\s\S]*?function renderPreAnswerChecklist/)?.[0] || "";
  assert.match(html, /id="preAnswerSuggestedSentence"/);
  assert.match(js, /function preAnswerSuggestedSentence/);
  assert.match(js, /preAnswerSuggestedSentence\(thought, question\)/);
  assert.match(css, /pre-answer-suggested-sentence/);
  assert.match(suggestionBlock, /这题要我判断 \$\{skill\} 里的____/);
  assert.match(suggestionBlock, /我第一步先看 \$\{hint\}/);
  assert.match(suggestionBlock, /因为这一步能帮我把题目要求和方法连起来/);
  assert.match(suggestionBlock, /题目里的____说明我的方法是合理的/);
  assert.match(suggestionBlock, /方法证明已够完整，可以先选择答案/);
  assert.doesNotMatch(suggestionBlock, /正确答案是|答案是|选项\s*[A-D]/);
});

test("challenge pre-answer keyword starter cannot unlock choices without student-specific content", () => {
  const starterBlock = js.match(/function preAnswerStarterText[\s\S]*?function applyPreAnswerStarter/)?.[0] || "";
  const qualityBlock = js.match(/function preAnswerThoughtQuality[\s\S]*?function isChallengePreAnswerQuestion/)?.[0] || "";
  assert.match(starterBlock, /题目里的具体词/);
  assert.match(starterBlock, /____/);
  assert.match(qualityBlock, /题目要求/);
  assert.match(qualityBlock, /题目里的关键词或条件/);
  assert.match(qualityBlock, /通用提示还不算完成/);
  assert.doesNotMatch(starterBlock, /正确答案|答案是/);
});

test("school-depth questions show a clear requirement card before students answer", () => {
  assert.match(html, /id="questionRequirementCard"/);
  assert.match(html, /id="questionRequirementTitle"/);
  assert.match(html, /id="questionRequirementBody"/);
  assert.match(html, /id="questionRequirementProof"/);
  assert.match(js, /function questionRequirementState/);
  assert.match(js, /function renderQuestionRequirementCard/);
  assert.match(js, /isSchoolExamPracticeQuestion\(question\)/);
  assert.match(js, /证明你不是靠选项猜对/);
  assert.match(js, /写出题目目标、第一步和原因/);
  assert.match(js, /renderQuestionRequirementCard\(question\)/);
  assert.match(css, /question-requirement-card/);
});

test("student lesson includes concept, example, steps, trap, and quick check", () => {
  assert.match(html, /方法步骤/);
  assert.match(html, /易错提醒/);
  assert.match(html, /快速自查/);
  assert.match(js, /steps:/);
  assert.match(js, /trap:/);
  assert.match(js, /quickCheck:/);
  assert.match(js, /引用文本证据|斜率与变化率|方程逆运算|变量控制/);
});

test("grade 8 and 9 priority skills have specific mini lesson blueprints", () => {
  [
    /比例关系不是只看数字变大/,
    /多步文字题先把故事拆成数量关系/,
    /比较两篇文章时/,
    /实验设计先分清改变什么/,
    /线性方程建模要把情境翻译成 y = mx \+ b/,
    /函数图像解释要同时看形状、截距和变化趋势/,
    /全等判定要证明两个三角形完全一样/,
    /证明书写像搭桥/,
    /细胞结构功能要把结构和工作配对/,
    /能量转化关注能量从哪里来、到哪里去/,
  ].forEach((pattern) => assert.match(js, pattern));
});

test("student mastery loop requires open explanation before moving on", () => {
  assert.match(html, /讲解/);
  assert.match(html, /复述/);
  assert.match(html, /变式/);
  assert.match(js, /masteryOutcome/);
  assert.match(js, /guidedMasteryCount/);
  assert.match(js, /mode: "mastery_evaluation"/);
  assert.match(js, /变式解释通过/);
  assert.match(js, /先按清单写自己的方法/);
  assert.doesNotMatch(html, /data-variant-index/);
});

test("easy fast correct answers trigger school-level explanation verification", () => {
  assert.match(js, /function needsSchoolLevelVerification/);
  assert.match(js, /const shallowChoice = isShallowChoiceQuestion\(question\)/);
  assert.match(js, /const ordinaryChoice = Array\.isArray\(question\?\.answers\) && question\.answers\.length >= 3/);
  assert.match(js, /const streakTooEasy = currentStats\.correctStreak >= 2 && ordinaryChoice/);
  assert.match(js, /\(lowDifficultyChoice \|\| shallowChoice \|\| streakTooEasy\)/);
  assert.match(js, /correctStreak >= 1/);
  assert.match(js, /secondsOnCurrentQuestion\(\) <= 20/);
  assert.match(js, /return "school_verification"/);
  assert.match(js, /学校考试式验证/);
  assert.match(js, /题目偏简单，需要升级到解释型验证/);
  assert.match(js, /issue !== "school_verification"/);
  assert.match(js, /const startsWithVariant = issue === "school_verification"/);
  assert.match(js, /status: startsWithVariant \? "variant" : "coaching"/);
  assert.match(js, /直接写出这类题的解题方法和原因/);
  assert.match(js, /答对后深度验证掌握/);
});

test("correct but unsure answers start with method verification instead of reteaching choices", () => {
  const startBlock = js.match(/function startGuidedMastery[\s\S]*?function completeGuidedMastery/)?.[0] || "";
  assert.match(js, /if \(confidence !== "sure"\) return "confidence"/);
  assert.match(startBlock, /issue === "confidence"/);
  assert.match(startBlock, /startsWithVariant/);
  assert.match(startBlock, /你刚才已经选对了/);
  assert.match(startBlock, /直接写出这类题的解题方法和原因/);
  assert.doesNotMatch(startBlock, /issue === "confidence"[\s\S]{0,260}我不会直接告诉你答案/);
});

test("school verification skips wrong-answer diagnosis so correct students are not mislabeled", () => {
  const answerHandler = js.match(/\$\("answerGrid"\)\.addEventListener\("click",[\s\S]*?\n  \}\);/)?.[0] || "";
  assert.match(answerHandler, /if \(issue !== "school_verification"\) recordMistake/);
  assert.match(answerHandler, /if \(issue !== "school_verification"\) requestCoachFeedbackForGuidance/);
});

test("correct depth answers require strong method proof before moving on", () => {
  const answerHandler = js.match(/\$\("answerGrid"\)\.addEventListener\("click",[\s\S]*?\n  \}\);/)?.[0] || "";
  const verificationBlock = js.match(/function needsCorrectAnswerMethodVerification[\s\S]*?function preAnswerStarterText/)?.[0] || "";
  assert.match(js, /function needsCorrectAnswerMethodVerification/);
  assert.match(verificationBlock, /methodProofQualityForQuestion\(question, index\)/);
  assert.match(verificationBlock, /isSchoolExamPracticeQuestion\(question\)/);
  assert.match(verificationBlock, /isChallengePreAnswerQuestion\(question\)/);
  assert.match(verificationBlock, /return !proof\.strong/);
  assert.match(js, /if \(needsCorrectAnswerMethodVerification\(question, state\.currentQuestion, confidence\)\) return "school_verification"/);
  assert.match(answerHandler, /const issue = shouldStartGuidance\(selectedIndex, question, confidence\)/);
  assert.match(js, /你选对了，但方法证明还不够完整/);
  assert.doesNotMatch(verificationBlock + answerHandler, /正确答案是|答案是/);
});

test("high-performing students are routed to explanation-first challenge questions", () => {
  assert.match(js, /function isExplanationFirstChallenge/);
  assert.match(js, /const highPerformance = adaptiveResult\.isCorrect && \(adaptiveResult\.fastCorrect \|\| adaptiveResult\.obviousEasyCorrect \|\| adaptiveResult\.proofQualityStrong \|\| adaptiveResult\.raisedLevel \|\| adaptiveResult\.challengeMode \|\| targetLevel >= 2\)/);
  assert.match(js, /const explanationChallengeCandidate = unanswered/);
  assert.match(js, /isExplanationFirstChallenge\(question\)/);
  assert.match(js, /if \(highPerformance && explanationChallengeCandidate\) return explanationChallengeCandidate\.index/);
  assert.match(js, /fastCorrect: isCorrect && secondsOnCurrentQuestion\(\) <= 20/);
  assert.match(js, /const raisedLevel = \(nextStats\.correctStreak >= 2 \|\| proofQualityStrong\) && level < difficultyLevels\.length - 1/);
  assert.match(js, /return \{ isCorrect, level, message, fastCorrect: isCorrect && secondsOnCurrentQuestion\(\) <= 20, obviousEasyCorrect, proofQualityStrong, proofStreak: nextStats\.proofStreak, raisedLevel, challengeMode \}/);
});

test("adaptive difficulty uses written method proof quality, not only speed", () => {
  const adaptiveBlock = js.match(/function updateAdaptiveDifficulty[\s\S]*?function raiseDifficultyOnDemand/)?.[0] || "";
  const nextQuestionBlock = js.match(/function nextAdaptiveQuestionIndex[\s\S]*?function challengeMissionPreferredQuestion/)?.[0] || "";
  const masteryBlock = js.match(/function completeGuidedMastery[\s\S]*?function resetDiagnosticProgress/)?.[0] || "";
  assert.match(js, /function methodProofQualityForQuestion/);
  assert.match(js, /preAnswerThoughtQuality\(thought\)/);
  assert.match(js, /quality\.hasGoal[\s\S]*quality\.hasMethod[\s\S]*quality\.hasReason[\s\S]*quality\.hasEvidence/);
  assert.match(adaptiveBlock, /const proofQuality = methodProofQualityForQuestion\(question, state\.currentQuestion\)/);
  assert.match(adaptiveBlock, /const proofQualityStrong = isCorrect && proofQuality\.strong/);
  assert.match(adaptiveBlock, /const raisedLevel = \(nextStats\.correctStreak >= 2 \|\| proofQualityStrong\) && level < difficultyLevels\.length - 1/);
  assert.match(adaptiveBlock, /方法证明完整，下一题会提高到更接近学校考试的深度/);
  assert.match(js, /方法证明完整/);
  assert.match(nextQuestionBlock, /adaptiveResult\.proofQualityStrong/);
  assert.match(masteryBlock, /proofQualityStrong: isVariantExplanationStrong\(variantReply, state\.guidanceLock\.variant\)/);
  assert.doesNotMatch(adaptiveBlock + nextQuestionBlock, /正确答案是|答案是/);
});

test("continuous strong method proof is treated as too easy evidence", () => {
  const adaptiveBlock = js.match(/function updateAdaptiveDifficulty[\s\S]*?function raiseDifficultyOnDemand/)?.[0] || "";
  const challengeBlock = js.match(/function shouldEnterChallengeBoost[\s\S]*?function isObviousEasyCorrect/)?.[0] || "";
  const evidenceBlock = js.match(/function adaptivePromotionEvidence[\s\S]*?function advanceNoticeForNextQuestion/)?.[0] || "";
  assert.match(adaptiveBlock, /proofStreak: proofQualityStrong \? \(current\.proofStreak \|\| 0\) \+ 1 : 0/);
  assert.match(challengeBlock, /const proofStreak = Number\(nextStats\.proofStreak \|\| 0\) >= 2/);
  assert.match(challengeBlock, /\|\| proofStreak/);
  assert.match(adaptiveBlock, /连续证明都很完整/);
  assert.match(adaptiveBlock, /proofStreak: nextStats\.proofStreak/);
  assert.match(evidenceBlock, /连续证明完整/);
  assert.doesNotMatch(adaptiveBlock + challengeBlock, /正确答案是|答案是/);
});

test("difficulty coach uses missed streak to steady students after mistakes", () => {
  const coachBlock = js.match(/function difficultyCoachState[\s\S]*?function renderDifficultyCoachCard/)?.[0] || "";
  assert.match(coachBlock, /stats\.missedStreak/);
  assert.match(coachBlock, /先稳住/);
  assert.match(coachBlock, /先补概念再升难度/);
  assert.doesNotMatch(coachBlock, /stats\.wrongStreak/);
});

test("challenge difficulty coach names evidence and written reasoning target", () => {
  const coachBlock = js.match(/function difficultyCoachState[\s\S]*?function renderDifficultyCoachCard/)?.[0] || "";
  assert.match(coachBlock, /adaptivePromotionEvidence\(state\.lastAdaptiveResult/);
  assert.match(coachBlock, /因为\$\{evidence\}/);
  assert.match(coachBlock, /不是随机加难/);
  assert.match(coachBlock, /开放解释、错因分析或多步推理题/);
  assert.match(coachBlock, /第一步、原因和题目证据/);
});

test("deep pre-answer feedback offers scaffolds instead of telling students to invent thoughts", () => {
  const renderBlock = js.match(/function renderDiagnostic[\s\S]*?function studentNextStepState/)?.[0] || "";
  assert.match(renderBlock, /不会写时不用硬憋/);
  assert.match(renderBlock, /先点“先教我”或“给我句式”/);
  assert.doesNotMatch(renderBlock, /先写一句自己的解题思路，再选择答案/);
});

test("guided mastery follow-up prioritizes same-skill written depth practice", () => {
  const guidedBlock = js.match(/function guidedFollowupQuestionIndex[\s\S]*?function challengeMissionPreferredQuestion/)?.[0] || "";
  const completeBlock = js.match(/function completeGuidedMastery[\s\S]*?function resetDiagnosticProgress/)?.[0] || "";
  assert.match(js, /function guidedFollowupQuestionIndex/);
  assert.match(completeBlock, /guidedFollowupQuestionIndex\(activeQuestions\(\), state\.guidanceLock\.questionIndex/);
  assert.match(guidedBlock, /question\.skill === currentSkill/);
  assert.match(guidedBlock, /isProofCapableSchoolPractice\(question\)/);
  assert.match(guidedBlock, /isExplanationFirstChallenge\(question\)/);
  assert.match(guidedBlock, /question\.errorAnalysis/);
  assert.match(guidedBlock, /question\.multiStepReasoning/);
  assert.match(guidedBlock, /nextAdaptiveQuestionIndex\(questions, answeredIndex, adaptiveResult\)/);
  assert.doesNotMatch(guidedBlock, /正确答案是|答案是/);
});

test("school-depth challenge mission prefers the same skill before jumping elsewhere", () => {
  const challengeBlock = js.match(/function challengeMissionPreferredQuestion[\s\S]*?function questionCompletesChallengeMission/)?.[0] || "";
  assert.match(challengeBlock, /queueHead\.label === "学校考试深度题"/);
  assert.match(challengeBlock, /question\.skill === currentSkill && isProofCapableSchoolPractice\(question\)/);
  assert.match(challengeBlock, /\|\| ranked\.find\(\(\{ question \}\) => isProofCapableSchoolPractice\(question\)\)/);
  assert.doesNotMatch(challengeBlock, /正确答案是|答案是/);
});

test("high-performing students get same-skill explanation challenges before unrelated hard questions", () => {
  const nextQuestionBlock = js.match(/function nextAdaptiveQuestionIndex[\s\S]*?function challengeMissionPreferredQuestion/)?.[0] || "";
  assert.match(nextQuestionBlock, /const currentSkill = questions\[answeredIndex\]\?\.skill \|\| ""/);
  assert.match(nextQuestionBlock, /sameSkillExplanationBoost/);
  assert.match(nextQuestionBlock, /question\.skill === currentSkill/);
  assert.match(nextQuestionBlock, /sameSkillExplanationBoost\(b\.question\) - sameSkillExplanationBoost\(a\.question\)/);
});

test("fast easy correct answers first look for same-skill school-depth proof", () => {
  const nextQuestionBlock = js.match(/function nextAdaptiveQuestionIndex[\s\S]*?function challengeMissionPreferredQuestion/)?.[0] || "";
  assert.match(nextQuestionBlock, /sameSkillSchoolDepthCandidate/);
  assert.match(nextQuestionBlock, /question\.skill === currentSkill/);
  assert.match(nextQuestionBlock, /isProofCapableSchoolPractice\(question\)/);
  assert.match(nextQuestionBlock, /if \(highPerformance && sameSkillSchoolDepthCandidate\) return sameSkillSchoolDepthCandidate\.index/);
  assert.match(nextQuestionBlock, /if \(highPerformance && explanationChallengeCandidate\) return explanationChallengeCandidate\.index/);
});

test("school-depth proof candidates must require written reasoning, not tagged choice-only items", () => {
  const proofBlock = js.match(/function isProofCapableSchoolPractice[\s\S]*?function isExplanationFirstChallenge/)?.[0] || "";
  assert.match(proofBlock, /question\.schoolExamDepth/);
  assert.match(proofBlock, /isChallengeProofQuestion\(question\)/);
  assert.match(proofBlock, /question\.openResponse \|\| question\.constructedResponse \|\| question\.errorAnalysis \|\| question\.multiStepReasoning/);
  assert.doesNotMatch(proofBlock, /return Boolean\(question\.schoolExamDepth && isChallengeProofQuestion\(question\)\)/);
});

test("high-performing fallback challenge also stays on the same skill first", () => {
  const nextQuestionBlock = js.match(/function nextAdaptiveQuestionIndex[\s\S]*?function challengeMissionPreferredQuestion/)?.[0] || "";
  const challengeCandidateBlock = nextQuestionBlock.match(/const challengeCandidate = unanswered[\s\S]*?const supportCandidate/)?.[0] || "";
  assert.match(nextQuestionBlock, /sameSkillChallengeBoost/);
  assert.match(challengeCandidateBlock, /sameSkillChallengeBoost\(b\.question\) - sameSkillChallengeBoost\(a\.question\)/);
});

test("easy streaks enter a short challenge mode with clear student feedback", () => {
  assert.match(js, /function challengeBoostForSubject/);
  assert.match(js, /function shouldEnterChallengeBoost/);
  assert.match(js, /challengeBoostRemaining/);
  assert.match(js, /接下来进入挑战模式/);
  assert.match(js, /挑战模式：优先做解释型\/学校考试深度题/);
  assert.match(js, /const challengeMode = challengeBoostForSubject\(subjectId\) > 0/);
  assert.match(js, /challengeMode \? 0\.85 :/);
  assert.match(js, /adaptiveResult\.challengeMode/);
  assert.match(js, /当前目标难度：\$\{adaptiveLabel\}\$\{challengeModeLabel\}/);
});

test("one obvious easy correct answer immediately promotes to depth practice", () => {
  assert.match(js, /function isObviousEasyCorrect/);
  assert.match(js, /isCorrect && confidence === "sure"/);
  assert.match(js, /secondsOnCurrentQuestion\(\) <= 20/);
  assert.match(js, /if \(isObviousEasyCorrect\(question, selectedIndex, confidence\)\) return "school_verification"/);
  assert.match(js, /adaptiveResult\.obviousEasyCorrect/);
  assert.match(js, /highPerformance = adaptiveResult\.isCorrect && \(adaptiveResult\.fastCorrect \|\| adaptiveResult\.obviousEasyCorrect/);
  assert.match(js, /这题太轻松/);
  assert.match(js, /通过后下一题再切到解释型或学校考试深度题/);
  assert.match(js, /马上做一道学校考试式验证/);
});

test("two-hour adaptive lessons start with school-exam depth when available", () => {
  assert.match(js, /function ensureSchoolExamStartQuestion/);
  assert.match(js, /isTwoHourPlan\(plan\) && plan\.difficultyMode === "adaptive"/);
  assert.match(js, /findIndex\(isSchoolExamPracticeQuestion\)/);
  assert.match(js, /ensureSchoolExamStartQuestion\(ensureEarlyDepthCadence/);
  assert.match(js, /第一题优先进入学校考试深度/);
});

test("two-hour adaptive lessons keep the opening set challenging", () => {
  const earlyBlock = js.match(/function ensureEarlyDepthCadence[\s\S]*?function limitEasyWarmupQuestions/)?.[0] || "";
  const easyBlock = js.match(/function limitEasyWarmupQuestions[\s\S]*?function ensureDepthStartQuestion/)?.[0] || "";
  const structuredBlock = js.match(/function selectTwoHourStructuredQuestions[\s\S]*?function dailyQuestionLimit/)?.[0] || "";
  assert.match(structuredBlock, /adaptiveMode \? Math\.max\(1, Math\.round\(targetQuestions \* 0\.12\)\)/);
  assert.match(earlyBlock, /isTwoHourPlan\(plan\) && plan\.difficultyMode === "adaptive" \? Math\.min\(3, earlyWindowSize\)/);
  assert.match(easyBlock, /firstFourEasyCount/);
  assert.match(easyBlock, /firstFourEasyCount <= 1/);
  assert.match(easyBlock, /index >= 4 && index < limit/);
  assert.doesNotMatch(easyBlock, /正确答案是|答案是/);
});

test("easy streaks create a visible challenge mission queue", () => {
  assert.match(html, /id="challengeMissionQueue"/);
  assert.match(html, /id="challengeMissionList"/);
  assert.match(html, /id="challengeMissionReason"/);
  assert.match(html, /id="challengeRouteStatus"/);
  assert.match(html, /id="challengeRouteCurrent"/);
  assert.match(html, /id="challengeRouteNext"/);
  assert.match(html, /挑战任务/);
  assert.match(js, /function buildChallengeMissionQueue/);
  assert.match(js, /function renderChallengeMissionQueue/);
  assert.match(js, /state\.adaptiveStats\[subjectId\]\.challengeQueue = buildChallengeMissionQueue\(question, nextStats\)/);
  assert.match(js, /挑战确认/);
  assert.match(js, /不是惩罚，也不是多刷题/);
  assert.match(js, /证明你真的掌握/);
  assert.match(js, /adaptivePromotionEvidence/);
  assert.match(js, /解释型题/);
  assert.match(js, /学校考试深度题/);
  assert.match(js, /同技能变式题/);
  assert.match(js, /renderChallengeMissionQueue\(question\)/);
  assert.match(css, /challenge-mission-queue/);
});

test("challenge route tells students the current step and next proof target", () => {
  const routeBlock = js.match(/function renderChallengeMissionQueue[\s\S]*?function isTwoHourPlan/)?.[0] || "";
  assert.match(routeBlock, /const totalSteps = 3/);
  assert.match(routeBlock, /第 \$\{currentStep\}\/\$\{totalSteps\} 步/);
  assert.match(routeBlock, /先写方法证明，再看选项/);
  assert.match(routeBlock, /完成后进入/);
  assert.match(routeBlock, /同一个知识点继续加深，不是随机加难/);
  assert.match(routeBlock, /挑战路线结束/);
  assert.match(routeBlock, /class="\$\{index === 0 \? "active" : ""\}"/);
  assert.match(css, /challenge-route-status/);
  assert.match(css, /challenge-mission-queue li\.active/);
  assert.doesNotMatch(routeBlock, /正确答案是|答案是|选项\s*[A-D]/);
});

test("challenge mission queue directly steers the next question type", () => {
  assert.match(js, /function challengeMissionPreferredQuestion/);
  assert.match(js, /const challengeQueue = state\.adaptiveStats\[state\.subject\]\?\.challengeQueue \|\| \[\]/);
  assert.match(js, /challengeMissionPreferredQuestion\(unanswered, challengeQueue, targetLevel\)/);
  assert.match(js, /queueHead\.label === "解释型题"/);
  assert.match(js, /queueHead\.label === "学校考试深度题"/);
  assert.match(js, /queueHead\.label === "同技能变式题"/);
  assert.match(js, /if \(adaptiveResult\.challengeMode && missionCandidate\) return missionCandidate\.index/);
});

test("challenge fallback avoids hard choice-only questions", () => {
  const nextQuestionBlock = js.match(/function nextAdaptiveQuestionIndex[\s\S]*?function challengeMissionPreferredQuestion/)?.[0] || "";
  const challengeCandidateBlock = nextQuestionBlock.match(/const challengeCandidate = unanswered[\s\S]*?const supportCandidate/)?.[0] || "";

  assert.match(challengeCandidateBlock, /isChallengeProofQuestion\(question\)/);
  assert.match(challengeCandidateBlock, /isSchoolExamPracticeQuestion\(question\)/);
  assert.doesNotMatch(
    challengeCandidateBlock,
    /difficultyScore\(question\.difficulty\) >= Math\.max\(2, targetLevel - 1\) \|\| question\.schoolExamDepth/
  );
  assert.doesNotMatch(challengeCandidateBlock, /question\.schoolExamDepth \|\| question\.constructedResponse/);
});

test("school-depth challenge missions require proof-capable school practice", () => {
  const missionBlock = js.match(/function challengeMissionPreferredQuestion[\s\S]*?function questionCompletesChallengeMission/)?.[0] || "";
  const completionBlock = js.match(/function questionCompletesChallengeMission[\s\S]*?function challengeMissionCompletionNotice/)?.[0] || "";

  assert.match(js, /function isProofCapableSchoolPractice/);
  assert.match(missionBlock, /queueHead\.label === "学校考试深度题"/);
  assert.match(missionBlock, /isProofCapableSchoolPractice\(question\)/);
  assert.match(completionBlock, /mission\.label === "学校考试深度题"/);
  assert.match(completionBlock, /isProofCapableSchoolPractice\(question\)/);
  assert.doesNotMatch(missionBlock, /ranked\.find\(\(\{ question \}\) => question\.schoolExamDepth\)/);
  assert.doesNotMatch(completionBlock, /return Boolean\(question\.schoolExamDepth\)/);
});

test("challenge mission explanation step prefers same-skill depth questions", () => {
  const missionBlock = js.match(/function challengeMissionPreferredQuestion[\s\S]*?function questionCompletesChallengeMission/)?.[0] || "";

  assert.match(missionBlock, /const currentSkill = activeQuestions\(\)\[state\.currentQuestion\]\?\.skill \|\| ""/);
  assert.match(missionBlock, /sameSkillExplanation/);
  assert.match(missionBlock, /question\.skill === currentSkill/);
  assert.match(missionBlock, /return sameSkillExplanation \|\| ranked\.find/);
});

test("completed challenge missions advance the queue instead of staying stuck", () => {
  assert.match(js, /function completeChallengeMissionForQuestion/);
  assert.match(js, /function questionCompletesChallengeMission/);
  assert.match(js, /const queue = stats\.challengeQueue \|\| \[\]/);
  assert.match(js, /const remainingQueue = queue\.slice\(1\)/);
  assert.match(js, /challengeQueue: remainingQueue/);
  assert.match(js, /challengeBoostRemaining: remainingQueue\.length/);
  assert.match(js, /completeChallengeMissionForQuestion\(question, "correct", subjectId\)/);
  assert.match(js, /completeChallengeMissionForQuestion\(question, "guided"\)/);
});

test("student sees a clear notice after each challenge mission is completed", () => {
  assert.match(js, /function challengeMissionCompletionNotice/);
  assert.match(js, /const completedMission = queue\[0\]/);
  assert.match(js, /state\.lastChallengeMissionNotice = challengeMissionCompletionNotice\(completedMission, remainingQueue\)/);
  assert.match(js, /挑战任务完成/);
  assert.match(js, /下一步挑战/);
  assert.match(js, /挑战三步已完成/);
  assert.match(js, /因为上一题太顺/);
  assert.match(js, /继续用同一个知识点证明掌握/);
  assert.match(js, /不是随机加难/);
  assert.match(js, /state\.lastAdvanceNotice = state\.lastChallengeMissionNotice \|\|/);
  assert.match(js, /state\.lastChallengeMissionNotice = ""/);
});

test("completed challenge missions become reportable mastery proof", () => {
  assert.match(html, /id="studentChallengeProofs"/);
  assert.match(html, /id="parentChallengeProofSummary"/);
  assert.match(js, /challengeProofs: \[\]/);
  assert.match(js, /function recordChallengeProof/);
  assert.match(js, /recordChallengeProof\(question, completedMission, outcome, subjectId\)/);
  assert.match(js, /function challengeProofSummary/);
  assert.match(js, /renderChallengeProofSummary/);
  assert.match(js, /renderParentChallengeProofSummary/);
  assert.match(js, /challengeProofCount: challengeProofSummary\(student\.id\)\.total/);
  assert.match(js, /挑战证明/);
});

test("student next-step card explains the active challenge mission", () => {
  assert.match(js, /function activeChallengeMission/);
  assert.match(js, /const challengeMission = activeChallengeMission\(\)/);
  assert.match(js, /badge: "挑战证明"/);
  assert.match(js, /title: `先完成\$\{challengeMission\.label\}`/);
  assert.match(js, /这题不是普通选择题/);
  assert.match(js, /证明你不是靠选项猜对/);
  assert.match(js, /activeChallengeMission\(\)\?\.detail/);
});

test("variant verification gives a structured method checklist", () => {
  assert.match(html, /id="variantMission"/);
  assert.match(html, /id="variantMethodChecklist"/);
  assert.match(html, /id="variantSelfCheck"/);
  assert.match(js, /function variantMethodChecklistFor/);
  assert.match(js, /判断题目类型/);
  assert.match(js, /写出第一步/);
  assert.match(js, /说明为什么/);
  assert.match(js, /renderVariantVerification/);
  assert.match(css, /variant-method-card/);
});

test("variant method checklist adapts to the current skill without revealing answers", () => {
  assert.match(js, /function variantSkillPracticeGuideFor/);
  assert.match(js, /x 的变化和 y 的变化/);
  assert.match(js, /变量周围最外层操作/);
  assert.match(js, /题干要证明的观点/);
  assert.doesNotMatch(js, /expectedMethod.*steps/);
});

test("variant submission returns teacher-style rubric feedback", () => {
  assert.match(html, /id="variantRubricFeedback"/);
  assert.match(js, /function buildVariantRubricFeedback/);
  assert.match(js, /题目类型/);
  assert.match(js, /第一步/);
  assert.match(js, /原因解释/);
  assert.match(js, /避开误区/);
  assert.match(js, /常见误区/);
  assert.match(js, /buildVariantRubricFeedback\(reply/);
  assert.match(js, /variantRubricFeedback"\)\.innerHTML/);
  assert.match(css, /variant-rubric-feedback/);
});

test("variant rubric feedback updates live as the student types", () => {
  assert.match(js, /function variantRubricItems/);
  assert.match(js, /variantReply"\)\.addEventListener\("input", \(\) => \{/);
  assert.match(js, /state\.guidanceLock\.variantDraft = \$\("variantReply"\)\.value/);
  assert.match(js, /state\.guidanceLock\.variantFeedback = ""/);
  assert.match(js, /rubric-\$\{item\.ready \? "met" : "missing"\}/);
  assert.match(css, /rubric-met/);
  assert.match(css, /rubric-missing/);
});

test("variant live feedback tells the student the next missing step", () => {
  assert.match(js, /function variantNextActionText/);
  assert.match(js, /下一步：\$\{missing\.next\}/);
  assert.match(js, /说明已经完整，可以提交给 AI 教练检查/);
  assert.match(js, /补一句你没有掉进哪个常见误区/);
  assert.match(js, /variantFeedback"\)\.textContent = variantNextActionText/);
});

test("variant waiting feedback gives a concrete self-check while AI grades", () => {
  const variantHandler = js.match(/\$\("variantForm"\)\.addEventListener\("submit",[\s\S]*?\n  \}\);/)?.[0] || "";
  assert.match(js, /function setVariantWaitingFeedback/);
  assert.match(js, /AI 正在批改变式解释/);
  assert.match(js, /先自查五项/);
  assert.match(js, /题目类型、第一步、原因、避开误区、具体内容/);
  assert.match(variantHandler, /setVariantWaitingFeedback\(rubricFeedback\)/);
});

test("variant verification can insert the next missing method sentence", () => {
  assert.match(html, /id="variantNextHelp"/);
  assert.match(html, /id="applyVariantNextStepButton"/);
  assert.match(html, /补下一句/);
  assert.match(js, /function variantNextStepStarterFor/);
  assert.match(js, /function renderVariantNextHelp/);
  assert.match(js, /applyVariantNextStepButton"\)\.addEventListener\("click"/);
  assert.match(js, /applyVariantStarter\(variantNextStepStarterFor/);
  assert.match(js, /不要写答案/);
  assert.doesNotMatch(js, /variantNextStepStarterFor[\s\S]*正确答案是/);
  assert.match(css, /variant-next-help/);
});

test("variant verification lets a stuck student return to reteaching", () => {
  assert.match(html, /id="variantReteachButton"/);
  assert.match(html, /换种讲法/);
  assert.match(js, /function variantReteachMessageFor/);
  assert.match(js, /function requestVariantReteach/);
  assert.match(js, /variantReteachButton"\)\.addEventListener\("click", requestVariantReteach\)/);
  assert.match(js, /state\.guidanceLock\.status = "coaching"/);
  assert.match(js, /我第一步先____，因为____/);
  assert.match(js, /现在先不提交变式/);
  assert.doesNotMatch(js, /variantReteachMessageFor[\s\S]*正确答案是/);
  assert.match(css, /variant-next-actions/);
});

test("variant verification offers concept help before students type a full proof", () => {
  assert.match(html, /id="variantConceptHelpButton"/);
  assert.match(html, /先补知识点/);
  assert.match(js, /function variantConceptHelpStarterFor/);
  assert.match(js, /conceptMiniLesson\(question\)/);
  assert.match(js, /localStudentFriendlyConceptLine\(question\)/);
  assert.match(js, /variantConceptHelpButton"\)\.addEventListener\("click"/);
  assert.match(js, /applyVariantStarter\(variantConceptHelpStarterFor/);
  assert.match(js, /现在只补一个空/);
  assert.doesNotMatch(js, /variantConceptHelpStarterFor[\s\S]*正确答案是/);
});

test("student cannot submit variant explanation until rubric is complete", () => {
  const variantHandler = js.match(/\$\("variantForm"\)\.addEventListener\("submit",[\s\S]*?\n  \}\);/)?.[0] || "";
  assert.match(html, /id="variantSubmit"/);
  assert.match(js, /function isVariantRubricReady/);
  assert.match(js, /\$\("variantSubmit"\)\.textContent = ready \? "提交变式解释" : "不会写，帮我补下一句"/);
  assert.match(variantHandler, /if \(!isVariantRubricReady\(reply/);
  assert.match(js, /先补完整各项变式说明/);
  assert.match(variantHandler, /return;/);
});

test("variant primary button helps stuck students instead of blocking on empty text", () => {
  const renderBlock = js.match(/function renderVariantRubricFeedback[\s\S]*?function setVariantWaitingFeedback/)?.[0] || "";
  const variantHandler = js.match(/\$\("variantForm"\)\.addEventListener\("submit",[\s\S]*?\n  \}\);/)?.[0] || "";
  assert.match(renderBlock, /\$\("variantSubmit"\)\.disabled = false/);
  assert.match(renderBlock, /\$\("variantSubmit"\)\.textContent = ready \? "提交变式解释" : "不会写，帮我补下一句"/);
  assert.match(variantHandler, /if \(!reply\) \{/);
  assert.match(variantHandler, /applyVariantStarter\(variantNextStepStarterFor\("", state\.guidanceLock\?\.variant\)\)/);
  assert.match(variantHandler, /return;/);
  assert.match(variantHandler, /if \(!isVariantRubricReady\(reply, state\.guidanceLock\?\.variant\)\)/);
  assert.match(variantHandler, /applyVariantStarter\(variantNextStepStarterFor\(reply, state\.guidanceLock\?\.variant\)\)/);
  assert.doesNotMatch(variantHandler, /completeGuidedMastery\(reply\)[\s\S]*if \(!isVariantRubricReady/);
});

test("local strong variant fallback cannot bypass the full rubric", () => {
  const strongBlock = js.match(/function isVariantExplanationStrong[\s\S]*?function hasMeaningfulVariantCompletion/)?.[0] || "";
  assert.match(strongBlock, /isVariantRubricReady\(reply, variant\)/);
  assert.doesNotMatch(strongBlock, /return hasMethodLanguage && keywordHits >= 1;/);
});

test("variant retry stays in the proof panel and preserves the student draft", () => {
  assert.match(js, /function variantTargetedRetryText/);
  assert.match(js, /先别重写全部，只补这一处/);
  assert.match(js, /更像学校考试答案/);
  assert.match(js, /\$\("variantReply"\)\.value = lock\.variantDraft \|\| ""/);
  assert.match(js, /if \(lock\.variantFeedback\) \$\("variantFeedback"\)\.textContent = lock\.variantFeedback/);
  assert.match(js, /state\.guidanceLock\.status = "variant"/);
  assert.match(js, /state\.guidanceLock\.variantDraft = reply/);
  assert.match(js, /state\.guidanceLock\.variantFeedback = variantTargetedRetryText/);
  assert.doesNotMatch(js, /variantTargetedRetryText[\s\S]*正确答案是/);
});

test("variant retry keeps next-step help visible even after rubric is complete", () => {
  assert.match(js, /const needsRetryDetail = Boolean\(state\.guidanceLock\?\.variantFeedback\)/);
  assert.match(js, /help\.classList\.toggle\("hidden", ready && !needsRetryDetail\)/);
  assert.match(js, /variantNextStepStarterFor\(reply, variant, undefined, needsRetryDetail\)/);
  assert.match(js, /具体来说，题目里的____说明我的方法____/);
  assert.match(js, /不要重做整题，只补一句具体证据或条件/);
  assert.doesNotMatch(js, /needsRetryDetail[\s\S]*正确答案是/);
});

test("variant retry next-step button inserts the forced specific-detail starter", () => {
  assert.match(js, /const needsRetryDetail = Boolean\(state\.guidanceLock\?\.variantFeedback\)/);
  assert.match(
    js,
    /applyVariantStarter\(variantNextStepStarterFor\(\s*\$\("variantReply"\)\.value,\s*state\.guidanceLock\?\.variant,\s*undefined,\s*Boolean\(state\.guidanceLock\?\.variantFeedback\)\s*\)\)/
  );
  assert.match(js, /具体来说，题目里的____说明我的方法____/);
});

test("variant explanation offers non-answer sentence starters", () => {
  assert.match(html, /id="variantStarterBar"/);
  assert.match(js, /function variantSentenceStartersFor/);
  assert.match(js, /function applyVariantStarter/);
  assert.match(js, /data-starter-text/);
  assert.match(js, /这样做是因为/);
  assert.match(css, /variant-starter-bar/);
});

test("sentence starters alone do not complete variant mastery", () => {
  assert.match(js, /function hasMeaningfulVariantCompletion/);
  assert.match(js, /具体内容/);
  assert.match(js, /把句式后面的内容补完整/);
  assert.match(js, /hasMeaningfulVariantCompletion\(reply\)/);
  assert.match(js, /我先要判断/);
  assert.match(js, /这一步能帮我判断方法，而不是直接猜选项/);
  assert.match(js, /具体来说，我还要把题目里的条件和我的方法连起来说明/);
});

test("variant verification does not reveal the expected method before the student writes", () => {
  assert.doesNotMatch(js, /写出第一步：\$\{expected\}/);
  assert.doesNotMatch(js, /参考方向：\$\{lock\.variant\.expectedMethod\}/);
  assert.match(js, /先按清单写自己的方法/);
  assert.match(js, /补完整各项变式说明/);
});

test("variant verification uses explicit expected method when available", () => {
  assert.match(js, /function questionExpectedMethod/);
  assert.match(js, /question\?\.expectedMethod/);
  assert.match(js, /const method = questionExpectedMethod\(question\)/);
  assert.doesNotMatch(js, /const method = question\?\.explanation \|\| question\?\.coachHints\?\.\[0\]/);
});

test("student AI requests have fast timeout fallback", () => {
  assert.match(js, /COACH_RESPONSE_TIMEOUT_MS/);
  assert.match(js, /MASTERY_RESPONSE_TIMEOUT_MS/);
  assert.match(js, /const COACH_RESPONSE_TIMEOUT_MS = 2800/);
  assert.match(js, /const MASTERY_RESPONSE_TIMEOUT_MS = 3500/);
  assert.match(js, /postCoachPayload/);
  assert.match(js, /AbortController/);
  assert.match(js, /本地引导/);
  assert.match(js, /先给你一个提示/);
  assert.match(js, /先按这个提示继续/);
  assert.match(js, /state\.chatHistory\.slice\(0, -1\)/);
});

test("wrong-answer coach feedback uses a short timeout and keeps local guidance visible", () => {
  const feedbackBlock = js.match(/async function requestCoachFeedbackForGuidance[\s\S]*?async function loadAuthProfile/)?.[0] || "";
  assert.match(js, /COACH_FEEDBACK_TIMEOUT_MS/);
  assert.match(feedbackBlock, /AbortController/);
  assert.match(feedbackBlock, /setTimeout\(\(\) => controller\.abort\(\), COACH_FEEDBACK_TIMEOUT_MS\)/);
  assert.match(feedbackBlock, /signal: controller\.signal/);
  assert.match(feedbackBlock, /clearTimeout\(timeoutId\)/);
  assert.match(feedbackBlock, /本地诊断/);
  assert.match(feedbackBlock, /appendInlineCoach\(\s*"coach",\s*`本地诊断/);
});

test("student AI replies append after the instant local coach instead of replacing it", () => {
  const chatHandler = js.match(/\$\("chatForm"\)\.addEventListener\("submit",[\s\S]*?\n  \}\);/)?.[0] || "";
  const inlineHandler = js.match(/\$\("inlineCoachForm"\)\.addEventListener\("submit",[\s\S]*?\$\("inlineCoachReply"\)\.addEventListener/)?.[0] || "";
  assert.match(js, /AI 正在深度检查/);
  assert.match(js, /function appendCoachSupplement/);
  assert.match(js, /function sanitizeCoachSupplement/);
  assert.match(js, /AI 补充太长/);
  assert.match(js, /重复追问题目/);
  assert.match(js, /sanitizeCoachSupplement\(text/);
  assert.match(chatHandler, /appendCoachSupplement\(state\.chatHistory, data\.reply/);
  assert.match(inlineHandler, /appendCoachSupplement\(state\.inlineCoachHistory,/);
  assert.doesNotMatch(chatHandler, /state\.chatHistory\.pop\(\)/);
  assert.doesNotMatch(inlineHandler, /state\.inlineCoachHistory\.pop\(\)/);
  assert.doesNotMatch(chatHandler, /lastElementChild\.remove\(\)/);
});

test("remote AI supplement keeps the child on the current partial-method step", () => {
  const sanitizeBlock = js.match(/function sanitizeCoachSupplement[\s\S]*?function appendCoachSupplement/)?.[0] || "";
  assert.match(sanitizeBlock, /latestCoachMove/);
  assert.match(sanitizeBlock, /这部分保留|直接接下一句/);
  assert.match(sanitizeBlock, /远端 AI 回到旧问题/);
  assert.match(sanitizeBlock, /按刚才的小步骤继续/);
  assert.match(sanitizeBlock, /题目里的____说明____/);
  assert.match(sanitizeBlock, /题目.*问什么|先说.*题目/);
  assert.doesNotMatch(sanitizeBlock, /远端 AI 回到旧问题[\s\S]{0,180}先说题目问什么/);
});

test("inline coach waiting state tells the student the next concrete step", () => {
  const inlineHandler = js.match(/\$\("inlineCoachForm"\)\.addEventListener\("submit",[\s\S]*?\$\("inlineCoachReply"\)\.addEventListener/)?.[0] || "";
  assert.match(js, /function setGuidanceWaitingAction/);
  assert.match(js, /AI 正在补充检查/);
  assert.match(js, /先按本地提示补这一小步/);
  assert.match(inlineHandler, /setGuidanceWaitingAction\(immediateReply, canMoveToVariant\)/);
  assert.match(js, /renderGuidanceNextAction\(\)/);
});

test("guidance next action names the exact button for concept gaps", () => {
  assert.match(js, /点“帮我填第一小句”/);
  assert.match(js, /点“再讲一遍”/);
  assert.match(js, /只补第一小句/);
  assert.match(js, /不用先打完整解释/);
  assert.doesNotMatch(js, /guidanceNextActionForReply[\s\S]*正确答案是/);
});

test("inline guidance help names the diagnosed stuck gap", () => {
  const helpBlock = js.match(/function guidanceReplyHelpText[\s\S]*?function guidanceReplyProgressText/)?.[0] || "";
  const actionBlock = js.match(/function guidanceNextActionForReply[\s\S]*?function renderGuidanceNextAction/)?.[0] || "";
  assert.match(js, /function guidanceStuckGapStatus/);
  assert.match(helpBlock, /coachingGapForReply\(reply\)/);
  assert.match(helpBlock, /卡点判断：\$\{gap\.label\}/);
  assert.match(actionBlock, /guidanceStuckGapStatus\(reply/);
  assert.match(js, /缺具体证据/);
  assert.match(js, /第一步不会选/);
  assert.match(js, /概念没接上/);
  assert.doesNotMatch(helpBlock, /正确答案是|答案是/);
});

test("student can continue after an AI message without inventing what to type", () => {
  const followupBlock = js.match(/function buildCoachFollowupReply[\s\S]*?function applyCoachFollowupAction/)?.[0] || "";
  assert.match(html, /id="coachFollowupActions"/);
  assert.match(html, /data-coach-followup="unpack"/);
  assert.match(html, /data-coach-followup="first-sentence"/);
  assert.match(html, /data-coach-followup="stuck"/);
  assert.match(html, /data-coach-followup="example"/);
  assert.match(html, /data-coach-followup="next"/);
  assert.match(js, /function renderCoachFollowupActions/);
  assert.match(js, /function applyCoachFollowupAction/);
  assert.match(js, /coachFollowupActions"\)\.classList\.toggle\("hidden", !showActions\)/);
  assert.match(js, /appendInlineCoach\("student", "我还是没懂，请换一种讲法。"\)/);
  assert.match(js, /appendInlineCoach\("student", "我不知道这题问什么，请先帮我拆题。"\)/);
  assert.match(js, /appendInlineCoach\("student", "帮我填第一句。"\)/);
  assert.match(js, /appendInlineCoach\("coach", buildCoachFollowupReply/);
  assert.match(js, /guidanceNextSentenceForLock\(state\.guidanceLock, question\)/);
  assert.match(js, /guidanceQuestionUnpackForLock\(lock, question\)/);
  assert.match(js, /guidanceStepBuilderSentence\("goal", lock, question\)/);
  assert.match(js, /不用重新组织完整解释/);
  assert.doesNotMatch(followupBlock, /正确答案是|答案是/);
});

test("stuck student can click scaffold actions instead of typing the question goal", () => {
  const followupBlock = js.match(/function buildCoachFollowupReply[\s\S]*?function guidanceMicroDrillForLock/)?.[0] || "";
  assert.match(followupBlock, /不要求你自己说“这题问什么”/);
  assert.match(followupBlock, /我先帮你填第一句，不用凭空打字/);
  assert.match(followupBlock, /state\.guidanceLock\.forceStepBuilder = true/);
  assert.match(followupBlock, /stepBuilderParts/);
  assert.doesNotMatch(followupBlock, /正确答案是|答案是/);
});

test("coach follow-up buttons switch teaching style after repeated stuck clicks", () => {
  const followupBlock = js.match(/function buildCoachFollowupReply[\s\S]*?function applyCoachFollowupAction/)?.[0] || "";
  assert.match(followupBlock, /guidanceNeedsWorkedMiniExample\(lock\)/);
  assert.match(followupBlock, /thirdStuckMiniExampleRescue\(lock, question/);
  assert.match(followupBlock, /guidanceNeedsLowerStep\(lock\)/);
  assert.match(followupBlock, /repeatedStuckAlternativeExplanation\(lock, question/);
  assert.match(followupBlock, /只给下一步/);
  assert.match(followupBlock, /不用重新组织完整解释/);
  assert.doesNotMatch(followupBlock, /正确答案是|答案是/);
});

test("local student coach handles answer letters and stuck replies directly", () => {
  assert.match(js, /function buildLocalCoachReply/);
  assert.match(js, /function coachingGapForReply/);
  assert.match(js, /function localGapSentenceFrame/);
  assert.match(js, /function localOneStepCoachPrompt/);
  assert.match(js, /function coachHistoryAlreadyUsed/);
  assert.match(js, /function localRepeatedStuckCount/);
  assert.match(js, /history = state\.chatHistory/);
  assert.match(js, /const hintTurn = Math\.max/);
  assert.match(js, /缺的是/);
  assert.match(js, /只补这一句/);
  assert.match(js, /只写了答案/);
  assert.match(js, /第一步看什么/);
  assert.match(js, /题目里的关键词/);
  assert.match(js, /小讲解/);
  assert.match(js, /小例子/);
  assert.match(js, /我们不重复刚才那句/);
  assert.match(js, /commonMistakeForQuestion\(question\)/);
  assert.match(js, /coachingHintForTurn\(question, 1\)/);
  assert.match(js, /coachingHintForTurn\(question, 2\)/);
  assert.match(js, /buildLocalCoachReply\(reply, state\.inlineCoachHistory\)/);
});

test("local student coach changes strategy after repeated stuck replies", () => {
  const helperBlock = js.match(/function localRepeatedStuckCount[\s\S]*?async function askAiCoach/)?.[0] || "";
  const localBlock = js.match(/function buildLocalCoachReply[\s\S]*?function renderEmail/)?.[0] || "";
  assert.match(helperBlock, /slice\(-3\)/);
  assert.match(helperBlock, /知识点没吃透/);
  assert.match(localBlock, /const repeatedStuckCount = localRepeatedStuckCount\(history, rawReply\)/);
  assert.match(localBlock, /repeatedStuckCount >= 3/);
  assert.match(localBlock, /第三次卡住，我们换成非原题小例子/);
  assert.match(localBlock, /repeatedStuckCount >= 2/);
  assert.match(localBlock, /第二次卡住，不继续追问你“题目问什么”/);
  assert.match(localBlock, /不用打字的小台阶/);
  assert.doesNotMatch(localBlock, /第二次卡住[\s\S]*正确答案是|第三次卡住[\s\S]*正确答案是/);
});

test("local student coach continues partial method attempts instead of restarting", () => {
  assert.match(js, /function localMethodAttemptContinuation/);
  assert.match(js, /你说对的是/);
  assert.match(js, /下一句只补/);
  assert.match(js, /题目里的____说明____/);
  assert.match(js, /localMethodAttemptContinuation\(rawReply, question\)/);
  assert.doesNotMatch(js, /localMethodAttemptContinuation[\s\S]*正确答案是/);
});

test("local student coach asks only for because when partial method is missing reason", () => {
  const continuationBlock = js.match(/function localMethodAttemptContinuation[\s\S]*?function localStudentFriendlyConceptLine/)?.[0] || "";
  assert.match(continuationBlock, /const gap = coachingGapForReply\(reply\)/);
  assert.match(continuationBlock, /gap\.label === "原因说明不完整"/);
  assert.match(continuationBlock, /现在只补因为/);
  assert.match(continuationBlock, /因为这一步能帮我____/);
  assert.doesNotMatch(continuationBlock, /现在只补因为[\s\S]*正确答案/);
});

test("local student coach treats generic reasons as missing concrete evidence", () => {
  const gapBlock = js.match(/function coachingGapForReply[\s\S]*?function localGapSentenceFrame/)?.[0] || "";
  const continuationBlock = js.match(/function localMethodAttemptContinuation[\s\S]*?function localStudentFriendlyConceptLine/)?.[0] || "";
  assert.match(gapBlock, /缺具体证据/);
  assert.match(gapBlock, /!quality\.specificEvidence/);
  assert.match(continuationBlock, /gap\.label === "缺具体证据"/);
  assert.match(continuationBlock, /现在只补题目里的具体证据/);
  assert.match(continuationBlock, /题目里的____说明____/);
  assert.doesNotMatch(continuationBlock, /缺具体证据[\s\S]*正确答案/);
});

test("local coach does not require students to invent the question goal when they are stuck", () => {
  const gapBlock = js.match(/function coachingGapForReply[\s\S]*?function localGapSentenceFrame/)?.[0] || "";
  const promptBlock = js.match(/function localOneStepCoachPrompt[\s\S]*?function localPartialMethodAnchors/)?.[0] || "";
  assert.match(gapBlock, /先看老师示范，再补一个空/);
  assert.match(promptBlock, /如果说不出来，就直接补空/);
  assert.doesNotMatch(gapBlock, /说出题目真正问什么/);
  assert.doesNotMatch(promptBlock, /说出题目真正问什么/);
});

test("parent report describes teach-first coaching instead of asking stuck students to explain first", () => {
  const emailBlock = js.match(/function renderEmail[\s\S]*?function parentDigestEmailAddress/)?.[0] || "";
  assert.match(emailBlock, /先补关键概念/);
  assert.match(emailBlock, /小例子/);
  assert.match(emailBlock, /二选一或填空/);
  assert.match(emailBlock, /不要先要求孩子完整解释题意/);
  assert.doesNotMatch(emailBlock, /先让孩子解释题意/);
});

test("practice hint button gives a teacher-first micro hint instead of asking the student to invent the goal", () => {
  const hintHandler = js.match(/\$\("practiceHintButton"\)\.addEventListener\("click",[\s\S]*?\n  \}\);/)?.[0] || "";
  assert.match(js, /function studentSafePracticeHint/);
  assert.match(js, /老师先帮你拆一小步/);
  assert.match(js, /只补一个空/);
  assert.match(hintHandler, /studentSafePracticeHint\(question\)/);
  assert.doesNotMatch(hintHandler, /先说题目真正问什么/);
  assert.doesNotMatch(js, /studentSafePracticeHint[\s\S]*正确答案是/);
});

test("standalone AI coach opens with teaching before asking for the question goal", () => {
  const renderCoachBlock = js.match(/function renderCoach[\s\S]*?function appendChat/)?.[0] || "";
  assert.match(renderCoachBlock, /我先帮你拆题/);
  assert.match(renderCoachBlock, /先补一个小知识点/);
  assert.match(renderCoachBlock, /只补一个空/);
  assert.match(renderCoachBlock, /localStudentFriendlyConceptLine\(question\)/);
  assert.doesNotMatch(renderCoachBlock, /请你用自己的话说：这道题真正问的是什么/);
});

test("student coach uses recent same-skill mistakes", () => {
  assert.match(js, /recentSkillMistakes/);
  assert.match(js, /mistakesForCurrentSkill/);
  assert.match(js, /sameSkillMistakeSummary/);
});

test("local student coach teaches stuck replies with a short diagnosed concept step", () => {
  assert.match(js, /function localStudentFriendlyConceptLine/);
  assert.match(js, /卡点判断：\$\{gap\.label\}/);
  assert.match(js, /小讲解：\$\{localStudentFriendlyConceptLine/);
  assert.match(js, /现在只做一小步：\$\{localGapSentenceFrame/);
  assert.match(js, /不要把英文解析原句直接给孩子/);
  assert.doesNotMatch(js, /小讲解：\$\{commonMistakeForQuestion\(question\)\}/);
});

test("local student coach separates stuck gaps before teaching", () => {
  assert.match(js, /function localStuckGapTeachingAction/);
  assert.match(js, /题意没拆开/);
  assert.match(js, /概念没接上/);
  assert.match(js, /第一步不会选/);
  assert.match(js, /原因说不出/);
  assert.match(js, /先把题目翻译成一句话/);
  assert.match(js, /先补前置概念/);
  assert.match(js, /只选第一步动作/);
  assert.match(js, /只补因为/);
  assert.match(js, /localStuckGapTeachingAction\(gap, question\)/);
});

test("mistake review opens a targeted review lesson", () => {
  assert.match(js, /openMistakeReviewLesson/);
  assert.match(js, /data-review-mistake/);
  assert.match(js, /复习这题/);
  assert.match(js, /错题复习课/);
});

test("mistake notebook shows a three-question similar practice pack", () => {
  assert.match(js, /function similarPracticePackForMistake/);
  assert.match(js, /similarPracticePackForMistake\(item\)/);
  assert.match(js, /同类练习包/);
  assert.match(js, /slice\(0, limit\)/);
  assert.match(css, /similar-practice-pack/);
});

test("similar practice prioritizes school-depth and explanation tasks", () => {
  assert.match(js, /function similarQuestionRank/);
  assert.match(js, /question\.schoolExamDepth/);
  assert.match(js, /question\.constructedResponse \|\| question\.openResponse \|\| question\.errorAnalysis/);
  assert.match(js, /difficultyScore\(question\.difficulty\)/);
  assert.match(js, /similarQuestionRank\(b, item\) - similarQuestionRank\(a, item\)/);
  assert.match(js, /function bestSimilarQuestionIndex/);
  assert.match(js, /const similarIndex = bestSimilarQuestionIndex\(activeQuestions\(\), state\.currentQuestion\)/);
});

test("student daily plan shows next action and completion state", () => {
  assert.match(html, /id="todayNextAction"/);
  assert.match(js, /todayCompletionState/);
  assert.match(js, /nextStudentAction/);
  assert.match(js, /今日学习已完成/);
  assert.match(js, /生成今日总结/);
});

test("student daily plan includes a wrap-up summary action", () => {
  assert.match(html, /id="studentWrapupPanel"/);
  assert.match(html, /id="wrapupAnswered"/);
  assert.match(html, /id="wrapupGuided"/);
  assert.match(html, /id="wrapupMistakes"/);
  assert.match(html, /id="wrapupAccuracy"/);
  assert.match(html, /id="wrapupTime"/);
  assert.match(html, /id="finishTodayButton"/);
  assert.match(js, /function renderStudentWrapup/);
  assert.match(js, /家长端可以看到今天表现/);
});

test("practice sessions track time hints accuracy and learning behavior", () => {
  const recordBlock = js.match(/function recordPracticeAttempt[\s\S]*?function todayPracticeSessionSummary/)?.[0] || "";
  assert.match(js, /practiceSessions: \[\]/);
  assert.match(js, /function currentPracticeSession/);
  assert.match(js, /function recordPracticeAttempt/);
  assert.match(js, /function todayPracticeSessionSummary/);
  assert.match(js, /questionsAnswered/);
  assert.match(js, /hintsUsed/);
  assert.match(js, /slowCount/);
  assert.match(js, /guessingCount/);
  assert.match(js, /state\.hintUsage\[questionProgressKey\(\)\] = true/);
  assert.match(js, /recordPracticeAttempt\(question, selectedIndex, confidence, adaptiveResult\)/);
  assert.match(recordBlock, /const guessedOrUnsure = confidence !== "sure" \|\| \(!correct && seconds <= 12\)/);
  assert.match(recordBlock, /session\.guessingCount \+= guessedOrUnsure \? 1 : 0/);
});

test("practice sessions can sync with Supabase without blocking student answers", () => {
  assert.match(js, /savePracticeSessionToCloud/);
  assert.match(js, /syncPracticeSessionsToCloud/);
  assert.match(js, /loadPracticeSessionsFromCloud/);
  assert.match(js, /cloudPracticeSessionToLocal/);
  assert.match(js, /practice_sessions/);
  assert.match(js, /savePracticeSessionToCloud\(session\)\.catch/);
  assert.match(js, /Practice session cloud save skipped/);
  assert.match(js, /Practice session cloud load skipped/);
});

test("student learning data is isolated per signed-in account", () => {
  assert.match(js, /function accountDataStorageKey/);
  assert.match(js, /function clearLearningStateForAccount/);
  assert.match(js, /loadSavedData\(accountDataStorageKey\(\), \{ resetLearning: true \}\)/);
  assert.match(js, /syncMistakeLogToCloud/);
  assert.match(js, /saveData\(accountDataStorageKey\(\)\)/);
});

test("today page refreshes progress when students return from a lesson", () => {
  assert.match(js, /function refreshViewData/);
  assert.match(js, /if \(viewName === "today"\) renderTodayPlan\(\)/);
  assert.match(js, /refreshViewData\(viewName\)/);
});

test("daily mission progress can recover from synced practice sessions", () => {
  assert.match(js, /const session = todayPracticeSessionSummary\(student\.id\)/);
  assert.match(js, /Math\.max\(Object\.keys\(state\.selectedAnswers\)\.length, session\.answered \|\| 0\)/);
  assert.match(js, /loadPracticeSessionsFromCloud/);
});

test("parent plan settings can sync to Supabase after login", () => {
  assert.match(js, /cloudStudents/);
  assert.match(js, /loadPlanSettingsFromCloud/);
  assert.match(js, /savePlanSettingsToCloud/);
  assert.match(js, /study_plan_settings/);
});
