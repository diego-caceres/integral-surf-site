# Plan 06 — Atomic admin writes (Postgres RPCs) + fix the silent content-delete bug (B2, B11)

**Severity:** High (data loss / correctness). **Audit refs:** B2, B11, P8, I7.
**Estimated size:** medium (~5 route files + several SQL functions). Requires Supabase SQL access.

## Background you need

Two classes of data-integrity bug:

**B2 — trip update:** `src/app/api/trips/[id]/route.ts` PUT deletes removed content blocks with:
```ts
.not("id", "in", contentIds)   // contentIds is a JS array
```
postgrest-js expects a string like `"(id1,id2)"` for `in`; an array produces an invalid filter that PostgREST rejects, **and the result is unchecked** → removed content blocks are never deleted (they reappear on the public page). The multi-step write (trip update → delete stale contents → per-content upsert → per-content image delete/insert) is also non-transactional; a crash mid-loop leaves a half-updated trip.

**B11 — delete-all-then-reinsert:** `/api/admin/about`, `/api/admin/fundamentos`, `/api/admin/section-header-images` delete ALL rows then insert the payload with no transaction. An insert failure leaves the live site with **zero** instructors / fundamentos / header images.

**The repo already has the right pattern:** `src/app/api/admin/menu-images/route.ts` calls an RPC `update_menu_items_transactional(payload_data jsonb)` (the SQL is in a comment at the bottom of that file). We replicate that approach.

## Implementation steps

> Work in `supabase/migrations/` so the functions are version-controlled (I7). If the Supabase CLI isn't set up, create the functions in the SQL editor AND commit the `.sql` file. Each function runs in a single implicit transaction (a Postgres function body is atomic), which is exactly what we need.

### Step 1 — `update_trip_transactional` (fixes B2)
Create a function taking the trip id, the trip fields (jsonb), and the contents array (jsonb, each with optional `id`, fields, and `images` array). Inside:
1. `UPDATE trips SET ... WHERE id = p_id`.
2. Delete `trip_contents` for this trip whose id is **not** in the set of incoming content ids (do it in SQL where `in`/`not in` are native and correct):
   ```sql
   delete from trip_contents tc
   where tc.trip_id = p_id
     and tc.id not in (select (c->>'id')::uuid from jsonb_array_elements(p_contents) c where c ? 'id' and c->>'id' is not null);
   ```
   (When there are no incoming ids, this deletes all — matching the current intended behavior.)
3. For each incoming content: if it has an `id`, UPDATE; else INSERT and capture the new id.
4. For each content: delete its `trip_content_images` and re-insert from the content's `images` array with `order_number = ordinality - 1`.
Return the updated trip row (jsonb) so the route can return it.

The route handler becomes: validate → `supabaseServer.rpc("update_trip_transactional", {...})` → on error `apiError(...)` → `revalidateTripPages()` → return. All the imperative loops in the PUT handler are deleted.

### Step 2 — `update_about_transactional` (fixes B11 for about)
Function takes `hero_title`, `hero_description_1/2`, and `instructors` jsonb array. Inside one transaction: update the single `about_page` row, `delete from about_instructors`, then insert the new instructors with `order_number`. Route calls the RPC.

### Step 3 — `update_fundamentos_transactional` (fixes B11 for fundamentos)
Function takes `sections` jsonb (each with `title`, `description`, `order_number`, `images[]`, `team_members[]`). Inside one transaction: delete team members, section images, sections (respect FK order), then insert sections and, per inserted section id, its images and team members. Route calls the RPC. This replaces the most dangerous handler (3 deletes before any insert).

### Step 4 — `update_section_header_images_transactional` (fixes B11 for header images)
Function takes `web` and `mobile` jsonb arrays. One transaction: delete all `section_header_images`, insert web rows (`device_type='web'`, `display_order = ordinality`) then mobile rows. Route calls the RPC.

### Step 5 — Clone (P8, optional consolidation)
`POST /api/trips/[id]/clone` can also become an RPC `clone_trip(p_source_id, p_new_slug, p_new_title)` that copies trip + contents + images in one transaction and returns the new trip. Nice-to-have; lower risk than the others since clone failures don't corrupt existing data. Do it if time allows.

### Step 6 — Error handling
All these routes must return via `apiError()` (plan 08) rather than leaking `error.message`. RPC errors surface as `error` on the `supabaseServer.rpc(...)` result.

## How to verify (behavioral — this is correctness)

**B2 reproduction (do before the fix to confirm):**
1. Create/pick a trip with 2 content blocks. Edit it in admin, remove the 2nd block, save.
2. Before fix: reload the public trip page → the removed block **still shows** (delete silently failed). Also check DB: `select count(*) from trip_contents where trip_id = '<id>'` → still 2.
3. After fix: removed block is gone from the page and DB shows 1.

**Atomicity test (about/fundamentos/header):**
- Temporarily make one insert fail (e.g. send an instructor with a NULL required field via curl) and confirm the existing rows are **still present** afterward (transaction rolled back), instead of everything wiped. Then remove the bad input.
  ```bash
  curl -s -X PUT http://localhost:3000/api/admin/about \
    -H 'Content-Type: application/json' -H "Cookie: integralsurf-admin-auth=<valid>" \
    -d '{"hero_title":"x","hero_description_1":"y","hero_description_2":"z","instructors":[{"name":null,"description":"d","image_url":"u","order_number":0}]}'
  # Expect: 4xx/5xx AND `select count(*) from about_instructors` unchanged from before.
  ```

**Happy path:** normal save of each admin form works and content updates correctly.

## Regression safety

- Keep the HTTP request/response contracts identical (routes accept the same JSON bodies, return the same success shapes) so the admin UIs need no changes.
- The functions replace behavior that was already destructive; the risk is a bug in the SQL. Mitigate: test each RPC in the Supabase SQL editor with a sample payload before wiring the route.
- `npm run lint && npm run build` green.
- With plan 11: integration tests that (a) removing a content block deletes it, (b) a failing partial write leaves prior data intact (transaction). Seed a disposable trip in a test project.

## Acceptance criteria

- [ ] Removing content blocks from a trip actually deletes them (DB verified).
- [ ] About / Fundamentos / Header-image saves are atomic (verified via forced-failure test).
- [ ] All four (five) admin write paths go through a single RPC each.
- [ ] SQL functions committed under `supabase/`.
- [ ] No `error.message` leaked from these routes.
