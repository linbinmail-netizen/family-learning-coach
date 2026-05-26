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
