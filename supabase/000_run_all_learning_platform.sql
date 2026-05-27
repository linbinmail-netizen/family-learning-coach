-- Family Learning Coach complete production SQL setup.
-- Run this whole file once in Supabase SQL Editor.
-- It is safe to rerun because the scripts use create-if-not-exists and drop/recreate policies where needed.


-- ============================================================
-- 001_base_learning_schema.sql
-- ============================================================
-- Base learning schema for Family Learning Coach.
-- Run this before auth, plan, mastery, and report scripts.

create extension if not exists pgcrypto;

create table if not exists public.students (
  id uuid primary key default gen_random_uuid(),
  display_name text not null unique,
  grade_level integer not null,
  school_note text,
  primary_goal text,
  created_at timestamptz not null default now()
);

create table if not exists public.subjects (
  id uuid primary key default gen_random_uuid(),
  title text not null unique,
  grade_level integer,
  subject_area text,
  created_at timestamptz not null default now()
);

create table if not exists public.knowledge_points (
  id uuid primary key default gen_random_uuid(),
  subject_id uuid not null references public.subjects(id) on delete cascade,
  title text not null,
  description text,
  created_at timestamptz not null default now(),
  unique (subject_id, title)
);

create table if not exists public.diagnostic_sessions (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  subject_id uuid references public.subjects(id) on delete set null,
  goal text,
  overall_score numeric,
  summary text,
  created_at timestamptz not null default now()
);

create table if not exists public.mastery_results (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  subject_id uuid references public.subjects(id) on delete set null,
  knowledge_point_id uuid references public.knowledge_points(id) on delete set null,
  mastery_score numeric not null default 0 check (mastery_score between 0 and 100),
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.learning_activities (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  subject_id uuid references public.subjects(id) on delete set null,
  activity_type text not null default 'practice',
  minutes_spent integer not null default 0 check (minutes_spent >= 0),
  notes text,
  created_at timestamptz not null default now()
);

alter table public.students enable row level security;
alter table public.subjects enable row level security;
alter table public.knowledge_points enable row level security;
alter table public.diagnostic_sessions enable row level security;
alter table public.mastery_results enable row level security;
alter table public.learning_activities enable row level security;

drop policy if exists "Base students readable by authenticated users" on public.students;
create policy "Base students readable by authenticated users"
on public.students for select
using ((select auth.role()) = 'authenticated');

drop policy if exists "Base subjects readable by authenticated users" on public.subjects;
create policy "Base subjects readable by authenticated users"
on public.subjects for select
using ((select auth.role()) = 'authenticated');

drop policy if exists "Base knowledge readable by authenticated users" on public.knowledge_points;
create policy "Base knowledge readable by authenticated users"
on public.knowledge_points for select
using ((select auth.role()) = 'authenticated');

drop policy if exists "Base diagnostic temporary family insert" on public.diagnostic_sessions;
create policy "Base diagnostic temporary family insert"
on public.diagnostic_sessions for all
using ((select auth.role()) = 'authenticated')
with check ((select auth.role()) = 'authenticated');

drop policy if exists "Base mastery temporary family insert" on public.mastery_results;
create policy "Base mastery temporary family insert"
on public.mastery_results for all
using ((select auth.role()) = 'authenticated')
with check ((select auth.role()) = 'authenticated');

drop policy if exists "Base activities temporary family insert" on public.learning_activities;
create policy "Base activities temporary family insert"
on public.learning_activities for all
using ((select auth.role()) = 'authenticated')
with check ((select auth.role()) = 'authenticated');

insert into public.students (display_name, grade_level, school_note, primary_goal)
values
  ('MIA', 9, 'Frisco ISD / Liberty High School', 'English I and Algebra I readiness'),
  ('EVA', 8, 'Frisco ISD / 8th Grade Bridge', '8th grade math and reading readiness')
on conflict (display_name) do update
set grade_level = excluded.grade_level,
    school_note = excluded.school_note,
    primary_goal = excluded.primary_goal;

insert into public.subjects (title, grade_level, subject_area)
values
  ('7th Grade Math', 7, 'Math'),
  ('8th Grade Math', 8, 'Math'),
  ('Algebra I', 9, 'Math'),
  ('7th Grade Reading', 7, 'Reading'),
  ('8th Grade Reading', 8, 'Reading'),
  ('English I', 9, 'English'),
  ('Writing', null, 'Writing'),
  ('Science', null, 'Science'),
  ('SAT/PSAT Foundation', 9, 'Test Prep')
on conflict (title) do update
set grade_level = excluded.grade_level,
    subject_area = excluded.subject_area;

insert into public.knowledge_points (subject_id, title, description)
select subjects.id, seed.title, seed.description
from public.subjects
join (
  values
    ('8th Grade Math', 'linear relationships', 'Slope, rate, and starting value in equations, tables, and graphs.'),
    ('8th Grade Math', 'proportional reasoning', 'Ratios, unit rates, and proportional relationships.'),
    ('English I', 'text evidence', 'Choose and explain evidence that directly supports a claim.'),
    ('English I', 'central idea', 'Find central idea and explain how details develop it.'),
    ('SAT/PSAT Foundation', 'evidence-based reading', 'Read claims, evidence, and inference under test-style wording.')
) as seed(subject_title, title, description)
  on subjects.title = seed.subject_title
on conflict (subject_id, title) do update
set description = excluded.description;


-- ============================================================
-- 003_seed_starter_questions.sql
-- ============================================================
create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  subject_id uuid not null references public.subjects(id) on delete cascade,
  knowledge_point_id uuid references public.knowledge_points(id) on delete set null,
  prompt text not null,
  question_type text not null default 'multiple_choice',
  difficulty text not null check (difficulty in ('foundation', 'medium', 'advanced')),
  source_type text not null check (source_type in ('in_house', 'tea_released', 'open_resource', 'licensed')),
  source_url text,
  explanation text,
  coach_hint_1 text,
  coach_hint_2 text,
  created_at timestamptz not null default now()
);

create table if not exists public.question_options (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.questions(id) on delete cascade,
  label text not null,
  option_text text not null,
  is_correct boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.student_answers (
  id uuid primary key default gen_random_uuid(),
  diagnostic_session_id uuid references public.diagnostic_sessions(id) on delete cascade,
  student_id uuid not null references public.students(id) on delete cascade,
  question_id uuid not null references public.questions(id) on delete cascade,
  selected_option_id uuid references public.question_options(id) on delete set null,
  is_correct boolean,
  response_text text,
  created_at timestamptz not null default now()
);

alter table public.questions enable row level security;
alter table public.question_options enable row level security;
alter table public.student_answers enable row level security;

create policy "Temporary family read questions"
on public.questions for select
using (true);

create policy "Temporary family read question options"
on public.question_options for select
using (true);

create policy "Temporary family manage student answers"
on public.student_answers for all
using (true)
with check (true);


-- ============================================================
-- 004_auth_and_plans.sql
-- ============================================================
-- Auth + study plan foundation for Family Learning Coach.
-- Run this in Supabase SQL Editor after the existing schema files.
-- This migration does not remove the earlier temporary public policies, so the current site keeps working.

create extension if not exists pgcrypto;

create table if not exists public.user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  role text not null check (role in ('parent', 'student')),
  student_id uuid references public.students(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.parent_student_links (
  id uuid primary key default gen_random_uuid(),
  parent_user_id uuid not null references public.user_profiles(id) on delete cascade,
  student_user_id uuid references public.user_profiles(id) on delete cascade,
  student_id uuid not null references public.students(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (parent_user_id, student_id)
);

create table if not exists public.study_plan_settings (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  parent_user_id uuid references public.user_profiles(id) on delete set null,
  minutes_per_day integer not null default 30 check (minutes_per_day in (20, 30, 45, 60)),
  focus_subject_id uuid references public.subjects(id) on delete set null,
  goal text not null default 'summer',
  updated_at timestamptz not null default now(),
  unique (student_id)
);

create table if not exists public.daily_task_progress (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  subject_id uuid references public.subjects(id) on delete set null,
  task_date date not null default current_date,
  task_type text not null check (task_type in ('diagnostic', 'coach_review', 'summary')),
  title text not null,
  target_count integer not null default 1 check (target_count > 0),
  completed_count integer not null default 0 check (completed_count >= 0),
  status text not null default 'pending' check (status in ('pending', 'in_progress', 'done')),
  updated_by uuid references public.user_profiles(id) on delete set null,
  updated_at timestamptz not null default now(),
  unique (student_id, task_date, task_type)
);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists touch_user_profiles_updated_at on public.user_profiles;
create trigger touch_user_profiles_updated_at
before update on public.user_profiles
for each row execute function public.touch_updated_at();

drop trigger if exists touch_study_plan_settings_updated_at on public.study_plan_settings;
create trigger touch_study_plan_settings_updated_at
before update on public.study_plan_settings
for each row execute function public.touch_updated_at();

drop trigger if exists touch_daily_task_progress_updated_at on public.daily_task_progress;
create trigger touch_daily_task_progress_updated_at
before update on public.daily_task_progress
for each row execute function public.touch_updated_at();

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  requested_role text := coalesce(new.raw_user_meta_data ->> 'role', 'student');
  requested_student_name text := upper(coalesce(new.raw_user_meta_data ->> 'student_name', ''));
  matched_student_id uuid;
begin
  if requested_student_name <> '' then
    select id into matched_student_id
    from public.students
    where upper(display_name) = requested_student_name
    limit 1;
  end if;

  insert into public.user_profiles (id, display_name, role, student_id)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1)),
    case when requested_role = 'parent' then 'parent' else 'student' end,
    matched_student_id
  )
  on conflict (id) do update
    set display_name = excluded.display_name,
        role = excluded.role,
        student_id = excluded.student_id;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created_family_learning on auth.users;
create trigger on_auth_user_created_family_learning
after insert on auth.users
for each row execute function public.handle_new_auth_user();

alter table public.user_profiles enable row level security;
alter table public.parent_student_links enable row level security;
alter table public.study_plan_settings enable row level security;
alter table public.daily_task_progress enable row level security;

drop policy if exists "Profiles: user can read own profile" on public.user_profiles;
create policy "Profiles: user can read own profile"
on public.user_profiles for select
using ((select auth.uid()) = id);

drop policy if exists "Profiles: user can update own profile" on public.user_profiles;
create policy "Profiles: user can update own profile"
on public.user_profiles for update
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

drop policy if exists "Links: parent can read own links" on public.parent_student_links;
create policy "Links: parent can read own links"
on public.parent_student_links for select
using (parent_user_id = (select auth.uid()));

drop policy if exists "Links: linked student can read own link" on public.parent_student_links;
create policy "Links: linked student can read own link"
on public.parent_student_links for select
using (student_user_id = (select auth.uid()));

drop policy if exists "Plans: parent can manage linked students" on public.study_plan_settings;
create policy "Plans: parent can manage linked students"
on public.study_plan_settings for all
using (
  exists (
    select 1 from public.parent_student_links link
    where link.parent_user_id = (select auth.uid())
      and link.student_id = study_plan_settings.student_id
  )
)
with check (
  exists (
    select 1 from public.parent_student_links link
    where link.parent_user_id = (select auth.uid())
      and link.student_id = study_plan_settings.student_id
  )
);

drop policy if exists "Plans: student can read own plan" on public.study_plan_settings;
create policy "Plans: student can read own plan"
on public.study_plan_settings for select
using (
  exists (
    select 1 from public.user_profiles profile
    where profile.id = (select auth.uid())
      and profile.student_id = study_plan_settings.student_id
  )
);

drop policy if exists "Progress: parent can manage linked students" on public.daily_task_progress;
create policy "Progress: parent can manage linked students"
on public.daily_task_progress for all
using (
  exists (
    select 1 from public.parent_student_links link
    where link.parent_user_id = (select auth.uid())
      and link.student_id = daily_task_progress.student_id
  )
)
with check (
  exists (
    select 1 from public.parent_student_links link
    where link.parent_user_id = (select auth.uid())
      and link.student_id = daily_task_progress.student_id
  )
);

drop policy if exists "Progress: student can read own progress" on public.daily_task_progress;
create policy "Progress: student can read own progress"
on public.daily_task_progress for select
using (
  exists (
    select 1 from public.user_profiles profile
    where profile.id = (select auth.uid())
      and profile.student_id = daily_task_progress.student_id
  )
);

insert into public.study_plan_settings (student_id, minutes_per_day, focus_subject_id, goal)
select st.id, 30, sub.id, 'summer'
from public.students st
left join public.subjects sub
  on (st.display_name = 'MIA' and sub.title = 'English I')
  or (st.display_name = 'EVA' and sub.title = '8th Grade Math')
where st.display_name in ('MIA', 'EVA')
on conflict (student_id) do nothing;


-- ============================================================
-- 005_family_auth_helpers.sql
-- ============================================================
-- Helper functions used by the web app after Supabase Auth login.
-- Run after 004_auth_and_plans.sql.

create or replace function public.ensure_my_profile()
returns public.user_profiles
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  current_auth_user auth.users;
  requested_role text;
  requested_student_name text;
  matched_student_id uuid;
  upserted_profile public.user_profiles;
begin
  select * into current_auth_user
  from auth.users
  where id = (select auth.uid());

  if current_auth_user.id is null then
    raise exception 'No authenticated user found';
  end if;

  requested_role := coalesce(current_auth_user.raw_user_meta_data ->> 'role', 'parent');
  requested_student_name := upper(coalesce(
    current_auth_user.raw_user_meta_data ->> 'student_name',
    current_auth_user.raw_user_meta_data ->> 'display_name',
    ''
  ));

  if requested_student_name <> '' then
    select id into matched_student_id
    from public.students
    where upper(display_name) = requested_student_name
    limit 1;
  end if;

  insert into public.user_profiles (id, display_name, role, student_id)
  values (
    current_auth_user.id,
    coalesce(current_auth_user.raw_user_meta_data ->> 'display_name', split_part(current_auth_user.email, '@', 1)),
    case when requested_role = 'student' then 'student' else 'parent' end,
    matched_student_id
  )
  on conflict (id) do update
    set display_name = excluded.display_name,
        role = excluded.role,
        student_id = excluded.student_id
  returning * into upserted_profile;

  return upserted_profile;
end;
$$;

grant execute on function public.ensure_my_profile() to authenticated;

create or replace function public.ensure_family_links()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  current_profile public.user_profiles;
begin
  select * into current_profile
  from public.user_profiles
  where id = (select auth.uid());

  if current_profile.id is null then
    raise exception 'No profile found for current user';
  end if;

  if current_profile.role <> 'parent' then
    return;
  end if;

  insert into public.parent_student_links (parent_user_id, student_id)
  select current_profile.id, students.id
  from public.students
  where students.display_name in ('MIA', 'EVA')
  on conflict (parent_user_id, student_id) do nothing;
end;
$$;

grant execute on function public.ensure_family_links() to authenticated;

create or replace function public.get_my_family_students()
returns table (
  student_id uuid,
  display_name text,
  grade_level integer,
  school_note text
)
language sql
security definer
set search_path = public
as $$
  select students.id, students.display_name, students.grade_level, students.school_note
  from public.students
  join public.user_profiles profile
    on profile.id = (select auth.uid())
  where
    (profile.role = 'student' and profile.student_id = students.id)
    or (
      profile.role = 'parent'
      and exists (
        select 1
        from public.parent_student_links link
        where link.parent_user_id = profile.id
          and link.student_id = students.id
      )
    )
  order by students.display_name;
$$;

grant execute on function public.get_my_family_students() to authenticated;


-- ============================================================
-- 009_mistake_reviews.sql
-- ============================================================
-- Cloud mistake review storage.
-- Run this after 008_ensure_my_profile.sql in the Supabase SQL Editor.

create table if not exists public.mistake_reviews (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  subject_id uuid references public.subjects(id) on delete set null,
  question_key text not null,
  prompt text not null,
  skill text not null,
  difficulty text not null default '中等',
  selected_answer text,
  correct_answer text,
  reason text not null default '答错',
  attempts integer not null default 1 check (attempts > 0),
  resolved boolean not null default false,
  last_missed_at timestamptz not null default now(),
  reviewed_at timestamptz,
  updated_by uuid references public.user_profiles(id) on delete set null,
  updated_at timestamptz not null default now(),
  unique (student_id, subject_id, question_key)
);

drop trigger if exists touch_mistake_reviews_updated_at on public.mistake_reviews;
create trigger touch_mistake_reviews_updated_at
before update on public.mistake_reviews
for each row execute function public.touch_updated_at();

alter table public.mistake_reviews enable row level security;

drop policy if exists "Mistakes: parent can manage linked students" on public.mistake_reviews;
create policy "Mistakes: parent can manage linked students"
on public.mistake_reviews for all
using (
  exists (
    select 1 from public.parent_student_links link
    where link.parent_user_id = (select auth.uid())
      and link.student_id = mistake_reviews.student_id
  )
)
with check (
  exists (
    select 1 from public.parent_student_links link
    where link.parent_user_id = (select auth.uid())
      and link.student_id = mistake_reviews.student_id
  )
);

drop policy if exists "Mistakes: student can manage own mistakes" on public.mistake_reviews;
create policy "Mistakes: student can manage own mistakes"
on public.mistake_reviews for all
using (
  exists (
    select 1 from public.user_profiles profile
    where profile.id = (select auth.uid())
      and profile.student_id = mistake_reviews.student_id
  )
)
with check (
  exists (
    select 1 from public.user_profiles profile
    where profile.id = (select auth.uid())
      and profile.student_id = mistake_reviews.student_id
  )
);


-- ============================================================
-- 010_skill_mastery.sql
-- ============================================================
-- Cloud skill mastery storage.
-- Run this after 009_mistake_reviews.sql in the Supabase SQL Editor.

create table if not exists public.skill_mastery (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  subject_id uuid references public.subjects(id) on delete set null,
  skill text not null,
  mastery integer not null default 45 check (mastery >= 0 and mastery <= 100),
  attempts integer not null default 0 check (attempts >= 0),
  correct_count integer not null default 0 check (correct_count >= 0),
  review_count integer not null default 0 check (review_count >= 0),
  accuracy integer not null default 0 check (accuracy >= 0 and accuracy <= 100),
  average_time integer not null default 0 check (average_time >= 0),
  status text not null default 'not_started',
  last_practiced_at timestamptz,
  updated_by uuid references public.user_profiles(id) on delete set null,
  updated_at timestamptz not null default now(),
  unique (student_id, subject_id, skill)
);

drop trigger if exists touch_skill_mastery_updated_at on public.skill_mastery;
create trigger touch_skill_mastery_updated_at
before update on public.skill_mastery
for each row execute function public.touch_updated_at();

alter table public.skill_mastery enable row level security;

drop policy if exists "Skill mastery: parent can manage linked students" on public.skill_mastery;
create policy "Skill mastery: parent can manage linked students"
on public.skill_mastery for all
using (
  exists (
    select 1 from public.parent_student_links link
    where link.parent_user_id = (select auth.uid())
      and link.student_id = skill_mastery.student_id
  )
)
with check (
  exists (
    select 1 from public.parent_student_links link
    where link.parent_user_id = (select auth.uid())
      and link.student_id = skill_mastery.student_id
  )
);

drop policy if exists "Skill mastery: student can manage own mastery" on public.skill_mastery;
create policy "Skill mastery: student can manage own mastery"
on public.skill_mastery for all
using (
  exists (
    select 1 from public.user_profiles profile
    where profile.id = (select auth.uid())
      and profile.student_id = skill_mastery.student_id
  )
)
with check (
  exists (
    select 1 from public.user_profiles profile
    where profile.id = (select auth.uid())
      and profile.student_id = skill_mastery.student_id
  )
);


-- ============================================================
-- 011_practice_sessions.sql
-- ============================================================
-- Cloud practice session storage.
-- Run this after 010_skill_mastery.sql in the Supabase SQL Editor.

create table if not exists public.practice_sessions (
  id uuid primary key default gen_random_uuid(),
  local_session_id text not null,
  student_id uuid not null references public.students(id) on delete cascade,
  subject_id uuid references public.subjects(id) on delete set null,
  skill text not null,
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  questions_answered integer not null default 0 check (questions_answered >= 0),
  correct_count integer not null default 0 check (correct_count >= 0),
  hints_used integer not null default 0 check (hints_used >= 0),
  difficulty_start integer not null default 1 check (difficulty_start >= 0),
  difficulty_end integer not null default 1 check (difficulty_end >= 0),
  slow_count integer not null default 0 check (slow_count >= 0),
  guessing_count integer not null default 0 check (guessing_count >= 0),
  updated_by uuid references public.user_profiles(id) on delete set null,
  updated_at timestamptz not null default now(),
  unique (student_id, local_session_id)
);

drop trigger if exists touch_practice_sessions_updated_at on public.practice_sessions;
create trigger touch_practice_sessions_updated_at
before update on public.practice_sessions
for each row execute function public.touch_updated_at();

alter table public.practice_sessions enable row level security;

drop policy if exists "Practice sessions: parent can manage linked students" on public.practice_sessions;
create policy "Practice sessions: parent can manage linked students"
on public.practice_sessions for all
using (
  exists (
    select 1 from public.parent_student_links link
    where link.parent_user_id = (select auth.uid())
      and link.student_id = practice_sessions.student_id
  )
)
with check (
  exists (
    select 1 from public.parent_student_links link
    where link.parent_user_id = (select auth.uid())
      and link.student_id = practice_sessions.student_id
  )
);

drop policy if exists "Practice sessions: student can manage own sessions" on public.practice_sessions;
create policy "Practice sessions: student can manage own sessions"
on public.practice_sessions for all
using (
  exists (
    select 1 from public.user_profiles profile
    where profile.id = (select auth.uid())
      and profile.student_id = practice_sessions.student_id
  )
)
with check (
  exists (
    select 1 from public.user_profiles profile
    where profile.id = (select auth.uid())
      and profile.student_id = practice_sessions.student_id
  )
);


-- ============================================================
-- 012_learning_closure_tables.sql
-- ============================================================
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

