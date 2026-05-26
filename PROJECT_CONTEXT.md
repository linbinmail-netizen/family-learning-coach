# Family Learning Coach - Project Context

Last updated: 2026-05-26

## Current Live App

- Live site: https://family-learning-coach.vercel.app/
- GitHub repo: https://github.com/linbinmail-netizen/family-learning-coach
- Latest deployed version checked: `979dc0c`
- Local sync folder: `C:\Users\oscar\OneDrive\Documents\高中学习\family-learning-coach-github-sync`

## Students

- MIA: entering 9th grade
- EVA: entering 8th grade

## Product Goal

Build a long-term custom web learning platform for the family. Students should receive daily learning tasks, answer grade-level questions, get AI-guided coaching when they are stuck, and generate reports that parents can use to adjust study time and plans.

## Current Version: Student QA Baseline

The student side is now the priority. Current behavior:

- Login and registration are separate from the learning app.
- Account type is chosen during registration, not during login.
- Parent and student accounts see different content.
- Learning progress is scoped to the signed-in account to avoid one student/account polluting another account's local learning state.
- Signing out clears login and registration form fields.
- Students see daily tasks and today's learning lesson.
- Today's progress refreshes when a student returns from a lesson.
- Students first answer independently; hints, worked thinking, and guided teaching appear after a wrong or uncertain answer.
- Questions adapt difficulty based on performance.
- If a student answers wrong or marks an answer as guessed/uncertain, the current question is locked.
- After a wrong or uncertain answer, the guidance panel starts with a structured mistake insight card: issue type, skill gap, and next repair action.
- The guidance panel now includes a three-part method restatement scaffold: what the question asks, what to inspect first, and why that step helps. The scaffold prefers Chinese lesson steps over raw English answer hints.
- While the student types a restatement, the app now gives immediate local quality feedback for three parts: question goal, method step, and reason why. Short keyword-only replies are rejected with a request for more complete explanation.
- The inline AI guidance submit button stays disabled until the restatement is complete enough; direct submit attempts are also blocked with a clear reminder.
- After a complete restatement, the coach now gives one guided teaching move before variant verification: concept reminder, small example, and next question.
- The locked question requires a mastery loop: teach, restate, variant explanation.
- Variant verification is open-ended, not multiple choice, to reduce guessing.
- Variant verification now includes a structured method checklist: mission, three method steps, and self-check reminder.
- The student must write a clear method explanation before moving to the next question.
- Chinese, English, and mixed Chinese-English method explanations can pass when the reasoning is mathematically/conceptually equivalent.
- If OpenAI is too strict but the local mastery check clearly passes, the local passing result can override the AI rejection.
- Parent reports include guided mastery count and mistake-review data.
- AI coach now receives recent mistakes from the same skill so hints can reflect repeated patterns.
- Mistake review cards can open a targeted review lesson for the same skill.
- The daily plan shows the next action and a clear completion state.
- Student-side fast fallback prevents slow AI responses from blocking learning.

## Important Files

- `index.html`: page structure and login/student/parent views
- `app.js`: main app logic, student flow, parent reports, Supabase sync
- `styles.css`: UI styling
- `api/coach.js`: AI coaching API endpoint
- `account-plan.test.mjs`: main behavior tests for auth, student flow, parent flow
- `content-bank.test.mjs`: question bank and adaptive difficulty tests
- `api/coach.test.js`: AI coach prompt and fallback tests
- `supabase/*.sql`: database/auth/mistake review setup scripts

## Verification Command

Run from the local sync folder:

```powershell
node account-plan.test.mjs; node content-bank.test.mjs; node api/coach.test.js; node auth-helper-schema.test.mjs; node auth-plan-schema.test.mjs; node cloud-mistakes-schema.test.mjs; node --check app.js
```

Latest fuller local verification command:

```powershell
node account-plan.test.mjs; node content-bank.test.mjs; node api/coach.test.js; node auth-helper-schema.test.mjs; node auth-plan-schema.test.mjs; node cloud-mistakes-schema.test.mjs; node --check app.js; node --check content/question-bank.js; node --check api/coach.js
```

Latest result: 80 tests passed, syntax checks passed, and live Vercel deployment `979dc0c` opened correctly with no browser console warnings/errors.

## Next Recommended Work

Continue deepening the student side:

1. Improve the actual lesson content quality for 8th and 9th grade.
2. Add richer open-ended answer evaluation with rubrics per skill, beyond simple keyword checks.
3. Make the AI coach faster and more consistent with streaming or precomputed local prompts.
4. Improve the student lesson UI so each session feels like a guided class.
5. Later, improve parent weekly reports and email delivery.

## Student Finalization Completed

Student-side v4.1 is the current usable baseline:

- v3.7: AI guidance uses recent same-skill mistakes.
- v3.8: mistake review opens a targeted review lesson.
- v3.9: daily plan shows next action and completion status.
- v4.0: wrong/uncertain answers show a three-part restatement scaffold before the student continues.
- v4.1: the restatement input gives immediate quality feedback while the student types.
- v4.2: reply-quality feedback now requires enough detail, so short keyword-only replies do not pass.
- v4.3: the AI guidance submit button is locked until the restatement quality gate is ready, preventing empty or incomplete replies from being sent.
- v4.4: after a valid restatement, the coach provides concept reminder, small example, and next question before moving to variant verification.
- v4.5: variant verification now shows a mission, three-step method checklist, and self-check prompt before the student writes the open explanation.
- QA baseline: account-scoped local progress, independent-first answering, refreshed daily progress, structured mistake insight card, restatement scaffold, live reply-quality feedback with detail gate, locked guidance submit, guided teaching move, structured variant verification, and less-strict Chinese/mixed-language mastery checks.

## Operating Notes

- Prefer direct Git push from the local sync folder instead of GitHub manual upload.
- Keep changes small and test after each step.
- Do not put parent controls inside the student view.
- Do not ask account type during login; role comes from the registered profile.
- Do not let wrong answers advance without guided mastery.
- Do not show solution guidance before the student's first attempt.
- Do not rely only on multiple choice; require open explanation after wrong/uncertain answers.
