# Production Setup Checklist

Updated: 2026-05-27

## Supabase SQL

Run these scripts in Supabase SQL Editor in order if they have not already been run:

1. `supabase/010_skill_mastery.sql`
2. `supabase/011_practice_sessions.sql`

The app has local fallback, so students can continue learning before these are run. Running them enables long-term cloud storage for mastery and practice-session behavior.

## Email Sending

The Parent Dashboard email button works in two modes:

- Automatic send: requires `RESEND_API_KEY` in Vercel environment variables.
- Draft fallback: if `RESEND_API_KEY` is missing, the app opens an email draft with the report content.

Optional Vercel environment variables:

- `RESEND_API_KEY`: Resend server API key.
- `DIGEST_EMAIL_FROM`: verified sender, for example `Family Learning Coach <reports@yourdomain.com>`.

Without a verified sending domain, Resend's default onboarding sender can be used for testing only.

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
