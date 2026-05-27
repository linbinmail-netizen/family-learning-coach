-- Learning closure tables for the execution-plan version of Family Learning Coach.
-- Run after 004_auth_and_plans.sql, 009_mistake_reviews.sql, 010_skill_mastery.sql,
-- and 011_practice_sessions.sql.

create extension if not exists pgcrypto;

create table if not exists public.learning_settings (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  daily_minutes integer not null default 30 check (daily_minutes between 10 and 180),
  daily_question_count integer not null default 6 check (daily_question_count between 1 and 40),
  difficulty_strategy text not null default 'auto' check (difficulty_strategy in ('steady', 'auto', 'challenge')),
  focus_subjects text[] not null default array[]::text[],
  updated_at timestamptz not null default now(),
  unique (student_id)
);

alter table public.questions add column if not exists grade_level integer;
alter table public.questions add column if not exists standard_system text;
alter table public.questions add column if not exists standard_code text;
alter table public.questions add column if not exists skill text;
alter table public.questions add column if not exists difficulty_level integer check (difficulty_level between 1 and 5);
alter table public.questions add column if not exists choices jsonb;
alter table public.questions add column if not exists correct_answer text;
alter table public.questions add column if not exists common_mistakes jsonb not null default '{}'::jsonb;
alter table public.questions add column if not exists hint_steps jsonb not null default '[]'::jsonb;
alter table public.questions add column if not exists variant_question jsonb not null default '{}'::jsonb;
alter table public.questions add column if not exists source_tag text;
alter table public.questions add column if not exists is_active boolean not null default true;

create table if not exists public.daily_plans (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  plan_date date not null default current_date,
  subject text,
  target_minutes integer not null default 30 check (target_minutes > 0),
  target_question_count integer not null default 6 check (target_question_count > 0),
  status text not null default 'planned' check (status in ('planned', 'in_progress', 'completed')),
  created_at timestamptz not null default now(),
  unique (student_id, plan_date)
);

create table if not exists public.daily_plan_items (
  id uuid primary key default gen_random_uuid(),
  daily_plan_id uuid not null references public.daily_plans(id) on delete cascade,
  question_id uuid references public.questions(id) on delete set null,
  sequence_order integer not null default 1,
  status text not null default 'not_started' check (status in ('not_started', 'answered', 'reviewed', 'mastered')),
  created_at timestamptz not null default now(),
  unique (daily_plan_id, sequence_order)
);

alter table public.student_answers add column if not exists daily_plan_item_id uuid references public.daily_plan_items(id) on delete set null;
alter table public.student_answers add column if not exists student_answer text;
alter table public.student_answers add column if not exists confidence text check (confidence in ('sure', 'unsure', 'guess'));
alter table public.student_answers add column if not exists mistake_type text check (mistake_type in ('concept_gap', 'careless', 'calculation_step', 'reading_comprehension', 'logic_reasoning', 'guessed', 'unclear'));
alter table public.student_answers add column if not exists ai_feedback jsonb;
alter table public.student_answers add column if not exists time_spent_seconds integer check (time_spent_seconds is null or time_spent_seconds >= 0);

create table if not exists public.mistake_notebook (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  question_id uuid references public.questions(id) on delete set null,
  student_answer_id uuid references public.student_answers(id) on delete set null,
  subject text,
  skill text,
  mistake_type text check (mistake_type in ('concept_gap', 'careless', 'calculation_step', 'reading_comprehension', 'logic_reasoning', 'guessed', 'unclear')),
  review_status text not null default 'needs_review' check (review_status in ('needs_review', 'reviewed', 'mastered')),
  next_review_date date,
  created_at timestamptz not null default now()
);

create table if not exists public.mastery_records (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  subject text not null,
  skill text not null,
  mastery_score numeric not null default 0 check (mastery_score between 0 and 100),
  attempts integer not null default 0 check (attempts >= 0),
  correct_count integer not null default 0 check (correct_count >= 0),
  last_practiced_at timestamptz,
  updated_at timestamptz not null default now(),
  unique (student_id, subject, skill)
);

create table if not exists public.parent_reports (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  report_date date not null default current_date,
  summary text,
  completed_tasks integer not null default 0,
  total_tasks integer not null default 0,
  accuracy numeric,
  minutes_spent integer not null default 0,
  weak_skills jsonb not null default '[]'::jsonb,
  next_steps jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  unique (student_id, report_date)
);

create or replace view public.users_profile as
select id, role, null::text as email, display_name, created_at
from public.user_profiles;

alter table public.learning_settings enable row level security;
alter table public.daily_plans enable row level security;
alter table public.daily_plan_items enable row level security;
alter table public.mistake_notebook enable row level security;
alter table public.mastery_records enable row level security;
alter table public.parent_reports enable row level security;

drop policy if exists "Learning settings: family can manage" on public.learning_settings;
create policy "Learning settings: family can manage"
on public.learning_settings for all
using (
  exists (
    select 1 from public.parent_student_links link
    where link.student_id = learning_settings.student_id
      and (link.parent_user_id = (select auth.uid()) or link.student_user_id = (select auth.uid()))
  )
)
with check (
  exists (
    select 1 from public.parent_student_links link
    where link.student_id = learning_settings.student_id
      and (link.parent_user_id = (select auth.uid()) or link.student_user_id = (select auth.uid()))
  )
);

drop policy if exists "Daily plans: family can read and update" on public.daily_plans;
create policy "Daily plans: family can read and update"
on public.daily_plans for all
using (
  exists (
    select 1 from public.parent_student_links link
    where link.student_id = daily_plans.student_id
      and (link.parent_user_id = (select auth.uid()) or link.student_user_id = (select auth.uid()))
  )
)
with check (
  exists (
    select 1 from public.parent_student_links link
    where link.student_id = daily_plans.student_id
      and (link.parent_user_id = (select auth.uid()) or link.student_user_id = (select auth.uid()))
  )
);

drop policy if exists "Daily plan items: family can read and update" on public.daily_plan_items;
create policy "Daily plan items: family can read and update"
on public.daily_plan_items for all
using (
  exists (
    select 1 from public.daily_plans plan
    join public.parent_student_links link on link.student_id = plan.student_id
    where plan.id = daily_plan_items.daily_plan_id
      and (link.parent_user_id = (select auth.uid()) or link.student_user_id = (select auth.uid()))
  )
)
with check (
  exists (
    select 1 from public.daily_plans plan
    join public.parent_student_links link on link.student_id = plan.student_id
    where plan.id = daily_plan_items.daily_plan_id
      and (link.parent_user_id = (select auth.uid()) or link.student_user_id = (select auth.uid()))
  )
);

drop policy if exists "Mistake notebook: family can manage" on public.mistake_notebook;
create policy "Mistake notebook: family can manage"
on public.mistake_notebook for all
using (
  exists (
    select 1 from public.parent_student_links link
    where link.student_id = mistake_notebook.student_id
      and (link.parent_user_id = (select auth.uid()) or link.student_user_id = (select auth.uid()))
  )
)
with check (
  exists (
    select 1 from public.parent_student_links link
    where link.student_id = mistake_notebook.student_id
      and (link.parent_user_id = (select auth.uid()) or link.student_user_id = (select auth.uid()))
  )
);

drop policy if exists "Mastery records: family can manage" on public.mastery_records;
create policy "Mastery records: family can manage"
on public.mastery_records for all
using (
  exists (
    select 1 from public.parent_student_links link
    where link.student_id = mastery_records.student_id
      and (link.parent_user_id = (select auth.uid()) or link.student_user_id = (select auth.uid()))
  )
)
with check (
  exists (
    select 1 from public.parent_student_links link
    where link.student_id = mastery_records.student_id
      and (link.parent_user_id = (select auth.uid()) or link.student_user_id = (select auth.uid()))
  )
);

drop policy if exists "Parent reports: family can read" on public.parent_reports;
create policy "Parent reports: family can read"
on public.parent_reports for select
using (
  exists (
    select 1 from public.parent_student_links link
    where link.student_id = parent_reports.student_id
      and (link.parent_user_id = (select auth.uid()) or link.student_user_id = (select auth.uid()))
  )
);
