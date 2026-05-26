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
