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

test("student guidance scaffold prefers lesson steps over raw answer hints", () => {
  assert.match(js, /const firstHint = lesson\.steps\?\.\[0\] \|\| question\?\.coachHints\?\.\[0\]/);
});

test("student guidance reply gives immediate quality feedback while typing", () => {
  assert.match(html, /id="replyQualityCard"/);
  assert.match(html, /id="replyQualityStatus"/);
  assert.match(html, /id="qualityQuestionGoal"/);
  assert.match(html, /id="qualityMethodStep"/);
  assert.match(html, /id="qualityReasonWhy"/);
  assert.match(js, /function evaluateGuidanceReplyQuality/);
  assert.match(js, /function renderReplyQuality/);
  assert.match(js, /inlineCoachReply"\)\.addEventListener\("input"/);
  assert.match(css, /reply-quality-card/);
});

test("student guidance reply quality rejects short keyword-only replies", () => {
  assert.match(js, /const enoughDetail = compactText\.length >= 18 \|\| wordCount >= 8/);
  assert.match(js, /ready: enoughDetail && hasQuestionGoal && hasMethodStep && hasReasonWhy/);
  assert.doesNotMatch(js, /const hasMethodStep = .*because/);
  assert.match(js, /解释要更完整/);
});

test("student cannot submit inline guidance until restatement is complete", () => {
  assert.match(html, /id="inlineCoachSubmit"/);
  assert.match(js, /\$\("inlineCoachSubmit"\)\.disabled = !quality\.ready/);
  assert.match(js, /const quality = evaluateGuidanceReplyQuality\(reply\)/);
  assert.match(js, /if \(!quality\.ready\)/);
  assert.match(js, /先把复述补完整/);
});

test("student guidance coach gives teaching feedback before variant verification", () => {
  assert.match(js, /function buildGuidedTeachingMove/);
  assert.match(js, /概念提醒/);
  assert.match(js, /小例子/);
  assert.match(js, /下一问/);
  assert.match(js, /buildGuidedTeachingMove\(reply/);
  assert.match(js, /state\.guidanceLock\.teachingTurns/);
  assert.doesNotMatch(js, /正确答案是/);
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
  assert.match(html, /id="signupForm"/);
  assert.match(html, /id="signupEmail"/);
  assert.match(html, /id="signupPassword"/);
  assert.match(html, /id="signupRole"/);
  assert.match(html, /id="signupStudent"/);
  assert.doesNotMatch(html, /id="authRole"/);
  assert.doesNotMatch(html, /id="authStudentName"/);
  assert.match(html, /id="signInButton"/);
  assert.match(html, /id="signUpButton"/);
  assert.match(html, /id="signOutButton"/);
  assert.match(html, /@supabase\/supabase-js@2/);
});

test("login form does not ask for account type", () => {
  const loginForm = html.match(/<form id="authForm"[\s\S]*?<\/form>/)?.[0] || "";
  const signupForm = html.match(/<form id="signupForm"[\s\S]*?<\/form>/)?.[0] || "";
  assert.doesNotMatch(loginForm, /signupRole/);
  assert.doesNotMatch(loginForm, /signupStudent/);
  assert.match(signupForm, /signupRole/);
  assert.match(signupForm, /signupStudent/);
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
  assert.match(html, /id="inlineCoachPanel"/);
  assert.match(html, /id="inlineCoachForm"/);
  assert.match(html, /id="masteryStepList"/);
  assert.match(html, /id="variantForm"/);
  assert.match(html, /id="variantReply"/);
  assert.match(html, /id="variantFeedback"/);
  assert.match(js, /answerConfidence/);
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
  assert.match(js, /variantReply"\)\.addEventListener\("input", \(\) => renderVariantRubricFeedback\(\)\)/);
  assert.match(js, /rubric-\$\{item\.ready \? "met" : "missing"\}/);
  assert.match(css, /rubric-met/);
  assert.match(css, /rubric-missing/);
});

test("student cannot submit variant explanation until rubric is complete", () => {
  assert.match(html, /id="variantSubmit"/);
  assert.match(js, /function isVariantRubricReady/);
  assert.match(js, /\$\("variantSubmit"\)\.disabled = !ready/);
  assert.match(js, /if \(!isVariantRubricReady\(reply/);
  assert.match(js, /先补完整各项变式说明/);
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
  assert.match(js, /postCoachPayload/);
  assert.match(js, /AbortController/);
  assert.match(js, /本地引导/);
  assert.match(js, /AI 较慢/);
});

test("student coach uses recent same-skill mistakes", () => {
  assert.match(js, /recentSkillMistakes/);
  assert.match(js, /mistakesForCurrentSkill/);
  assert.match(js, /sameSkillMistakeSummary/);
});

test("mistake review opens a targeted review lesson", () => {
  assert.match(js, /openMistakeReviewLesson/);
  assert.match(js, /data-review-mistake/);
  assert.match(js, /复习这题/);
  assert.match(js, /错题复习课/);
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
  assert.match(html, /id="finishTodayButton"/);
  assert.match(js, /function renderStudentWrapup/);
  assert.match(js, /家长端可以看到今天表现/);
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

test("parent plan settings can sync to Supabase after login", () => {
  assert.match(js, /cloudStudents/);
  assert.match(js, /loadPlanSettingsFromCloud/);
  assert.match(js, /savePlanSettingsToCloud/);
  assert.match(js, /study_plan_settings/);
});
