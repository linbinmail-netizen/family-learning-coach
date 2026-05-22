import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const source = readFileSync(new URL("./app.js", import.meta.url), "utf8");
const expandedStart = source.indexOf("const expandedQuestionBank = {");
const expandedEnd = source.indexOf("\nlet state = {", expandedStart);
const expandedSource = expandedStart === -1 || expandedEnd === -1 ? "" : source.slice(expandedStart, expandedEnd);

function countSubjectQuestions(subjectId) {
  const marker = `${subjectId}: [`;
  const start = expandedSource.indexOf(marker);
  assert.notEqual(start, -1, `${subjectId} bank should exist`);
  const end = expandedSource.indexOf("\n  ],", start);
  const block = expandedSource.slice(start, end);
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
