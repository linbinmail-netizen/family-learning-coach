import test from "node:test";
import assert from "node:assert/strict";
import { handleLearningApi } from "./api/learning.js";

function mockResponse() {
  return {
    statusCode: 0,
    body: "",
    headers: {},
    setHeader(key, value) {
      this.headers[key] = value;
    },
    end(value) {
      this.body = value;
    },
  };
}

test("catchall API serves student daily plan route", () => {
  const response = mockResponse();
  handleLearningApi({ method: "POST", query: { action: "student-daily-plan", id: "mia" }, body: {} }, response);
  const body = JSON.parse(response.body);

  assert.equal(response.statusCode, 200);
  assert.equal(body.studentId, "mia");
  assert.ok(body.items.length > 0);
});

test("catchall API serves answer submit route", () => {
  const response = mockResponse();
  handleLearningApi({
    method: "POST",
    query: { action: "answer-submit" },
    body: {
      studentId: "mia",
      studentAnswer: "B",
      confidence: "guess",
      question: { id: "q1", subject: "Math", skill: "linear relationships", correctAnswer: "A" },
    },
  }, response);
  const body = JSON.parse(response.body);

  assert.equal(response.statusCode, 200);
  assert.equal(body.isCorrect, false);
  assert.equal(body.mistakeNotebookEntry.reviewStatus, "needs_review");
});
