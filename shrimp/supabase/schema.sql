-- Shrimp: accounts and progress sync.
-- Run this once in the Supabase SQL editor (Dashboard → SQL Editor → New query → paste → Run).

-- Public profile: one row per user, created automatically on sign-up.
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text check (char_length(display_name) between 1 and 24),
  created_at timestamptz not null default now()
);

-- Each user's full progress document, plus two columns lifted out for leaderboards.
create table if not exists public.progress (
  user_id uuid primary key references auth.users (id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  xp integer not null default 0,
  streak integer not null default 0,
  updated_at timestamptz not null default now()
);
create index if not exists progress_xp_idx on public.progress (xp desc);

-- Row-level security: users can only touch their own rows.
alter table public.profiles enable row level security;
alter table public.progress enable row level security;

drop policy if exists "profiles are readable by everyone" on public.profiles;
create policy "profiles are readable by everyone" on public.profiles for select using (true);
drop policy if exists "users manage their own profile" on public.profiles;
create policy "users manage their own profile" on public.profiles for all using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "users read their own progress" on public.progress;
create policy "users read their own progress" on public.progress for select using (auth.uid() = user_id);
drop policy if exists "users write their own progress" on public.progress;
create policy "users write their own progress" on public.progress for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Create a profile row when a user signs up.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id) values (new.id) on conflict (id) do nothing;
  return new;
end;
$$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Leaderboard: display name, xp and streak only. The view runs with the owner's rights, so it
-- can read every progress row, but it exposes nothing else from the progress document.
create or replace view public.leaderboard as
  select p.id as user_id, coalesce(p.display_name, 'Anonymous shrimp') as display_name, g.xp, g.streak, g.updated_at
  from public.progress g join public.profiles p on p.id = g.user_id
  order by g.xp desc;
grant select on public.leaderboard to anon, authenticated;
