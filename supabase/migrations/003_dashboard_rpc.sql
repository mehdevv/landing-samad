-- Password-protected dashboard access (change the default secret after deploy).

create table if not exists public.dashboard_secrets (
  id int primary key default 1 check (id = 1),
  secret text not null
);

insert into public.dashboard_secrets (id, secret)
values (1, 'vibe-live-2026')
on conflict (id) do nothing;

alter table public.dashboard_secrets enable row level security;

create or replace function public.get_dashboard_data(p_secret text)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  result json;
begin
  if not exists (select 1 from public.dashboard_secrets where secret = p_secret) then
    raise exception 'Invalid dashboard password';
  end if;

  select json_build_object(
    'total', (select count(*)::int from public.registrations),
    'by_ref', coalesce((
      select json_object_agg(ref_key, cnt)
      from (
        select coalesce(ref, 'direct') as ref_key, count(*)::int as cnt
        from public.registrations
        group by coalesce(ref, 'direct')
      ) counts
    ), '{}'::json),
    'registrations', coalesce((
      select json_agg(row_data order by created_at desc)
      from (
        select json_build_object(
          'id', id,
          'created_at', created_at,
          'first_name', first_name,
          'last_name', last_name,
          'phone', phone,
          'email', email,
          'reason', reason,
          'ref', ref
        ) as row_data,
        created_at
        from public.registrations
      ) rows
    ), '[]'::json)
  ) into result;

  return result;
end;
$$;

revoke all on function public.get_dashboard_data(text) from public;
grant execute on function public.get_dashboard_data(text) to anon, authenticated;
