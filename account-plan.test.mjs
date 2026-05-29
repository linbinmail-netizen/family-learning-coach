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
  assert.match(js, /state\.lastAdvanceNotice = "你觉得太简单，系统已切到更高难度的解释型或挑战题。"/);
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
  assert.match(css, /difficulty-coach-card/);
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
  assert.match(js, /完成约 \$\{foundationTarget\} 道基础和中等题/);
  assert.match(js, /完成约 \$\{challengeTarget\} 道挑战题或解释题/);
});

test("default two-hour plans reduce easy practice and favor school-depth work", () => {
  assert.match(js, /const foundationTarget = plan\.difficultyMode === "adaptive"\s*\? Math\.max\(3, Math\.round\(targetQuestions \* 0\.25\)\)/);
  assert.match(js, /const challengeTarget = Math\.max\(6, targetQuestions - foundationTarget - reviewTarget\)/);
  assert.match(js, /基础题只保留热身，不占用主要时间/);
  assert.match(js, /学校考试深度题和解释题占主要比例/);
  assert.match(js, /if \(plan\.difficultyMode === "adaptive"\) return Math\.min\(limit, Math\.max\(4, Math\.round\(limit \* 0\.42\)\)\)/);
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
  assert.match(js, /用自己的话复述方法/);
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
  assert.match(js, /题目问什么/);
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
  assert.match(js, /card\.classList\.toggle\("hidden", quality\.ready\)/);
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
  assert.match(js, /state\.guidanceLock\?\.microChoiceReady && quality\.ready/);
  assert.match(js, /已帮你写好一个小步骤，可以直接提交给教练检查。/);
  assert.match(js, /\$\("inlineCoachSubmit"\)\.focus\(\)/);
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

test("student stuck replies can submit for rescue instead of staying blocked", () => {
  const submitHandler = js.match(/\$\("inlineCoachForm"\)\.addEventListener\("submit",[\s\S]*?\$\("inlineCoachReply"\)\.addEventListener/)?.[0] || "";
  const stuckBranch = submitHandler.match(/if \(quality\.asksForHelp\) \{[\s\S]*?return;\n    \}/)?.[0] || "";
  assert.match(js, /const canAskForHelp = quality\.asksForHelp \|\| Boolean\(String\(reply \|\| ""\)\.trim\(\)\)/);
  assert.match(js, /\$\("inlineCoachSubmit"\)\.disabled = !quality\.ready && !canAskForHelp/);
  assert.match(js, /\$\("inlineCoachSubmit"\)\.textContent = guidanceSubmitButtonText\(quality, state\.guidanceLock\)/);
  assert.match(js, /if \(quality\.asksForHelp\) return "帮我开头"/);
  assert.match(js, /if \(quality\.ready\) return "提交给教练"/);
  assert.match(js, /return "让教练帮我补"/);
  assert.match(js, /if \(quality\.asksForHelp\)/);
  assert.match(js, /function rescueIncompleteGuidanceReply/);
  assert.match(js, /function buildConceptBridgeMove/);
  assert.match(submitHandler, /rescueIncompleteGuidanceReply\(reply, input\)/);
  assert.match(js, /state\.guidanceLock\.microDrill = guidanceMicroDrillForLock\(state\.guidanceLock\)/);
  assert.match(js, /state\.guidanceLock\.replyDraft = teachFirstLadderDraft\(reply, state\.guidanceLock\)/);
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
  assert.match(js, /我先帮你写好第一小句/);
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

test("cannot-produce replies auto-fill a teacher model instead of asking for more typing", () => {
  assert.match(js, /guidanceCannotProduceThought\(reply\)/);
  assert.match(js, /state\.guidanceLock\.replyDraft = guidanceTeacherModelForLock\(state\.guidanceLock\)/);
  assert.match(js, /state\.guidanceLock\.microChoiceReady = true/);
  assert.match(js, /先把老师示范句读一遍/);
  assert.match(js, /不用再写完整解释/);
  assert.match(js, /lock\?\.microChoiceReady/);
  assert.match(js, /提交示范句检查/);
  assert.match(js, /直接点“提交示范句检查”/);
  assert.doesNotMatch(js, /guidanceCannotProduceThought\(reply\)[\s\S]*正确答案是/);
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

test("repeated stuck guidance switches explanation style instead of repeating fill-in", () => {
  assert.match(js, /function repeatedStuckAlternativeExplanation/);
  assert.match(js, /换一种讲法/);
  assert.match(js, /类比/);
  assert.match(js, /错因对比/);
  assert.match(js, /只选一个动作/);
  assert.match(js, /repeatedStuckAlternativeExplanation\(lock, question, skill\)/);
  assert.doesNotMatch(js, /repeatedStuckAlternativeExplanation[\s\S]*正确答案是/);
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
  assert.match(js, /ready: enoughDetail && hasQuestionGoal && hasMethodStep && hasReasonWhy && !asksForHelp && !hasPlaceholder/);
});

test("student cannot pass mastery until restatement is complete", () => {
  assert.match(html, /id="inlineCoachSubmit"/);
  assert.match(js, /\$\("inlineCoachSubmit"\)\.disabled = !quality\.ready && !canAskForHelp/);
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
  assert.match(js, /先确认你真的看懂了老师示范句/);
  assert.match(js, /请把这句里的“第一步”换成自己的话/);
  assert.match(submitHandler, /if \(state\.guidanceLock\?\.microChoiceReady && !state\.guidanceLock\?\.teacherModelConfirmed\) \{/);
  assert.match(submitHandler, /confirmTeacherModelUnderstanding\(reply, input\)/);
  assert.doesNotMatch(submitHandler, /microChoiceReady[\s\S]{0,240}transitionGuidanceToVariantImmediately/);
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
  assert.match(js, /先写一句自己的解题思路/);
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
  assert.match(js, /先写一句自己的解题思路，再选择答案/);
  assert.match(css, /pre-answer-card/);
  assert.match(css, /locked-choice/);
});

test("challenge pre-answer requires goal and method before choices unlock", () => {
  assert.match(js, /function preAnswerThoughtQuality/);
  assert.match(js, /const hasGoal =/);
  assert.match(js, /const hasMethod =/);
  assert.match(js, /const hasReason =/);
  assert.match(js, /function isChallengePreAnswerQuestion/);
  assert.match(js, /if \(isChallengePreAnswerQuestion\(question\)\) return quality\.hasGoal && quality\.hasMethod/);
  assert.match(js, /if \(isSchoolExamPracticeQuestion\(question\)\) return quality\.hasGoal && quality\.hasMethod && quality\.hasReason/);
  assert.match(js, /isPreAnswerThoughtReady\(preAnswerThought, question\)/);
  assert.match(js, /写清题目目标和第一步/);
});

test("challenge pre-answer gives a live writing checklist before answer choices unlock", () => {
  assert.match(html, /id="preAnswerChecklist"/);
  assert.match(html, /id="preAnswerGoalCheck"/);
  assert.match(html, /id="preAnswerMethodCheck"/);
  assert.match(html, /id="preAnswerReasonCheck"/);
  assert.match(js, /function renderPreAnswerChecklist/);
  assert.match(js, /preAnswerThoughtQuality\(thought\)/);
  assert.match(js, /preAnswerGoalCheck/);
  assert.match(js, /preAnswerMethodCheck/);
  assert.match(js, /preAnswerReasonCheck/);
  assert.match(js, /renderPreAnswerChecklist\(thought, question\)/);
  assert.match(css, /pre-answer-checklist/);
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

test("high-performing students are routed to explanation-first challenge questions", () => {
  assert.match(js, /function isExplanationFirstChallenge/);
  assert.match(js, /const highPerformance = adaptiveResult\.isCorrect && \(adaptiveResult\.fastCorrect \|\| adaptiveResult\.obviousEasyCorrect \|\| adaptiveResult\.raisedLevel \|\| adaptiveResult\.challengeMode \|\| targetLevel >= 2\)/);
  assert.match(js, /const explanationChallengeCandidate = unanswered/);
  assert.match(js, /isExplanationFirstChallenge\(question\)/);
  assert.match(js, /if \(highPerformance && explanationChallengeCandidate\) return explanationChallengeCandidate\.index/);
  assert.match(js, /fastCorrect: isCorrect && secondsOnCurrentQuestion\(\) <= 20/);
  assert.match(js, /const raisedLevel = nextStats\.correctStreak >= 2 && level < difficultyLevels\.length - 1/);
  assert.match(js, /return \{ isCorrect, level, message, fastCorrect: isCorrect && secondsOnCurrentQuestion\(\) <= 20, obviousEasyCorrect, raisedLevel, challengeMode \}/);
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
  assert.match(js, /adaptiveResult\.obviousEasyCorrect/);
  assert.match(js, /highPerformance = adaptiveResult\.isCorrect && \(adaptiveResult\.fastCorrect \|\| adaptiveResult\.obviousEasyCorrect/);
  assert.match(js, /这题太轻松/);
  assert.match(js, /下一题直接切到解释型或学校考试深度题/);
});

test("easy streaks create a visible challenge mission queue", () => {
  assert.match(html, /id="challengeMissionQueue"/);
  assert.match(html, /id="challengeMissionList"/);
  assert.match(html, /挑战任务/);
  assert.match(js, /function buildChallengeMissionQueue/);
  assert.match(js, /function renderChallengeMissionQueue/);
  assert.match(js, /state\.adaptiveStats\[subjectId\]\.challengeQueue = buildChallengeMissionQueue\(question, nextStats\)/);
  assert.match(js, /解释型题/);
  assert.match(js, /学校考试深度题/);
  assert.match(js, /同技能变式题/);
  assert.match(js, /renderChallengeMissionQueue\(question\)/);
  assert.match(css, /challenge-mission-queue/);
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
  assert.match(js, /variantFeedback"\)\.textContent = variantNextActionText/);
});

test("variant waiting feedback gives a concrete self-check while AI grades", () => {
  const variantHandler = js.match(/\$\("variantForm"\)\.addEventListener\("submit",[\s\S]*?\n  \}\);/)?.[0] || "";
  assert.match(js, /function setVariantWaitingFeedback/);
  assert.match(js, /AI 正在批改变式解释/);
  assert.match(js, /先自查四项/);
  assert.match(js, /题目类型、第一步、原因、具体内容/);
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

test("student cannot submit variant explanation until rubric is complete", () => {
  assert.match(html, /id="variantSubmit"/);
  assert.match(js, /function isVariantRubricReady/);
  assert.match(js, /\$\("variantSubmit"\)\.disabled = !ready/);
  assert.match(js, /if \(!isVariantRubricReady\(reply/);
  assert.match(js, /先补完整各项变式说明/);
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

test("local student coach handles answer letters and stuck replies directly", () => {
  assert.match(js, /function buildLocalCoachReply/);
  assert.match(js, /function coachingGapForReply/);
  assert.match(js, /function localGapSentenceFrame/);
  assert.match(js, /function localOneStepCoachPrompt/);
  assert.match(js, /function coachHistoryAlreadyUsed/);
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
