-- Atomic About-page update: hero fields + instructor list in one transaction.
--
-- Fixes B11: the previous application code in
-- src/app/api/admin/about/route.ts (PUT) did `delete from about_instructors`
-- then inserted the new list as two separate, unrelated requests. If the
-- insert failed (bad row, network blip), the site was left with ZERO
-- instructors until the admin retried.
--
-- NOT YET WIRED UP: see claude-plans/06-atomic-writes-and-not-in-fix.md.
-- Once applied, switch the route to
-- `supabaseServer.rpc("update_about_transactional", {...})`.
--
-- Assumes a single row in about_page (matches the existing `.single()` read).

create or replace function update_about_transactional(
  p_hero_title text,
  p_hero_description_1 text,
  p_hero_description_2 text,
  p_instructors jsonb
)
returns about_page
language plpgsql
security definer
set search_path = public
as $$
declare
  v_about about_page;
  v_instructor jsonb;
begin
  update about_page
  set
    hero_title = p_hero_title,
    hero_description_1 = p_hero_description_1,
    hero_description_2 = p_hero_description_2,
    updated_at = now()
  returning * into v_about;

  if not found then
    raise exception 'about_page row not found';
  end if;

  delete from about_instructors;

  for v_instructor in select * from jsonb_array_elements(coalesce(p_instructors, '[]'::jsonb))
  loop
    insert into about_instructors (name, description, image_url, order_number)
    values (
      v_instructor->>'name',
      v_instructor->>'description',
      v_instructor->>'image_url',
      coalesce((v_instructor->>'order_number')::int, 0)
    );
  end loop;

  return v_about;
end;
$$;

grant execute on function update_about_transactional(text, text, text, jsonb) to service_role;
