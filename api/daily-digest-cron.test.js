import test from "node:test";
import assert from "node:assert/strict";
import { buildDailyDigestText } from "./daily-digest-cron.js";

test("daily digest cron text summarizes each student", () => {
  const text = buildDailyDigestText(
    [
      {
        name: "MIA",
        answered: 12,
        correct: 9,
        accuracy: 75,
        hints: 2,
        slow: 1,
        guessing: 0,
        mistakes: 2,
        weakSkills: ["Linear Equations"],
        recommendation: "Review Linear Equations first.",
      },
    ],
    new Date("2026-05-27T12:00:00Z")
  );

  assert.match(text, /Family Learning Coach Daily Digest/);
  assert.match(text, /MIA/);
  assert.match(text, /Questions: 12, Correct: 9, Accuracy: 75%/);
  assert.match(text, /Weak skills: Linear Equations/);
  assert.match(text, /Review Linear Equations first/);
});

test("daily digest cron handles a quiet day", () => {
  const text = buildDailyDigestText([], new Date("2026-05-27T12:00:00Z"));
  assert.match(text, /No student learning activity was recorded today/);
});
