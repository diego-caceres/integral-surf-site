-- Atomic trip update: trip fields + content blocks + content images in one
-- transaction. Fixes two bugs present in the previous application-layer
-- implementation (src/app/api/trips/[id]/route.ts PUT, pre-fix):
--
--   1. Removed content blocks were never actually deleted: the app code used
--      `.not("id", "in", contentIds)` with a raw JS array, but PostgREST's
--      `not()` filter requires a pre-formatted string like "(id1,id2)" for
--      the `in` operator — an array serializes incorrectly and the delete
--      silently matched nothing.
--   2. The multi-step write (trip update -> delete stale contents -> per
--      content upsert -> delete/insert images) was not transactional: a
--      failure partway through left the trip half-updated.
--
-- NOT YET WIRED UP: the route handler currently contains an app-layer fix for
-- bug (1) only (see claude-plans/06-atomic-writes-and-not-in-fix.md and the
-- PUT handler in src/app/api/trips/[id]/route.ts). Once this migration has
-- been applied to the live database, the route can be switched to call this
-- RPC via `supabaseServer.rpc("update_trip_transactional", {...})` instead of
-- the imperative loop, for full atomicity.
--
-- Assumes the caller always sends the COMPLETE trip object as `p_trip`
-- (this matches how the admin edit form works today — it round-trips the
-- entire Trip shape) since jsonb_to_record fills any missing key with NULL.

create or replace function update_trip_transactional(
  p_trip_id uuid,
  p_trip jsonb,
  p_contents jsonb
)
returns trips
language plpgsql
security definer
set search_path = public
as $$
declare
  v_trip trips;
  v_content jsonb;
  v_content_id uuid;
  v_image jsonb;
  v_image_idx int;
begin
  update trips t
  set
    slug = x.slug,
    title = x.title,
    title_2 = x.title_2,
    top_subtitle = x.top_subtitle,
    destiny = x.destiny,
    coaching_subtitle = x.coaching_subtitle,
    date_month = x.date_month,
    date_days = x.date_days,
    date_month_2 = x.date_month_2,
    date_days_2 = x.date_days_2,
    header_image = x.header_image,
    header_mobile_image = x.header_mobile_image,
    header_video = x.header_video,
    price_promo = x.price_promo,
    price_final = x.price_final,
    price_promo_message = x.price_promo_message,
    price_final_message = x.price_final_message,
    section_1_title = x.section_1_title,
    section_1_description = x.section_1_description,
    section_1_subdescription = x.section_1_subdescription,
    section_1_image = x.section_1_image,
    section_2_title = x.section_2_title,
    section_2_description = x.section_2_description,
    section_2_image = x.section_2_image,
    section_video_title = x.section_video_title,
    section_video_description = x.section_video_description,
    section_video_url = x.section_video_url,
    final_img_1 = x.final_img_1,
    final_img_2 = x.final_img_2,
    "order" = x."order",
    updated_at = now()
  from jsonb_to_record(p_trip) as x(
    slug text, title text, title_2 text, top_subtitle text, destiny text,
    coaching_subtitle text, date_month text, date_days text,
    date_month_2 text, date_days_2 text, header_image text,
    header_mobile_image text, header_video text, price_promo numeric,
    price_final numeric, price_promo_message text, price_final_message text,
    section_1_title text, section_1_description text,
    section_1_subdescription text, section_1_image text,
    section_2_title text, section_2_description text, section_2_image text,
    section_video_title text, section_video_description text,
    section_video_url text, final_img_1 text, final_img_2 text, "order" int
  )
  where t.id = p_trip_id
  returning t.* into v_trip;

  if not found then
    raise exception 'Trip % not found', p_trip_id using errcode = 'P0002';
  end if;

  -- Delete content blocks no longer present in the incoming list. Native
  -- `not in` on a set derived from jsonb_array_elements — no string
  -- formatting footgun, unlike the PostgREST `.not(..., "in", ...)` filter.
  delete from trip_contents tc
  where tc.trip_id = p_trip_id
    and tc.id not in (
      select (c->>'id')::uuid
      from jsonb_array_elements(coalesce(p_contents, '[]'::jsonb)) c
      where c ? 'id' and c->>'id' is not null
    );

  for v_content in select * from jsonb_array_elements(coalesce(p_contents, '[]'::jsonb))
  loop
    if v_content ? 'id' and v_content->>'id' is not null then
      v_content_id := (v_content->>'id')::uuid;
      update trip_contents set
        title = v_content->>'title',
        subtitle = nullif(v_content->>'subtitle', ''),
        description = v_content->>'description',
        subtitle_2 = nullif(v_content->>'subtitle_2', ''),
        description_2 = nullif(v_content->>'description_2', ''),
        image_url = v_content->>'image_url'
      where id = v_content_id;
    else
      insert into trip_contents (trip_id, title, subtitle, description, subtitle_2, description_2, image_url)
      values (
        p_trip_id,
        v_content->>'title',
        nullif(v_content->>'subtitle', ''),
        v_content->>'description',
        nullif(v_content->>'subtitle_2', ''),
        nullif(v_content->>'description_2', ''),
        v_content->>'image_url'
      )
      returning id into v_content_id;
    end if;

    delete from trip_content_images where trip_content_id = v_content_id;

    v_image_idx := 0;
    for v_image in select * from jsonb_array_elements(coalesce(v_content->'images', '[]'::jsonb))
    loop
      insert into trip_content_images (trip_content_id, image_url, alt_text, order_number)
      values (v_content_id, v_image->>'image_url', v_image->>'alt_text', v_image_idx);
      v_image_idx := v_image_idx + 1;
    end loop;
  end loop;

  return v_trip;
end;
$$;

grant execute on function update_trip_transactional(uuid, jsonb, jsonb) to service_role;
