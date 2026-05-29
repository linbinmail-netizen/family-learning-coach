import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const appSource = readFileSync(new URL("./app.js", import.meta.url), "utf8");
const questionBankSource = readFileSync(new URL("./content/question-bank.js", import.meta.url), "utf8");
const source = `${appSource}\n${questionBankSource}`;
const html = readFileSync(new URL("./index.html", import.meta.url), "utf8");
const expandedStart = appSource.indexOf("const expandedQuestionBank = {");
const expandedEnd = appSource.indexOf("\nlet state = {", expandedStart);
const expandedSource = expandedStart === -1 || expandedEnd === -1 ? "" : appSource.slice(expandedStart, expandedEnd);
const challengeStart = appSource.indexOf("const challengeQuestionBank = {");
const challengeEnd = appSource.indexOf("\n};", challengeStart);
const challengeSource = challengeStart === -1 || challengeEnd === -1 ? "" : appSource.slice(challengeStart, challengeEnd);
const twoHourStart = questionBankSource.indexOf("window.twoHourExpansionQuestionBank = {");
const twoHourEnd = questionBankSource.indexOf("\n};", twoHourStart);
const twoHourSource = twoHourStart === -1 || twoHourEnd === -1 ? "" : questionBankSource.slice(twoHourStart, twoHourEnd);

function countSubjectQuestions(subjectId) {
  const marker = `${subjectId}: [`;
  const start = expandedSource.indexOf(marker);
  assert.notEqual(start, -1, `${subjectId} bank should exist`);
  const end = expandedSource.indexOf("\n  ],", start);
  const block = expandedSource.slice(start, end);
  return (block.match(/prompt: /g) || []).length;
}

function countChallengeQuestions(subjectId) {
  const marker = `${subjectId}: [`;
  const start = challengeSource.indexOf(marker);
  assert.notEqual(start, -1, `${subjectId} challenge bank should exist`);
  const end = challengeSource.indexOf("\n  ],", start);
  const block = challengeSource.slice(start, end);
  return (block.match(/prompt: /g) || []).length;
}

function countTwoHourExpansionQuestions(subjectId) {
  const marker = `${subjectId}: [`;
  let position = 0;
  let count = 0;
  let found = false;
  while (true) {
    const start = questionBankSource.indexOf(marker, position);
    if (start === -1) break;
    found = true;
    const end = questionBankSource.indexOf("\n  ],", start);
    const block = questionBankSource.slice(start, end);
    count += (block.match(/prompt: /g) || []).length;
    position = end + 1;
  }
  assert.ok(found, `${subjectId} two-hour expansion bank should exist`);
  return count;
}

function runtimeTwoHourQuestionCounts() {
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(questionBankSource, context);
  return Object.fromEntries(
    Object.entries(context.window.twoHourExpansionQuestionBank || {}).map(([subjectId, questions]) => [subjectId, questions.length])
  );
}

test("expanded question bank is present", () => {
  assert.match(source, /const expandedQuestionBank = {/);
  assert.match(source, /const challengeQuestionBank = {/);
  assert.match(source, /expandedQuestions/);
  assert.match(source, /challengeQuestions/);
});

test("questions rotate answer order so correct choices are not always first", () => {
  assert.match(source, /function rotateQuestionOptions/);
  assert.match(source, /const correct = \(question\.correct - shift \+ question\.answers\.length\) % question\.answers\.length/);
  assert.match(source, /prepareQuestionSet\(depthBalanced\.slice\(0, dailyQuestionLimit\(\)\)\)/);
});

test("priority grade 8 and grade 9 subjects have deeper coverage", () => {
  for (const subject of ["math8", "rla8", "science8", "algebraReady", "geometry", "biology"]) {
    assert.ok(countSubjectQuestions(subject) >= 5, `${subject} should have at least five added questions`);
  }
});

test("question selection adapts difficulty as students answer", () => {
  assert.match(source, /const difficultyLevels = \[/);
  assert.match(source, /function difficultyScore/);
  assert.match(source, /function questionLearningDepthScore/);
  assert.match(source, /function isShallowChoiceQuestion/);
  assert.match(source, /function requiresPreAnswerThought/);
  assert.match(source, /function isPreAnswerThoughtReady/);
  assert.match(source, /function renderPreAnswerGate/);
  assert.match(source, /function adaptiveLevelForSubject/);
  assert.match(source, /function advancedQuestionRatio/);
  assert.match(source, /function depthFirstQuestionSort/);
  assert.match(source, /function questionExamDepthScore/);
  assert.match(source, /function questionTypeLabel/);
  assert.match(source, /function selectAdaptiveQuestions/);
  assert.match(source, /advancedTarget/);
  assert.match(source, /questionLearningDepthScore\(b\) - questionLearningDepthScore\(a\)/);
  assert.match(source, /questionExamDepthScore\(b\) - questionExamDepthScore\(a\)/);
  assert.match(source, /difficultyScore\(b\.difficulty\) - difficultyScore\(a\.difficulty\)/);
  assert.match(source, /question\.schoolExamDepth/);
  assert.match(source, /function updateAdaptiveDifficulty/);
  assert.match(source, /adaptiveStats/);
  assert.match(source, /adaptiveLevels/);
  assert.match(source, /答得很顺，下一题会提高一点难度/);
});

test("adaptive progression skips completed questions and can jump to challenge practice", () => {
  assert.match(source, /answeredQuestionKeys/);
  assert.match(source, /function questionStableKey/);
  assert.match(source, /function markQuestionAnswered/);
  assert.match(source, /function hasAnsweredQuestion/);
  assert.match(source, /function nextAdaptiveQuestionIndex/);
  assert.match(source, /question\.schoolExamDepth \|\| question\.constructedResponse \|\| question\.openResponse/);
  assert.match(source, /questionLearningDepthScore\(b\.question\) - questionLearningDepthScore\(a\.question\)/);
  assert.match(source, /questionExamDepthScore\(b\.question\) - questionExamDepthScore\(a\.question\)/);
  assert.match(source, /advanceToNextQuestionAfterCompletion\(state\.currentQuestion, "correct", preferredNextIndex\)/);
  assert.match(source, /系统已切到更合适的第/);
});

test("daily question set keeps a minimum mix of depth practice", () => {
  assert.match(source, /function isDepthPracticeQuestion/);
  assert.match(source, /function minimumDailyDepthQuestions/);
  assert.match(source, /function ensureDailyDepthMix/);
  assert.match(source, /questionLearningDepthScore\(question\) >= 36/);
  assert.match(source, /const currentDepth = firstBatch\.filter\(isDepthPracticeQuestion\)\.length/);
  assert.match(source, /minimumDepth - currentDepth/);
  assert.match(source, /ensureDailyDepthMix\(ensureDailySchoolExamMix\(selected\)\)/);
});

test("daily question set frontloads school exam depth", () => {
  assert.match(source, /function isSchoolExamPracticeQuestion/);
  assert.match(source, /function minimumDailySchoolExamQuestions/);
  assert.match(source, /function ensureDailySchoolExamMix/);
  assert.match(source, /function frontloadSchoolExamPractice/);
  assert.match(source, /currentSchoolDepth = firstBatch\.filter\(isSchoolExamPracticeQuestion\)\.length/);
  assert.match(source, /minimumSchoolDepth - currentSchoolDepth/);
  assert.match(source, /firstWindow\.some\(isSchoolExamPracticeQuestion\)/);
  assert.match(source, /frontloadSchoolExamPractice\(ensureDailyDepthMix\(ensureDailySchoolExamMix\(selected\)\)\)/);
});

test("adaptive sessions keep two depth checks inside the first six questions", () => {
  assert.match(source, /function ensureEarlyDepthCadence/);
  assert.match(source, /const earlyWindowSize = Math\.min\(6, limit\)/);
  assert.match(source, /const minimumEarlyDepth = plan\.difficultyMode === "challenge" \? Math\.min\(3, earlyWindowSize\) : Math\.min\(2, earlyWindowSize\)/);
  assert.match(source, /earlyBatch\.filter\(\(question\) => isSchoolExamPracticeQuestion\(question\) \|\| isExplanationFirstChallenge\(question\)\)\.length/);
  assert.match(source, /index >= earlyWindowSize && index < limit/);
  assert.match(source, /ensureEarlyDepthCadence\(ensureDepthStartQuestion\(limitEasyWarmupQuestions\(frontloadSchoolExamPractice/);
});

test("adaptive and challenge modes limit easy warmup at the start", () => {
  assert.match(source, /function limitEasyWarmupQuestions/);
  assert.match(source, /plan\.difficultyMode === "steady"/);
  assert.match(source, /firstTwoEasyCount/);
  assert.match(source, /isDepthPracticeQuestion\(question\) \|\| isSchoolExamPracticeQuestion\(question\)/);
  assert.match(source, /adjusted\.splice\(1, 0, replacement\)/);
  assert.match(source, /limitEasyWarmupQuestions\(frontloadSchoolExamPractice\(ensureDailyDepthMix\(ensureDailySchoolExamMix\(selected\)\)\)\)/);
});

test("adaptive starts with depth practice when a depth candidate exists", () => {
  assert.match(source, /function ensureDepthStartQuestion/);
  assert.match(source, /plan\.difficultyMode === "steady"/);
  assert.match(source, /questions\.slice\(0, limit\)\.findIndex\(isDepthPracticeQuestion\)/);
  assert.match(source, /adjusted\.splice\(0, 0, depthQuestion\)/);
  assert.match(source, /ensureDepthStartQuestion\(limitEasyWarmupQuestions\(frontloadSchoolExamPractice/);
});

test("challenge mode starts with school-depth or explanation practice instead of easy warmup", () => {
  assert.match(source, /const challengeMode = plan\.difficultyMode === "challenge"/);
  assert.match(source, /const foundationTarget = challengeMode \? 1 : Math\.max\(2, Math\.round\(targetQuestions \* 0\.2\)\)/);
  assert.match(source, /const reviewTarget = challengeMode \? Math\.max\(2, Math\.round\(targetQuestions \* 0\.15\)\) : Math\.max\(3, Math\.round\(targetQuestions \* 0\.25\)\)/);
  assert.match(source, /if \(plan\.difficultyMode === "challenge" && isSchoolExamPracticeQuestion\(schoolDepthQuestion\)\) adjusted\.splice\(0, 0, schoolDepthQuestion\)/);
  assert.match(source, /challenge-first school exam depth/);
});

test("two-hour sessions use block-aware question sequencing", () => {
  assert.match(source, /function isTwoHourPlan/);
  assert.match(source, /function learningBlockForQuestionIndex/);
  assert.match(source, /function selectTwoHourStructuredQuestions/);
  assert.match(source, /spiralReview/);
  assert.match(source, /constructedResponse/);
  assert.match(source, /当前环节/);
});

test("daily lesson question count is limited to the parent plan target", () => {
  assert.match(source, /function dailyQuestionLimit/);
  assert.match(source, /plan\.questionTarget/);
  assert.match(source, /\.slice\(0, dailyQuestionLimit\(\)\)/);
  assert.match(source, /questionProgress/);
});

test("question bank has a quality rubric and audit system", () => {
  assert.match(source, /const questionQualityRubric = {/);
  assert.match(source, /function qualityScore/);
  assert.match(source, /function buildQuestionQualityAudit/);
  assert.match(source, /function coverageBySubject/);
  assert.match(source, /TEKS\/STAAR alignment/);
  assert.match(source, /explanationDepth/);
  assert.match(source, /distractorQuality/);
});

test("priority subjects have balanced quality coverage", () => {
  for (const subject of ["math8", "rla8", "science8", "english1", "algebra1", "geometry", "biology"]) {
    assert.match(source, new RegExp(`${subject}: \\{[^}]*minimumQuestions: 8`, "s"));
  }
  assert.match(source, /minimumAdvancedQuestions: 1/);
});

test("parent dashboard can show question bank quality audit", () => {
  assert.match(html, /id="questionQualityAudit"/);
  assert.match(html, /id="questionQualityStats"/);
  assert.match(html, /id="questionQualitySubjects"/);
  assert.match(source, /function renderQuestionQualityAudit/);
  assert.match(source, /buildQuestionQualityAudit\(\)/);
  assert.match(source, /weakSubjects/);
  assert.match(source, /题库质量/);
});

test("priority subjects have at least two school-level challenge questions", () => {
  for (const subject of ["math8", "rla8", "science8", "english1", "algebra1", "geometry", "biology"]) {
    assert.ok(countChallengeQuestions(subject) >= 2, `${subject} should have at least two challenge questions`);
  }
  assert.match(source, /schoolExamDepth/);
  assert.match(source, /multiStepReasoning/);
});

test("challenge-priority questions require written reasoning, not just harder choices", () => {
  assert.match(source, /function isChallengeProofQuestion/);
  assert.match(source, /question\.expectedMethod/);
  assert.match(source, /question\.openResponse/);
  assert.match(source, /question\.constructedResponse/);
  assert.match(source, /isChallengeProofQuestion\(question\) && difficultyScore\(question\.difficulty\) >= 2/);
});

test("question bank has a two-hour daily learning expansion target", () => {
  assert.match(source, /const twoHourLearningTargets = {/);
  assert.match(source, /dailyMinutes: 120/);
  assert.match(source, /minimumBankQuestionsPerSubject: 80/);
  assert.match(source, /minimumChallengeQuestions: 12/);
  assert.match(source, /minimumOpenResponseTasks: 10/);
  assert.match(source, /function bankScaleGap/);
  assert.match(source, /twoHourReadiness/);
  assert.match(html, /id="twoHourBankTarget"/);
});

test("first two-hour expansion batch is included in student question selection", () => {
  assert.match(html, /src="content\/question-bank.js"/);
  assert.match(questionBankSource, /window\.twoHourExpansionQuestionBank = {/);
  assert.match(appSource, /window\.twoHourExpansionQuestionBank \|\| {}/);
  assert.match(source, /twoHourQuestions/);
  assert.match(source, /STAAR-style original batch/);
  assert.match(source, /openResponse: true/);
  for (const subject of ["math8", "rla8", "science8", "english1", "algebra1", "geometry", "biology"]) {
    assert.ok(countTwoHourExpansionQuestions(subject) >= 3, `${subject} should have at least three two-hour expansion questions`);
  }
});

test("second two-hour expansion batch deepens priority subjects", () => {
  assert.match(source, /STAAR-style original batch 2/);
  assert.match(source, /errorAnalysis: true/);
  for (const subject of ["math8", "rla8", "science8", "english1", "algebra1", "geometry", "biology"]) {
    assert.ok(countTwoHourExpansionQuestions(subject) >= 6, `${subject} should have at least six two-hour expansion questions`);
  }
});

test("third two-hour expansion batch adds constructed explanation practice", () => {
  assert.match(source, /STAAR-style original batch 3/);
  assert.match(source, /constructedResponse: true/);
  for (const subject of ["math8", "rla8", "science8", "english1", "algebra1", "geometry", "biology"]) {
    assert.ok(countTwoHourExpansionQuestions(subject) >= 9, `${subject} should have at least nine two-hour expansion questions`);
  }
});

test("fourth two-hour expansion batch adds spiral review in external bank", () => {
  assert.match(source, /STAAR-style original batch 4/);
  assert.match(source, /spiralReview: true/);
  for (const subject of ["math8", "rla8", "science8", "english1", "algebra1", "geometry", "biology"]) {
    assert.ok(countTwoHourExpansionQuestions(subject) >= 12, `${subject} should have at least twelve two-hour expansion questions`);
  }
});

test("systematic expansion brings core subjects to at least thirty structured questions", () => {
  assert.match(questionBankSource, /const systematicExpansionBlueprints = {/);
  assert.match(questionBankSource, /function buildSystematicExpansionQuestions/);
  assert.match(questionBankSource, /commonMistakes/);
  assert.match(questionBankSource, /aiHintLevel1/);
  assert.match(questionBankSource, /aiHintLevel2/);
  assert.match(questionBankSource, /aiHintLevel3/);
  assert.match(questionBankSource, /schoolExamDepth/);
  assert.match(questionBankSource, /school-level reasoning/);
  assert.match(questionBankSource, /constructedResponse: difficulty === "挑战"/);
  assert.match(questionBankSource, /systematic original expansion v1/);
  const counts = runtimeTwoHourQuestionCounts();
  for (const subject of ["math8", "rla8", "science8", "english1", "algebra1", "geometry", "biology"]) {
    assert.ok(counts[subject] >= 30, `${subject} should have at least thirty runtime expansion questions`);
  }
});

test("systematic expansion has enough volume for sustained two-hour practice", () => {
  assert.match(questionBankSource, /Array\.from\(\{ length: 40 \}/);
  const counts = runtimeTwoHourQuestionCounts();
  for (const subject of ["math8", "rla8", "science8", "english1", "algebra1", "geometry", "biology"]) {
    assert.ok(counts[subject] >= 52, `${subject} should have at least fifty-two runtime expansion questions`);
  }
});

test("systematic AI hints are scaffold-first instead of asking students to invent the question goal", () => {
  assert.match(questionBankSource, /先看小讲解/);
  assert.match(questionBankSource, /只补一个空/);
  assert.doesNotMatch(questionBankSource, /先说题目真正问什么/);
});

test("systematic coach hints do not send stuck students back to meta questions", () => {
  assert.match(questionBankSource, /先看一个老师示范句/);
  assert.match(questionBankSource, /只补第一步线索/);
  assert.doesNotMatch(questionBankSource, /What is the question asking you to identify first/);
  assert.doesNotMatch(questionBankSource, /Which clue connects directly to the skill being practiced/);
});

test("systematic expansion marks enough school-depth tasks for exam-level practice", () => {
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(questionBankSource, context);
  for (const subject of ["math8", "rla8", "science8", "english1", "algebra1", "geometry", "biology"]) {
    const questions = context.window.twoHourExpansionQuestionBank[subject] || [];
    const schoolDepthCount = questions.filter((question) => question.schoolExamDepth).length;
    const constructedCount = questions.filter((question) => question.constructedResponse).length;
    assert.ok(schoolDepthCount >= 9, `${subject} should have at least nine school-depth expansion tasks`);
    assert.ok(constructedCount >= 6, `${subject} should have at least six constructed-response expansion tasks`);
  }
});

test("core subjects have enough advanced open practice for sustained two-hour learning", () => {
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(questionBankSource, context);
  for (const subject of ["math8", "rla8", "science8", "english1", "algebra1", "geometry", "biology"]) {
    const questions = context.window.twoHourExpansionQuestionBank[subject] || [];
    const schoolDepthCount = questions.filter((question) => question.schoolExamDepth).length;
    const constructedCount = questions.filter((question) => question.constructedResponse).length;
    const errorAnalysisCount = questions.filter((question) => question.errorAnalysis).length;
    const challengeCount = questions.filter((question) => String(question.difficulty).includes("挑战")).length;
    assert.ok(questions.length >= 42, `${subject} should have at least forty-two runtime expansion questions`);
    assert.ok(schoolDepthCount >= 20, `${subject} should have at least twenty school-depth tasks`);
    assert.ok(constructedCount >= 14, `${subject} should have at least fourteen constructed-response tasks`);
    assert.ok(errorAnalysisCount >= 12, `${subject} should have at least twelve error-analysis tasks`);
    assert.ok(challengeCount >= 12, `${subject} should have at least twelve challenge-level tasks`);
  }
  assert.match(questionBankSource, /systematic original expansion v2/);
});
