# Plan 02 — Slim & filter the public trips API; split admin listing; cache public content APIs

**Severity:** High (security + performance). **Audit refs:** S2, P3, P12.
**Estimated size:** medium (~8 files).

## Background you need

- `GET /api/trips` (`src/app/api/trips/route.ts`) returns `select("*")` for ALL trips **including soft-deleted ones** (`is_deleted: true`). It is publicly cached (`Cache-Control: public, s-maxage=300`).
- Consumers today:
  - `src/lib/tripsCache.ts` → used by `Navbar.tsx` (menu links) and `SectionCalendar.tsx` (homepage/viajes trip cards). These filter `is_deleted` **client-side** and use ~8 fields: `id, slug, title, title_2, destiny, coaching_subtitle, date_month, date_days, date_month_2, date_days_2, order, is_deleted`.
  - `src/app/admin/trips/page.tsx` → the admin list, which **needs** deleted trips (it has a "Mostrar Eliminados" toggle).
  - `src/components/trips/TripEditFetcher.tsx` uses `/api/trips/[id]`, not this route.
- The `includeContents=true` query param on `GET /api/trips` — grep shows no callers (`grep -rn "includeContents" src`). Confirm and remove.
- Note: if plan 04 (server-render homepage data) is done first, the public consumers of `/api/trips` disappear entirely; this plan is still needed for the admin split and to keep the public API sane for any external consumers. Coordinate: do plan 04 and 02 in either order, but re-check consumer lists after each.

## Implementation steps

### Step 1 — Create an authenticated admin listing endpoint
New file `src/app/api/admin/trips/route.ts`:

```ts
import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { apiError } from "@/lib/apiError";
import { isAuthenticatedRequest } from "@/lib/auth";

export async function GET(request: NextRequest) {
  if (!(await isAuthenticatedRequest(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { data, error } = await supabaseServer
    .from("trips")
    .select(
      "id, slug, title, title_2, destiny, date_month, date_days, date_month_2, date_days_2, order, is_deleted"
    )
    .order("order", { ascending: true });
  if (error) return apiError("GET /api/admin/trips:", error);
  return NextResponse.json(data);
}
```

(Middleware already protects `/api/admin/*` — the in-handler check is defense in depth, consistent with sibling routes.)

### Step 2 — Point the admin UI at it
In `src/app/admin/trips/page.tsx`, change `fetch("/api/trips")` to `fetch("/api/admin/trips")`. The local `Trip` type in that file already matches the selected columns.

### Step 3 — Harden the public listing
Rewrite `GET` in `src/app/api/trips/route.ts`:

- Filter: `.eq("is_deleted", false)`.
- Column list instead of `*`:
  `id, slug, title, title_2, destiny, coaching_subtitle, date_month, date_days, date_month_2, date_days_2, order`.
- Remove the `includeContents` branch (after confirming zero callers per Background).
- Keep the existing `READ_CACHE` header.

Client fallout to update in the same commit:
- `src/components/home/SectionCalendar.tsx` and `src/components/layout/Navbar.tsx`: remove the now-unnecessary `.filter((t) => !t.is_deleted)` calls (harmless if left, but dead).
- `src/lib/tripsCache.ts`: the cached type is `Trip[]`; the payload no longer satisfies the full `Trip` type. Define a `TripSummary` type (in `src/types/trip.ts`) with the selected columns and use it in `tripsCache.ts`, `SectionCalendar.tsx`, `Navbar.tsx`, `TripCard.tsx` (TripCard uses only summary fields — verify by reading it).
- **localStorage staleness:** bump the cache key in `tripsCache.ts` from `"integral_trips_cache"` to `"integral_trips_cache_v2"` so returning visitors don't render from an old full-fat cached array with deleted trips.

### Step 4 — Filter deleted trips in the by-slug API (or delete it)
`src/app/api/trips/slug/[slug]/route.ts` returns deleted trips and appears unused (`grep -rn "trips/slug" src` — only the route itself). If truly unused, **delete the file**. If kept, add `.eq("is_deleted", false)` and replace raw `error.message` responses with `apiError()`.

### Step 5 — Uniform CDN caching for public content APIs (P12)
Create `src/lib/httpCache.ts`:

```ts
/** Edge-cache public content reads; content changes rarely and mutations
 *  revalidate pages, not these APIs, so short TTL + SWR is the right tradeoff. */
export const READ_CACHE = "public, s-maxage=300, stale-while-revalidate=600";
```

Import it and add `{ headers: { "Cache-Control": READ_CACHE } }` to the success `NextResponse.json` of:
- `/api/menu-images`
- `/api/section-header-images`
- `/api/instagram-posts`
- `/api/home-sections`
- `/api/about`
- `/api/fundamentos`

Remove the local `READ_CACHE` constant from `src/app/api/trips/route.ts` in favor of the shared one. **Do NOT** add cache headers to any `/api/admin/*` route or to error responses.

## How to measure the gain

Before and after, with the dev server (or better, a preview deploy):

```bash
# Payload size
curl -s http://localhost:3000/api/trips | wc -c
# Expect a large reduction (all section_* HTML fields gone). Record both numbers.

# Deleted-trip exposure (should return [] entries only with is_deleted absent/false)
curl -s http://localhost:3000/api/trips | jq '[.[] | select(.is_deleted == true)] | length'
# Before: >0 if any deleted trips exist. After: field not present / 0.

# Cache headers now present
for p in menu-images section-header-images instagram-posts home-sections about fundamentos; do
  curl -sI http://localhost:3000/api/$p | grep -i cache-control;
done
```

On production (Vercel), after deploy check `x-vercel-cache: HIT` on second request to these endpoints.

## Regression safety

- Manual smoke: homepage calendar renders trips; navbar mega-menu lists destinations; `/viajes` renders; admin trips list shows both active and deleted trips with the toggle; edit/clone/delete/restore still work from the admin list.
- `npm run lint && npm run build` green.
- With plan 11 in place: API tests asserting (a) public `/api/trips` contains no `is_deleted:true` rows and no `section_1_description` key, (b) `/api/admin/trips` 401s without cookie.

## Acceptance criteria

- [ ] Public `/api/trips` returns only active trips with the summary column set.
- [ ] Admin list uses `/api/admin/trips` and still shows deleted trips.
- [ ] `/api/trips/slug/[slug]` deleted or fixed.
- [ ] All six public content APIs send `Cache-Control` with `s-maxage`.
- [ ] Payload size reduction recorded in the PR description.
