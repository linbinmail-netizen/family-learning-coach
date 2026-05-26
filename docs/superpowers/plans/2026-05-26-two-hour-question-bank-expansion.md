# Two-Hour Question Bank Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the question bank large and strong enough to support two hours of daily student learning without repeating shallow questions.

**Architecture:** Keep the current local bank working, but add explicit scale targets and a dashboard gap report before adding hundreds of items. Expansion should use TEKS and STAAR released item style as reference and create original questions with explanations, hints, and multi-step reasoning.

**Tech Stack:** Static HTML/CSS/JavaScript app, Supabase-backed cloud data, Node test files.

---

### Task 1: Define Two-Hour Scale Targets

**Files:**
- Modify: `app.js`
- Modify: `content-bank.test.mjs`
- Modify: `index.html`
- Modify: `styles.css`

- [x] **Step 1: Add failing test**

```js
test("question bank has a two-hour daily learning expansion target", () => {
  assert.match(source, /const twoHourLearningTargets = {/);
  assert.match(source, /dailyMinutes: 120/);
  assert.match(source, /minimumBankQuestionsPerSubject: 80/);
  assert.match(source, /minimumChallengeQuestions: 12/);
  assert.match(source, /minimumOpenResponseTasks: 10/);
  assert.match(source, /function bankScaleGap/);
  assert.match(source, /twoHourReadiness/);
  assert.match(html, /id="twoHourBankTarget"/);
});
```

- [x] **Step 2: Implement target object and scale gap calculation**

```js
const twoHourLearningTargets = {
  dailyMinutes: 120,
  targetQuestionsPerSession: 24,
  minimumBankQuestionsPerSubject: 80,
  minimumChallengeQuestions: 12,
  minimumOpenResponseTasks: 10,
  spiralReviewRatio: 25,
};
```

- [x] **Step 3: Show the two-hour target in the parent quality dashboard**

```html
<div class="two-hour-target" id="twoHourBankTarget"></div>
```

### Task 2: Expand by Priority Batches

**Files:**
- Modify: `app.js`
- Modify: `content-bank.test.mjs`

- [ ] **Step 1: Add subject batch tests**

Require each priority subject to gain at least 20 additional original questions per expansion batch.

- [ ] **Step 2: Add mixed item formats**

Each batch should include multiple choice, open explanation, data interpretation, evidence reasoning, and mistake-review variants.

- [ ] **Step 3: Run tests**

Run:

```powershell
node content-bank.test.mjs
node account-plan.test.mjs
node api/coach.test.js
node --check app.js
```

### Task 3: Move Large Content Out of app.js

**Files:**
- Create: `content/question-bank-v1.js`
- Modify: `app.js`
- Modify: `content-bank.test.mjs`

- [ ] **Step 1: Extract the large static bank**

Keep the app logic readable by moving question content into a dedicated content file.

- [ ] **Step 2: Preserve browser loading**

Load the content before `app.js` from `index.html`.

- [ ] **Step 3: Verify deployed app**

Open the Vercel URL and confirm student daily learning still works.
