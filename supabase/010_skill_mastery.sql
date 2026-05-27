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
