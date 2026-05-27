# Learning System Completion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the current Family Learning Coach from a tutoring demo into a daily learning loop: Dashboard -> Daily Mission -> Practice -> AI Guidance -> Mistake Notebook -> Skill Mastery -> Parent Report.

**Architecture:** Keep the existing single-page vanilla HTML/CSS/JS app, Supabase auth, Vercel API endpoint, and current question bank. Add focused student/parent views and local derived data instead of a risky route/framework rewrite.

**Tech Stack:** HTML, CSS, vanilla JavaScript modules, existing Supabase REST helpers, existing Vercel serverless AI endpoint, Node test files.

---

### Task 1: Student Dashboard and Mission Control

**Files:**
- Modify: `index.html`
- Modify: `app.js`
- Modify: `styles.css`
- Test: `account-plan.test.mjs`

- [ ] Add dashboard cards for daily mission, mastery, streak, XP, weak skills, and next action.
- [ ] Render the cards from current student, plan, selected answers, mistakes, and skill mastery.
- [ ] Add tests that verify the dashboard is not a simple chat entry and includes mission/path/progress controls.

### Task 2: Learning Path View

**Files:**
- Modify: `index.html`
- Modify: `app.js`
- Modify: `styles.css`
- Test: `account-plan.test.mjs`

- [ ] Add `Learning Path` tab and view.
- [ ] Define skill modules for Math, Reading, Writing, Vocabulary, and SAT/PSAT Foundation.
- [ ] Show at least six modules per core subject with status and mastery percentage.
- [ ] Let clicking a module switch to practice for that subject/skill.

### Task 3: Mistake Notebook View

**Files:**
- Modify: `index.html`
- Modify: `app.js`
- Modify: `styles.css`
- Test: `account-plan.test.mjs`

- [ ] Add `Mistake Notebook` tab and view.
- [ ] Add filters for subject, skill, and mistake type.
- [ ] Show review date, explanation, and a one-click practice action.
- [ ] Keep every wrong answer flowing into the existing mistake log.

### Task 4: Practice Flow and Adaptive Status Polish

**Files:**
- Modify: `app.js`
- Modify: `index.html`
- Modify: `styles.css`
- Test: `account-plan.test.mjs`, `content-bank.test.mjs`

- [ ] Rename/reshape the existing Today Lesson as Practice where helpful.
- [ ] Show current subject, skill, difficulty, progress, and hint/explain/similar actions around the current question.
- [ ] Preserve the existing independent-first answer rule and wrong-answer guidance lock.

### Task 5: Parent Dashboard Upgrade

**Files:**
- Modify: `index.html`
- Modify: `app.js`
- Modify: `styles.css`
- Test: `account-plan.test.mjs`

- [ ] Add parent summary cards for time, completed tasks, mistakes, weak skills, and recommendation.
- [ ] Keep parent controls separate from student view.

### Task 6: Verification and Deployment

**Files:**
- Modify: `PROJECT_CONTEXT.md`

- [ ] Run all tests and syntax checks.
- [ ] Verify local preview files contain the new student system views.
- [ ] Commit, push to GitHub, wait for Vercel READY, verify live URL.
