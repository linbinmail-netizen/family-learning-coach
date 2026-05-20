create extension if not exists pgcrypto;

create table if not exists public.students (
  id uuid primary key default gen_random_uuid(),
  display_name text not null,
  grade_level integer not null check (grade_level between 1 and 12),
  school_note text,
  created_at timestamptz not null default now()
);

create table if not exists public.subjects (
  id uuid primary key default gen_random_uuid(),
  grade_level integer not null check (grade_level between 1 and 12),
  title text not null,
  standard_source text not null default 'TEKS',
  created_at timestamptz not null default now()
);

create table if not exists public.knowledge_points (
  id uuid primary key default gen_random_uuid(),
  subject_id uuid not null references public.subjects(id) on delete cascade,
  title text not null,
  standard_code text,
  description text,
  created_at timestamptz not null default now()
);

create table if not exists public.diagnostic_sessions (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  subject_id uuid not null references public.subjects(id) on delete cascade,
  goal text not null,
  overall_score integer not null check (overall_score between 0 and 100),
  summary text,
  created_at timestamptz not null default now()
);

create table if not exists public.mastery_results (
  id uuid primary key default gen_random_uuid(),
  diagnostic_session_id uuid not null references public.diagnostic_sessions(id) on delete cascade,
  knowledge_point_id uuid not null references public.knowledge_points(id) on delete cascade,
  mastery_score integer not null check (mastery_score between 0 and 100),
  status text not null check (status in ('strong', 'developing', 'weak')),
  recommendation text,
  created_at timestamptz not null default now()
);

create table if not exists public.learning_activities (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  subject_id uuid not null references public.subjects(id) on delete cascade,
  activity_type text not null check (activity_type in ('diagnostic', 'lesson', 'practice', 'coach_chat', 'review')),
  minutes_spent integer not null default 0 check (minutes_spent >= 0),
  notes text,
  created_at timestamptz not null default now()
);

insert into public.students (display_name, grade_level, school_note)
values
  ('MIA', 9, '将要上高一，Frisco ISD Liberty High School'),
  ('EVA', 8, '将要上初二')
on conflict do nothing;

insert into public.subjects (grade_level, title, standard_source)
values
  (7, '7th Grade Math', 'TEKS'),
  (7, '7th Grade RLA', 'TEKS'),
  (7, '7th Grade Science', 'TEKS'),
  (7, 'Pre-Algebra Foundations', 'TEKS readiness'),
  (9, 'English I', 'TEKS / STAAR EOC'),
  (9, 'Algebra I', 'TEKS / STAAR EOC'),
  (9, 'Geometry', 'TEKS'),
  (9, 'Biology', 'TEKS / STAAR EOC'),
  (8, '8th Grade Math', 'TEKS'),
  (8, '8th Grade RLA', 'TEKS'),
  (8, '8th Grade Science', 'TEKS'),
  (8, 'Algebra I Readiness', 'TEKS readiness')
on conflict do nothing;

insert into public.knowledge_points (subject_id, title, standard_code, description)
select s.id, kp.title, kp.standard_code, kp.description
from public.subjects s
join (
  values
    ('English I', 'Identify central idea', 'E1.R', 'Find the author central idea and supporting evidence.'),
    ('English I', 'Use text evidence', 'E1.RC', 'Select and explain evidence from a passage.'),
    ('7th Grade Math', 'Proportional reasoning', '7.4', 'Use ratios, rates, and percentages to solve problems.'),
    ('7th Grade Math', 'Integer and rational number operations', '7.3', 'Operate fluently with rational numbers.'),
    ('7th Grade RLA', 'Character analysis', '7.R', 'Analyze character motivation, change, and text evidence.'),
    ('7th Grade Science', 'Ecosystems', '7.SCI', 'Explain interactions among organisms and environments.'),
    ('Pre-Algebra Foundations', 'Expressions and equations readiness', 'A.READY.7', 'Translate verbal statements into expressions and equations.'),
    ('Algebra I', 'Linear functions', 'A.3', 'Represent and analyze linear relationships.'),
    ('Algebra I', 'Solve equations', 'A.5', 'Solve one-variable equations and interpret solutions.'),
    ('Geometry', 'Triangle congruence', 'G.6', 'Use congruence criteria and write proofs.'),
    ('Biology', 'Cell structure and energy', 'B.4', 'Explain cell structures and energy transformation.'),
    ('8th Grade Math', 'Proportional relationships', '8.4', 'Represent proportional relationships with graphs, tables, and equations.'),
    ('8th Grade Math', 'Multi-step word problems', '8.8', 'Translate and solve multi-step quantitative problems.'),
    ('8th Grade RLA', 'Compare texts', '8.R', 'Compare claims, evidence, and author purpose across texts.'),
    ('8th Grade Science', 'Experimental design', '8.SCI', 'Evaluate variables, data, and conclusions in investigations.'),
    ('Algebra I Readiness', 'Equation fluency', 'A.READY', 'Use inverse operations to solve basic equations.')
) as kp(subject_title, title, standard_code, description)
  on kp.subject_title = s.title
on conflict do nothing;

alter table public.students enable row level security;
alter table public.subjects enable row level security;
alter table public.knowledge_points enable row level security;
alter table public.diagnostic_sessions enable row level security;
alter table public.mastery_results enable row level security;
alter table public.learning_activities enable row level security;

create policy "Temporary family read students"
on public.students for select
using (true);

create policy "Temporary family read subjects"
on public.subjects for select
using (true);

create policy "Temporary family read knowledge points"
on public.knowledge_points for select
using (true);

create policy "Temporary family manage diagnostic sessions"
on public.diagnostic_sessions for all
using (true)
with check (true);

create policy "Temporary family manage mastery results"
on public.mastery_results for all
using (true)
with check (true);

create policy "Temporary family manage learning activities"
on public.learning_activities for all
using (true)
with check (true);
