-- Track which affiliate link drove each registration (samad or mehdi).

alter table public.registrations
  add column if not exists ref text
  check (ref is null or ref in ('samad', 'mehdi'));

create index if not exists registrations_ref_idx on public.registrations (ref);
