import test from "node:test";
import assert from "node:assert/strict";
import { buildFallbackReply, coachingGapAnalysis, gapSentenceFrame } from "./api/coach.js";

const baseBody = {
  skill: "斜率与变化率",
  studentReply: "",
  coachHints: ["先比较 x 的变化和 y 的变化", "再判断单位变化量"],
  commonMistakes: ["不要只看 y 的数字大小，要比较变化率。"],
  history: [],
};

test("coach fallback gives a gap-specific one-sentence frame", () => {
  const gap = coachingGapAnalysis("我第一步先看线索，因为这样有用");
  assert.equal(gap.gap, "goal");
  const frame = gapSentenceFrame(gap, baseBody);
  assert.match(frame, /这题要我判断 斜率与变化率/);
  assert.doesNotMatch(frame, /正确答案|答案是|选项\s*[A-D]/);
});

test("coach fallback moves answer-only replies into method writing", () => {
  const reply = buildFallbackReply({ ...baseBody, studentReply: "A" });
  assert.match(reply, /只写了答案|第一步/);
  assert.match(reply, /只补这一句/);
  assert.match(reply, /我第一步先看____/);
  assert.doesNotMatch(reply, /正确答案|答案是|选项\s*[A-D]/);
});

test("coach fallback gives a smaller reason task after repeated thin replies", () => {
  const reply = buildFallbackReply({
    ...baseBody,
    studentReply: "我觉得这样",
    history: [{ role: "coach", text: "理由还不够，用这句补完整。" }],
  });
  assert.match(reply, /换一种更小的任务/);
  assert.match(reply, /因为这一步能帮我____/);
  assert.doesNotMatch(reply, /正确答案|答案是|选项\s*[A-D]/);
});
