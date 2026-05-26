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
