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
