# Family Learning Coach - Project Context

Last updated: 2026-05-26

## Current Live App

- Live site: https://family-learning-coach.vercel.app/
- GitHub repo: https://github.com/linbinmail-netizen/family-learning-coach
- Latest deployed version checked: Vercel production after latest `main` push
- Local sync folder: `C:\Users\oscar\OneDrive\Documents\高中学习\family-learning-coach-github-sync`

## Students

- MIA: entering 9th grade
- EVA: entering 8th grade

## Product Goal

Build a long-term custom web learning platform for the family. Students should receive daily learning tasks, answer grade-level questions, get AI-guided coaching when they are stuck, and generate reports that parents can use to adjust study time and plans.

## Current Version: Student QA Baseline

The student side is now the priority. Current behavior:

- A Codex execution plan for the requirements document is saved at `docs/superpowers/plans/2026-05-27-learning-system-completion.md`.
- Student home is now a dashboard/mission-control page, with today's mission, current level, streak, XP, weak-skill count, progress, next training, and direct continue-learning action.
- Daily mission tasks now show explicit Pending, In Progress, Completed, and Skipped states so students can tell what is active without guessing.
- Student navigation now includes dedicated Learning Path, Practice, Mistake Notebook, Mastery Report, and AI Coach areas.
- Learning Path shows Math, Reading, Writing, Vocabulary, and SAT/PSAT Foundation subject groups, each with module cards, mastery percentage, and status such as Not Started, Learning, Needs Review, or Mastered.
- Skill mastery tracking now updates from correct answers, wrong answers, guided mastery, and reviewed mistakes; Learning Path, knowledge cards, dashboard level, and parent recommendations can use this tracked mastery instead of only static diagnostic seed scores.
- The external structured practice bank now adds systematic original expansion questions, bringing each priority core subject to at least 30 runtime expansion questions with explanations, common mistakes, and three AI hint levels.
- Practice now shows current subject, skill, difficulty, task progress, and hint/explain/similar-question actions around the current question.
- Mistake Notebook now has its own page with subject, skill, and mistake-type filters, review date, AI review focus, and a one-click practice action.
- Parent Dashboard now includes summary cards for today's study time, completed tasks, mistake count, and the recommended next step before the detailed plan/report controls.
- Login and registration are separate from the learning app.
- The signed-out home page is intentionally minimal: username/email, password, login, and a register entry only.
- Registration details appear only after clicking Register, where the user chooses parent/student account type and, for students, MIA or EVA.
- Account type is chosen during registration, not during login.
- Parent and student accounts see different content.
- The family learning illustration now appears as a subtle title-area background on the login card and app sidebar; it no longer takes a separate workspace slot or changes the original page layout.
- Learning progress is scoped to the signed-in account to avoid one student/account polluting another account's local learning state.
- Signing out clears login and registration form fields.
- Students see daily tasks and today's learning lesson.
- Today's progress refreshes when a student returns from a lesson.
- Students first answer independently; hints, worked thinking, and guided teaching appear after a wrong or uncertain answer.
- Questions adapt difficulty based on performance.
- If a student answers wrong or marks an answer as guessed/uncertain, the current question is locked.
- After a wrong or uncertain answer, the guidance panel starts with a structured mistake insight card: issue type, skill gap, and next repair action.
- The AI guidance panel now shows a single current task card above the details, so the student always knows the exact next action for the current stage.
- The AI guidance panel now also shows next-question unlock conditions, marking lecture, restatement, and variant verification as waiting, active, or done.
- The guidance panel now includes a three-part method restatement scaffold: what the question asks, what to inspect first, and why that step helps. The scaffold prefers Chinese lesson steps over raw English answer hints.
- While the student types a restatement, the app now gives immediate local quality feedback for three parts: question goal, method step, and reason why. Short keyword-only replies are rejected with a request for more complete explanation.
- The wrong-answer restatement input now changes its placeholder by skill, giving examples for slope, text evidence, equations, experiments, biology, and general reasoning without revealing the answer.
- If a student types that they do not know what to write, the guidance submit button changes to a rescue action instead of staying blocked; the app reteaches the skill and inserts a safe starter sentence.
- The inline AI guidance submit button stays disabled until the restatement is complete enough; direct submit attempts are also blocked with a clear reminder.
- If a student is stuck during the restatement, the helper now offers a teacher model sentence that explains the method without revealing the answer; using it enables the student to continue into variant verification.
- After a complete restatement, the coach now gives one guided teaching move and immediately opens variant verification, so students do not get stuck in repeated AI back-and-forth.
- The locked question requires a mastery loop: teach, restate, variant explanation.
- Variant verification is open-ended, not multiple choice, to reduce guessing.
- Variant verification now includes a structured method checklist: mission, three method steps, and self-check reminder.
- Variant submission now returns teacher-style rubric feedback across three parts: topic/type, first step, and reason explanation.
- Variant rubric feedback now updates live while the student types, using visible "done / needs work" chips.
- Variant submit is now disabled until all three rubric checks are ready; incomplete direct submit attempts show a clear reminder.
- Variant explanation now includes non-answer sentence starter chips so students can begin a method explanation without receiving the solution.
- Variant verification now has a "next missing sentence" helper: when students are stuck, it inserts only the next sentence starter and keeps submit locked until they add concrete content.
- Variant verification now also has a "change explanation" exit: if the student still does not understand, the app returns to coaching with a simpler same-skill reteach message instead of keeping the child stuck in the open response box.
- Sentence starters alone do not complete mastery; the rubric also requires student-added concrete content after the starter text.
- Variant verification no longer reveals the expected method before the student writes; it only shows a generic method checklist and non-answer starters.
- Variant verification now adapts the method checklist by skill, such as slope/change rate, equations, text evidence, experiments, geometry, and biology.
- Variant live feedback now tells the student the next missing step while they type the open method explanation.
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
- `supabase/*.sql`: database/auth/mistake review/skill mastery setup scripts

## Verification Command

Run from the local sync folder:

```powershell
node account-plan.test.mjs; node content-bank.test.mjs; node api/coach.test.js; node auth-helper-schema.test.mjs; node auth-plan-schema.test.mjs; node cloud-mistakes-schema.test.mjs; node cloud-skill-mastery-schema.test.mjs; node cloud-practice-sessions-schema.test.mjs; node --check app.js
```

Latest fuller local verification command:

```powershell
node account-plan.test.mjs; node content-bank.test.mjs; node api/coach.test.js; node auth-helper-schema.test.mjs; node auth-plan-schema.test.mjs; node cloud-mistakes-schema.test.mjs; node cloud-skill-mastery-schema.test.mjs; node cloud-practice-sessions-schema.test.mjs; node --check app.js; node --check content/question-bank.js; node --check api/coach.js
```

Latest result: 130 tests passed and syntax checks passed. Correct, confident answers now advance to the next question automatically; completed guided mastery also advances automatically, with a final-question notice when there is no next question. The family illustration placement was browser-checked as a background under the platform title. The stuck-student helper was browser-checked from wrong answer to teacher model sentence to variant verification. The variant "next sentence" helper was browser-checked and still keeps submit locked until the student adds concrete content. The new system pages were verified through local preview file checks because the in-app browser automation pane was unavailable in this run.

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
- v4.6: variant submission now gives teacher-style rubric feedback for what is done and what still needs improvement.
- v4.7: variant rubric feedback now updates live as the student types, with visual done/needs-work chips.
- v4.8: variant submit is gated by live rubric readiness, so students must complete topic/type, first step, and reason explanation before AI grading.
- v4.9: variant explanation now offers sentence starter chips for topic, first step, and reason, helping students write without giving the answer.
- v5.0: sentence starter text alone no longer passes the variant rubric; students must add concrete content after the scaffold.
- v5.1: variant verification hides the expected method before open response, so students must first write their own method.
- v5.2: variant verification checklist now adapts by skill area while still avoiding direct answers.
- v5.3: variant live feedback now gives the next missing writing step, then confirms when the method explanation is ready to submit.
- v5.4: signed-out auth landing now follows a standard minimal pattern: login first, registration as a secondary entry, and account type only inside registration.
- v5.5: logged-in app now includes a family learning memory photo card above the workspace, using a wide crop that keeps the family and school setting visible.
- v5.6: complete restatement now opens variant verification in the same coach turn, preventing students from getting stuck after a wrong answer.
- v5.7: the family image has been replaced with the new illustration, compressed for the web, and moved into a smaller left-side background card so it supports the workspace without covering learning controls.
- v5.8: if a student writes “不知道/不会/写什么” in the wrong-answer restatement box, the app now shows a concrete rescue sentence starter and a one-click fill button; placeholder text inside brackets cannot pass the quality gate.
- v5.9: correct, confident answers and completed guided mastery now move the student to the next question automatically instead of leaving them on the same card.
- v6.0: family illustration moved from a standalone workspace card to a subtle title-area background on the login card and app sidebar, preserving the original learning page layout.
- v6.1: wrong-answer guidance now includes a teacher model sentence button for stuck students; it teaches a complete method sentence without showing the answer and then lets the student continue into variant verification.
- v6.2: variant verification now includes a "补下一句" helper that inserts only the next missing method sentence starter; starter-only responses still cannot pass.
- v6.3: variant verification now includes a "换种讲法" escape path that moves a stuck student back to reteaching with a simpler same-skill example and a one-sentence fill prompt.
- v6.4: AI guidance now shows a single "current task" card for each stage, telling the student exactly what to do next before the detailed scaffold.
- v6.5: AI guidance now shows "unlock next question" conditions, so students can see exactly which mastery gate is waiting, active, or done.
- v6.6: the wrong-answer restatement input now adapts its example placeholder to the current skill, making it easier for students to start writing.
- v6.7: when a student replies "不知道/不会/没思路", the guidance button becomes "帮我开头" and starts a rescue reteach instead of leaving the student stuck behind the completeness gate.
- v7.0: requirements-plan rebuild started. Student side now has mission-control dashboard, Learning Path page, Practice context/tool actions, dedicated Mistake Notebook with filters, and Parent Dashboard summary cards.
- v7.1: priority structured question bank now reaches at least 30 runtime expansion questions per core subject, with explanation, common mistakes, and three AI hint levels on the systematic expansion batch.
- v7.2: daily mission cards now show explicit task states, and SkillMastery tracking records attempts, accuracy, mastery, status, review count, and last practiced time from answer outcomes and mistake reviews.
- v7.3: SkillMastery now has a Supabase cloud table and sync path with local fallback, so mastery, attempts, accuracy, review count, and last practiced time can persist across devices after the SQL script is run.
- v7.4: practice sessions now track answer time, hints used, accuracy, difficulty start/end, slow mastery signals, and possible guessing signals; student wrap-up and parent summary can use the real session metrics.
- v7.5: mistake notebook cards now show a same-skill similar practice pack of up to 3 questions, turning each mistake into a short review set instead of a single retry.
- v7.6: practice sessions now have a Supabase cloud table and sync path with local fallback, preserving time, hints, accuracy, difficulty movement, slow-mastery, and guessing signals after the SQL script is run.
- v7.7: practice sessions now load back from Supabase and merge locally at login; weekly parent reports use session metrics for hints, slow mastery, and possible guessing.
- v7.8: Daily Mission progress now recovers from synced practice-session counts, so today progress can survive browser changes after cloud data is available.
- v7.9: Parent Dashboard now has a daily digest email draft action, using the generated report content and parent email fallback without requiring a paid email service yet.
- v8.0: Parent digest email now has a production API endpoint using Resend when `RESEND_API_KEY` is configured, with automatic mailto fallback when it is not configured.
- v8.1: Parent Dashboard now includes a production readiness panel that checks Supabase learning tables and automatic email configuration, with setup guidance in the UI.
- v8.2: Scheduled daily digest route added at `/api/daily-digest-cron` with Vercel Cron configuration; it summarizes practice sessions, mistakes, and weak skills when Resend and Supabase service env vars are configured.
- v8.3: Student report now includes behavior-based mastery badges and a weekly challenge tied to mastery, review, accuracy, and hint usage.
- v8.4: P2 gaps closed with optional browser voice input for coach replies and a Frisco ISD / Liberty High School localized learning path panel for MIA/EVA.
- QA baseline: account-scoped local progress, production readiness panel, scheduled daily digest route, student mastery badges, weekly challenge, optional voice coach input, Frisco/Liberty localized path, cloud-ready skill mastery, cloud-ready bidirectional practice-session behavior tracking, cloud-recoverable daily mission progress, parent digest email API with draft fallback, similar-practice mistake packs, independent-first answering, student dashboard, daily mission states, skill mastery tracking, learning path modules, practice context actions, dedicated mistake notebook, parent summary dashboard, 30+ structured expansion questions per priority subject, auto-advance after correct answers, refreshed daily progress, structured mistake insight card, single current-task guidance card, next-question unlock conditions, restatement scaffold, skill-adaptive restatement placeholder, stuck-reply rescue submit, live reply-quality feedback with detail gate, stuck-reply rescue starter, teacher model sentence without answer reveal, locked guidance submit for incomplete non-help replies, guided teaching move with direct variant progression, structured variant verification, teacher-style live variant rubric feedback, rubric-gated variant submit, non-answer sentence starters, next-missing-sentence helper, reteach escape path, starter-only guard, hidden expected-method prompt, skill-adaptive method checklist, title-area family background image, live next-step variant feedback, and less-strict Chinese/mixed-language mastery checks.

## Operating Notes

- Prefer direct Git push from the local sync folder instead of GitHub manual upload.
- Keep changes small and test after each step.
- Do not put parent controls inside the student view.
- Do not ask account type during login; role comes from the registered profile.
- Do not let wrong answers advance without guided mastery.
- Do not show solution guidance before the student's first attempt.
- Do not rely only on multiple choice; require open explanation after wrong/uncertain answers.
