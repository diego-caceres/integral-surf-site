-- Atomic Fundamentos-page update: sections + section images + team members
-- in one transaction.
--
-- Fixes B11: the previous application code in
-- src/app/api/admin/fundamentos/route.ts (PUT) deleted THREE tables
-- (fundamentos_team_members, fundamentos_section_images,
-- fundamentos_sections — in that order, to respect FKs) before inserting
-- anything back. This is the most dangerous of the delete-all-then-reinsert
-- handlers: any failure after the deletes and before the inserts complete
-- leaves the live Fundamentos page completely empty.
--
-- NOT YET WIRED UP: see claude-plans/06-atomic-writes-and-not-in-fix.md.
-- Once applied, switch the route to
-- `supabaseServer.rpc("update_fundamentos_transactional", {...})`.

create or replace function update_fundamentos_transactional(
  p_sections jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_section jsonb;
  v_section_id uuid;
  v_image jsonb;
  v_member jsonb;
begin
  delete from fundamentos_team_members;
  delete from fundamentos_section_images;
  delete from fundamentos_sections;

  for v_section in select * from jsonb_array_elements(coalesce(p_sections, '[]'::jsonb))
  loop
    insert into fundamentos_sections (title, description, order_number)
    values (
      v_section->>'title',
      v_section->>'description',
      coalesce((v_section->>'order_number')::int, 0)
    )
    returning id into v_section_id;

    for v_image in select * from jsonb_array_elements(coalesce(v_section->'images', '[]'::jsonb))
    loop
      insert into fundamentos_section_images (section_id, image_url, alt_text, order_number)
      values (
        v_section_id,
        v_image->>'image_url',
        v_image->>'alt_text',
        coalesce((v_image->>'order_number')::int, 0)
      );
    end loop;

    for v_member in select * from jsonb_array_elements(coalesce(v_section->'team_members', '[]'::jsonb))
    loop
      insert into fundamentos_team_members (section_id, name, description, image_url, order_number)
      values (
        v_section_id,
        v_member->>'name',
        v_member->>'description',
        v_member->>'image_url',
        coalesce((v_member->>'order_number')::int, 0)
      );
    end loop;
  end loop;
end;
$$;

grant execute on function update_fundamentos_transactional(jsonb) to service_role;
