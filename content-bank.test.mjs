import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const source = readFileSync(new URL("./app.js", import.meta.url), "utf8");
const html = readFileSync(new URL("./index.html", import.meta.url), "utf8");
const expandedStart = source.indexOf("const expandedQuestionBank = {");
const expandedEnd = source.indexOf("\nlet state = {", expandedStart);
const expandedSource = expandedStart === -1 || expandedEnd === -1 ? "" : source.slice(expandedStart, expandedEnd);
const challengeStart = source.indexOf("const challengeQuestionBank = {");
const challengeEnd = source.indexOf("\n};", challengeStart);
const challengeSource = challengeStart === -1 || challengeEnd === -1 ? "" : source.slice(challengeStart, challengeEnd);

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

test("expanded question bank is present", () => {
  assert.match(source, /const expandedQuestionBank = {/);
  assert.match(source, /const challengeQuestionBank = {/);
  assert.match(source, /expandedQuestions/);
  assert.match(source, /challengeQuestions/);
});

test("questions rotate answer order so correct choices are not always first", () => {
  assert.match(source, /function rotateQuestionOptions/);
  assert.match(source, /const correct = \(question\.correct - shift \+ question\.answers\.length\) % question\.answers\.length/);
  assert.match(source, /prepareQuestionSet\(selectAdaptiveQuestions\(mergeQuestions/);
});

test("priority grade 8 and grade 9 subjects have deeper coverage", () => {
  for (const subject of ["math8", "rla8", "science8", "algebraReady", "geometry", "biology"]) {
    assert.ok(countSubjectQuestions(subject) >= 5, `${subject} should have at least five added questions`);
  }
});

test("question selection adapts difficulty as students answer", () => {
  assert.match(source, /const difficultyLevels = \[/);
  assert.match(source, /function difficultyScore/);
  assert.match(source, /function adaptiveLevelForSubject/);
  assert.match(source, /function selectAdaptiveQuestions/);
  assert.match(source, /function updateAdaptiveDifficulty/);
  assert.match(source, /adaptiveStats/);
  assert.match(source, /adaptiveLevels/);
  assert.match(source, /答得很顺，下一题会提高一点难度/);
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
