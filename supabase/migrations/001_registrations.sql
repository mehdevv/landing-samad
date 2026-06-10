-- Run this in Supabase Dashboard → SQL Editor if registration fails.

create table if not exists public.registrations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  first_name text not null,
  last_name text not null,
  phone text not null,
  email text not null,
  reason text not null
);

alter table public.registrations enable row level security;

drop policy if exists "Anyone can register for the live event" on public.registrations;
create policy "Anyone can register for the live event"
  on public.registrations
  for insert
  to anon, authenticated
  with check (true);

grant insert on public.registrations to anon, authenticated;
