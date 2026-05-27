# Production Setup Checklist

Updated: 2026-05-27

## Supabase SQL

Recommended: run this single combined script in Supabase SQL Editor:

- `supabase/000_run_all_learning_platform.sql`

It creates the base student/subject tables, starter question tables, parent/student auth helpers, mistake reviews, skill mastery, practice sessions, and the learning-closure tables required by the execution plan.

If you prefer to run the files separately, use this order:

1. `supabase/001_base_learning_schema.sql`
2. `supabase/003_seed_starter_questions.sql`
3. `supabase/004_auth_and_plans.sql`
4. `supabase/005_family_auth_helpers.sql`
5. `supabase/009_mistake_reviews.sql`
6. `supabase/010_skill_mastery.sql`
7. `supabase/011_practice_sessions.sql`
8. `supabase/012_learning_closure_tables.sql`

The app has local fallback, so students can continue learning before these are run. Running them enables long-term cloud storage for accounts, plans, mistakes, mastery, reports, and practice-session behavior.

## Email Sending

The Parent Dashboard email button works in two modes:

- Automatic send: requires `RESEND_API_KEY` in Vercel environment variables.
- Draft fallback: if `RESEND_API_KEY` is missing, the app opens an email draft with the report content.

Optional Vercel environment variables:

- `RESEND_API_KEY`: Resend server API key.
- `DIGEST_EMAIL_FROM`: verified sender, for example `Family Learning Coach <reports@yourdomain.com>`.
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key for scheduled daily digest reads.
- `PARENT_DIGEST_EMAIL`: parent recipient email; default fallback is `linbinmail@gmail.com`.
- `CRON_SECRET`: optional secret for protecting manual cron calls.

Without a verified sending domain, Resend's default onboarding sender can be used for testing only.

## Scheduled Daily Digest

The app includes a Vercel Cron route:

- Path: `/api/daily-digest-cron`
- Schedule: `0 2 * * *`

When `RESEND_API_KEY` and `SUPABASE_SERVICE_ROLE_KEY` are configured, the cron route summarizes today's practice sessions, open mistakes, and weak mastery skills, then emails the parent digest.

## Current Production URL

https://family-learning-coach.vercel.app/

## Current Functional Baseline

- Parent and student accounts are separate.
- Students see only student learning views.
- Parents see dashboard, reports, plan controls, and digest email actions.
- Parent Dashboard includes a production readiness panel for Supabase tables and automatic email configuration.
- Wrong or uncertain answers enter guided mastery before the next question.
- Correct confident answers advance automatically.
- Mistakes, mastery, and practice-session behavior are cloud-ready.
