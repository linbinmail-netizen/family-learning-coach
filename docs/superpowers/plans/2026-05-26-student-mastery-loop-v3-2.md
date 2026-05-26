# Student Mastery Loop v3.2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the student lesson flow require real understanding after wrong or guessed answers before the student can continue.

**Architecture:** Keep the current single-page app structure. Add a visible three-step mastery tracker, replace multiple-choice variant verification with an open explanation, and record guided mastery outcomes for parent reporting.

**Tech Stack:** Static HTML, vanilla JavaScript, CSS, Node test runner.

---

### Task 1: Lock Student Mastery Flow

**Files:**
- Modify: `index.html`
- Modify: `app.js`
- Modify: `styles.css`
- Test: `account-plan.test.mjs`

- [ ] **Step 1: Write failing tests**

Add tests that require `masteryStepList`, `variantForm`, `variantReply`, `variantFeedback`, `isVariantExplanationStrong`, `masteryOutcome`, and `guidedMasteryCount`.

- [ ] **Step 2: Verify tests fail**

Run: `node account-plan.test.mjs`
Expected: FAIL because the open explanation controls and outcome fields do not exist yet.

- [ ] **Step 3: Implement minimal app changes**

Render the three-step flow, switch variant verification to an explanation form, and store guided mastery outcomes.

- [ ] **Step 4: Verify tests pass**

Run: `node account-plan.test.mjs; node --check app.js`
Expected: PASS.

- [ ] **Step 5: Push**

Commit: `Deepen student mastery loop v3.2`
