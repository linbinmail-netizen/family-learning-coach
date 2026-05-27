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
