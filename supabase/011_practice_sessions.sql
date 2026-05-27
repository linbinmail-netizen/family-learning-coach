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
