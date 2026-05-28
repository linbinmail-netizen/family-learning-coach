import test from "node:test";
import assert from "node:assert/strict";
import { buildFallbackReply, coachingGapAnalysis, gapSentenceFrame, needsSmallerTaskAfterRepeatedStuck } from "./api/coach.js";

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

test("coach fallback teaches before asking when student cannot state the question goal", () => {
  const reply = buildFallbackReply({
    ...baseBody,
    studentReply: "不知道这问题问什么",
    explanation: "斜率表示 y 相对于 x 的变化率。",
  });
  assert.match(reply, /不是不努力|小讲解/);
  assert.match(reply, /先照这句改写/);
  assert.match(reply, /这题要我判断____/);
  assert.doesNotMatch(reply, /题目要你找哪一类信息/);
  assert.doesNotMatch(reply, /正确答案|答案是|选项\s*[A-D]/);
});

test("coach fallback names the diagnosed gap before giving a micro task", () => {
  const reply = buildFallbackReply({
    ...baseBody,
    studentReply: "知识点没吃透，人家也打不出来",
    explanation: "斜率表示 y 相对于 x 的变化率。",
  });

  assert.match(reply, /卡点判断：还没形成第一步/);
  assert.match(reply, /小讲解/);
  assert.match(reply, /现在只做一小步/);
  assert.match(reply, /这题要我判断____/);
  assert.doesNotMatch(reply, /再说题目问什么|正确答案|答案是|选项\s*[A-D]/);
});

test("coach fallback rewrites English explanations into a short student-friendly Chinese note", () => {
  const reply = buildFallbackReply({
    ...baseBody,
    subject: "English I",
    skill: "claim and evidence",
    studentReply: "我不懂这个知识点，打不出来",
    explanation: "Evidence should support a claim or central idea, so identify that idea first.",
  });

  assert.match(reply, /卡点判断/);
  assert.match(reply, /小讲解：证据要支持观点/);
  assert.match(reply, /现在只做一小步/);
  assert.ok(reply.length <= 170, `reply should stay short, got ${reply.length}`);
  assert.doesNotMatch(reply, /Evidence should support|central idea, so identify|correct answer|答案是/);
});

test("coach fallback uses subject-specific mini examples when reteaching", () => {
  const mathReply = buildFallbackReply({
    ...baseBody,
    skill: "linear slope",
    subject: "Algebra I",
    studentReply: "idk",
  });
  const readingReply = buildFallbackReply({
    ...baseBody,
    skill: "claim and evidence",
    subject: "English I",
    studentReply: "不知道",
  });
  assert.match(mathReply, /每多 1|每 1 个 x/);
  assert.match(readingReply, /作者观点|观点句|证据/);
  assert.doesNotMatch(`${mathReply} ${readingReply}`, /正确答案|答案是|选项\s*[A-D]/);
});

test("coach fallback lowers repeated stuck students to one blank instead of repeating meta questions", () => {
  const body = {
    ...baseBody,
    studentReply: "还是不知道，打不出来",
    history: [
      { role: "student", text: "不知道" },
      { role: "coach", text: "先说题目问什么。" },
      { role: "student", text: "不会" },
      { role: "coach", text: "再说第一步。" },
    ],
  };
  assert.equal(needsSmallerTaskAfterRepeatedStuck(body), true);
  const reply = buildFallbackReply(body);
  assert.match(reply, /任务再降一级/);
  assert.match(reply, /只完成一个空/);
  assert.match(reply, /我先看____/);
  assert.doesNotMatch(reply, /题目真正问你找什么吗|正确答案|答案是|选项\s*[A-D]/);
});
