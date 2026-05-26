# Question Bank Quality System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a repeatable quality system for the question bank before expanding more questions.

**Architecture:** Add source-level audit rules and tests around the existing static question banks. Keep the app lightweight; do not add a database migration for this phase.

**Tech Stack:** Static HTML, vanilla JavaScript, Node test runner.

---

### Task 1: Quality Rubric and Audit

**Files:**
- Modify: `app.js`
- Modify: `content-bank.test.mjs`
- Create: `docs/question-bank-quality.md`

- [ ] **Step 1: Write failing tests**

Require `questionQualityRubric`, `buildQuestionQualityAudit`, `qualityScore`, `coverageBySubject`, and tests for priority subjects.

- [ ] **Step 2: Verify failure**

Run: `node content-bank.test.mjs`
Expected: FAIL because the quality audit does not exist.

- [ ] **Step 3: Implement minimal audit helpers**

Add rubric and audit helpers in `app.js`, based on fields already present in each question.

- [ ] **Step 4: Document rules**

Create `docs/question-bank-quality.md` with the quality rules, expansion policy, and source policy.

- [ ] **Step 5: Verify**

Run full test suite and push.
