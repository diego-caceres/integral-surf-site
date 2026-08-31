-- Atomic homepage header-image update: replaces the web/mobile slideshow
-- image sets in one transaction.
--
-- Fixes B11: the previous application code in
-- src/app/api/admin/section-header-images/route.ts (PUT) deleted all rows
-- then inserted the new web+mobile lists as separate requests. If the insert
-- failed, the homepage hero would be left with no images at all.
--
-- NOT YET WIRED UP: see claude-plans/06-atomic-writes-and-not-in-fix.md.
-- Once applied, switch the route to
-- `supabaseServer.rpc("update_section_header_images_transactional", {...})`.

create or replace function update_section_header_images_transactional(
  p_web jsonb,
  p_mobile jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_image jsonb;
  v_idx int;
begin
  delete from section_header_images;

  v_idx := 1;
  for v_image in select * from jsonb_array_elements(coalesce(p_web, '[]'::jsonb))
  loop
    if v_image->>'image_url' is not null and v_image->>'image_url' <> '' then
      insert into section_header_images (image_url, alt_text, device_type, display_order)
      values (v_image->>'image_url', v_image->>'alt_text', 'web', v_idx);
      v_idx := v_idx + 1;
    end if;
  end loop;

  v_idx := 1;
  for v_image in select * from jsonb_array_elements(coalesce(p_mobile, '[]'::jsonb))
  loop
    if v_image->>'image_url' is not null and v_image->>'image_url' <> '' then
      insert into section_header_images (image_url, alt_text, device_type, display_order)
      values (v_image->>'image_url', v_image->>'alt_text', 'mobile', v_idx);
      v_idx := v_idx + 1;
    end if;
  end loop;
end;
$$;

grant execute on function update_section_header_images_transactional(jsonb, jsonb) to service_role;
