# Plan 03 — Eliminate N+1 Supabase queries (nested selects) + request-level dedup + indexes

**Severity:** High (performance). **Audit refs:** P1, P9, I3.
**Estimated size:** medium (~7 files + 1 SQL migration).

## Background you need

Supabase/PostgREST can fetch parent + children in ONE request using nested selects, and can order the nested rows server-side:

```ts
supabaseServer
  .from("parent")
  .select("*, child_table(*)")
  .order("order_number", { referencedTable: "child_table", ascending: true })
```

The correct pattern already exists in this repo: `src/lib/trips.ts#getTripBySlug` uses
`select("*, trip_contents(*, trip_content_images(*))")` and then sorts nested arrays in memory (belt-and-braces). Copy that style.

Foreign-key relationships assumed (verify in Supabase dashboard before starting):
- `trip_contents.trip_id → trips.id`
- `trip_content_images.trip_content_id → trip_contents.id`
- `home_section_images.section_key → home_sections.section_key` (⚠️ this is a **text key**, not an FK to `id` — if no FK constraint exists, PostgREST nested select won't work for it; see Step 3 fallback)
- `fundamentos_section_images.section_id → fundamentos_sections.id`
- `fundamentos_team_members.section_id → fundamentos_sections.id`

## Implementation steps

### Step 1 — `GET /api/trips/[id]` (admin edit fetch)
`src/app/api/trips/[id]/route.ts` currently does: 1 trip query + 1 contents query + 1 image query **per content**. Replace the whole GET body with one query:

```ts
const { data, error } = await supabaseServer
  .from("trips")
  .select("*, trip_contents(*, trip_content_images(*))")
  .eq("id", id)
  .single();
```

Then reshape to preserve the **exact existing response contract** `{ trip, contents }` (the admin UI `TripEditFetcher` depends on it):
- `trip` = all trip fields WITHOUT `trip_contents`.
- `contents` = trip_contents sorted by `order` asc, each with `images` = its `trip_content_images` sorted by `order_number` asc (rename the key from `trip_content_images` to `images`).
Reuse the sort/rename logic from `getTripBySlug` — better: extract a shared helper `normalizeTripContents(nested)` into `src/lib/trips.ts` and use it in both places.

### Step 2 — `POST /api/trips/[id]/clone`
`src/app/api/trips/[id]/clone/route.ts`: replace the two source reads (trip + contents, then images per content) with the single nested select above. The **write** side (insert per content to capture new ids) is being made transactional in plan 06 — if plan 06 is not yet done, keep writes as-is; just fix the reads.

### Step 3 — Home sections (2 files)
`src/app/api/home-sections/route.ts` and `src/app/api/admin/home-sections/route.ts` GET: replace the per-section image loop with:

```ts
supabaseServer
  .from("home_sections")
  .select("*, home_section_images(*)")
  .order("section_key")
```

**Fallback if the nested select errors** (no FK between the tables because the join key is `section_key` text): fetch both tables in **2 parallel queries** (the pattern already used in `src/app/page.tsx#getHomeSections`) and group in memory. Either way the per-row loop goes away. Rename nested key to `images`, sorted by `order_number`.

### Step 4 — Fundamentos (3 files)
`src/app/fundamentos/page.tsx`, `src/app/api/fundamentos/route.ts`, `src/app/api/admin/fundamentos/route.ts`: replace the per-section (images + team members) loops with:

```ts
supabaseServer
  .from("fundamentos_sections")
  .select("*, fundamentos_section_images(*), fundamentos_team_members(*)")
  .order("order_number", { ascending: true })
```

Sort nested arrays by `order_number` in memory; rename keys to `images` / `team_members` to keep the response/props contracts identical. Note plan 08 wants this logic in ONE shared `src/lib/fundamentos.ts` function — if doing both plans, do plan 08's extraction and fix the N+1 inside the shared function once.

### Step 5 — `/api/trips/slug/[slug]`
If plan 02 deleted it, skip. Otherwise apply the same nested select as Step 1.

### Step 6 — Request-level dedup of `getTripBySlug` (P9)
In `src/lib/trips.ts`:

```ts
import { cache } from "react";
export const getTripBySlug = cache(async (slug: string): Promise<Trip | null> => { ... });
```

(Wrap the existing function; `generateMetadata` and the page component in `src/app/viajes/[slug]/page.tsx` both call it per render — `React.cache` makes the second call free.) Do the same for `getConfigValue`.

### Step 7 — Index audit (I3)
Create `supabase/migrations/<timestamp>_fk_indexes.sql` (or run in the SQL editor and commit the file) with `CREATE INDEX IF NOT EXISTS`:

```sql
create index if not exists idx_trip_contents_trip_id on trip_contents(trip_id);
create index if not exists idx_trip_content_images_content_id on trip_content_images(trip_content_id);
create index if not exists idx_home_section_images_section_key on home_section_images(section_key);
create index if not exists idx_fundamentos_section_images_section_id on fundamentos_section_images(section_id);
create index if not exists idx_fundamentos_team_members_section_id on fundamentos_team_members(section_id);
create unique index if not exists uq_trips_slug on trips(slug);
```

⚠️ Before the unique index: check for duplicate slugs (`select slug, count(*) from trips group by slug having count(*) > 1`). The clone feature appends `-copy-<ts>` so duplicates are unlikely but possible.

## How to measure the gain

1. **Query count:** add temporary logging or use the Supabase dashboard (Reports → API) — record requests per page load before/after. Concretely: load `/admin/trips/edit/<id-of-trip-with-most-contents>` — before: 2 + N requests; after: 1.
2. **Latency:** time the endpoints:
   ```bash
   for i in 1 2 3; do curl -s -o /dev/null -w "%{time_total}\n" http://localhost:3000/api/trips/<id>; done
   ```
   Run 3× before and after; report medians for `/api/trips/[id]`, `/api/fundamentos`, `/api/home-sections`.
3. Record numbers in the PR description.

## Regression safety

- The response **shapes must not change** — that is the whole risk here. For each modified endpoint, capture the JSON before the change (`curl ... | jq -S . > /tmp/before.json`) and diff against after (`jq -S` sorts keys; nested array order must match too).
- Manual smoke: trip edit page loads with contents + slideshow images in the right order; fundamentos page renders sections/images/team; homepage sections render their slideshows; cloning a trip copies contents and images.
- `npm run lint && npm run build` green.
- With plan 11: snapshot tests over the normalization helpers (`normalizeTripContents`) with fixture data including out-of-order children.

## Acceptance criteria

- [ ] No endpoint issues per-row child queries (verify by reading the final code: no `await` inside `.map()` loops for reads).
- [ ] Response JSON byte-identical (modulo key ordering) for all touched endpoints.
- [ ] `getTripBySlug` wrapped in `React.cache`.
- [ ] Index migration file committed; duplicates checked before unique index.
- [ ] Before/after query counts and latencies recorded.
