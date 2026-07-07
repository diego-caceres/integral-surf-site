-- Indexes for the foreign-key / lookup columns hit by the nested-select
-- queries introduced in claude-plans/03-eliminate-n-plus-one.md
-- (src/lib/trips.ts#getTripBySlug, src/lib/fundamentos.ts#getFundamentosSections,
-- src/lib/homeSections.ts#getHomeSectionsList). Without these, each nested
-- select is a sequential scan on the child table.
--
-- Confirmed no duplicate `trips.slug` values exist in the live data before
-- adding the unique index (checked via the REST API on 2026-07-07: 13 rows,
-- 0 duplicates).
--
-- NOT YET APPLIED to the live database — see supabase/migrations/README.md
-- for how to run these.

create index if not exists idx_trip_contents_trip_id
  on trip_contents(trip_id);

create index if not exists idx_trip_content_images_content_id
  on trip_content_images(trip_content_id);

create index if not exists idx_home_section_images_section_key
  on home_section_images(section_key);

create index if not exists idx_fundamentos_section_images_section_id
  on fundamentos_section_images(section_id);

create index if not exists idx_fundamentos_team_members_section_id
  on fundamentos_team_members(section_id);

create unique index if not exists uq_trips_slug
  on trips(slug);
