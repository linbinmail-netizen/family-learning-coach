import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const html = readFileSync(new URL("./index.html", import.meta.url), "utf8");
const js = readFileSync(new URL("./app.js", import.meta.url), "utf8");

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

test("supabase auth sign in controls exist", () => {
  assert.match(html, /id="loginView"/);
  assert.match(html, /id="appShell"/);
  assert.match(html, /id="authForm"/);
  assert.match(html, /id="authEmail"/);
  assert.match(html, /id="authPassword"/);
  assert.doesNotMatch(html, /id="authRole"/);
  assert.doesNotMatch(html, /id="authStudentName"/);
  assert.match(html, /id="signInButton"/);
  assert.match(html, /id="signUpButton"/);
  assert.match(html, /id="signOutButton"/);
  assert.match(html, /@supabase\/supabase-js@2/);
});

test("login is separated from the learning app", () => {
  assert.match(js, /renderAuthGate/);
  assert.match(js, /loginView/);
  assert.match(js, /appShell/);
  assert.match(js, /inferSignupProfile/);
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

test("parent plan settings can sync to Supabase after login", () => {
  assert.match(js, /cloudStudents/);
  assert.match(js, /loadPlanSettingsFromCloud/);
  assert.match(js, /savePlanSettingsToCloud/);
  assert.match(js, /study_plan_settings/);
});
