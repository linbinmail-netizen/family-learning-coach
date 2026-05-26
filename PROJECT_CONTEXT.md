# Family Learning Coach - Project Context

Last updated: 2026-05-26

## Current Live App

- Live site: https://family-learning-coach.vercel.app/
- GitHub repo: https://github.com/linbinmail-netizen/family-learning-coach
- Latest deployed version checked: `c0f0435`
- Local sync folder: `C:\Users\oscar\OneDrive\Documents\高中学习\family-learning-coach-github-sync`

## Students

- MIA: entering 9th grade
- EVA: entering 8th grade

## Product Goal

Build a long-term custom web learning platform for the family. Students should receive daily learning tasks, answer grade-level questions, get AI-guided coaching when they are stuck, and generate reports that parents can use to adjust study time and plans.

## Current Version: Student v3.9

The student side is now the priority. Current behavior:

- Login and registration are separate from the learning app.
- Account type is chosen during registration, not during login.
- Parent and student accounts see different content.
- Students see daily tasks and today's learning lesson.
- Questions adapt difficulty based on performance.
- If a student answers wrong or marks an answer as guessed/uncertain, the current question is locked.
- The locked question requires a mastery loop: teach, restate, variant explanation.
- Variant verification is open-ended, not multiple choice, to reduce guessing.
- The student must write a clear method explanation before moving to the next question.
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

Latest result: all tests passed before v3.2 push.

## Next Recommended Work

Continue deepening the student side:

1. Improve the actual lesson content quality for 8th and 9th grade.
2. Add richer open-ended answer evaluation instead of only simple keyword checks.
3. Make the AI coach remember the student's last few mistakes in the same skill.
4. Improve the student lesson UI so each session feels like a guided class.
5. Later, improve parent weekly reports and email delivery.

## Student Finalization Completed

Student-side v3.9 is the current usable baseline:

- v3.7: AI guidance uses recent same-skill mistakes.
- v3.8: mistake review opens a targeted review lesson.
- v3.9: daily plan shows next action and completion status.

## Operating Notes

- Prefer direct Git push from the local sync folder instead of GitHub manual upload.
- Keep changes small and test after each step.
- Do not put parent controls inside the student view.
- Do not ask account type during login; role comes from the registered profile.
- Do not let wrong answers advance without guided mastery.
