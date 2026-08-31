# Plan 04 — Server-render homepage & navbar data (kill client fetch + localStorage cache)

**Severity:** High (performance / SEO / UX). **Audit refs:** P2, P4, I10, B6.
**Estimated size:** medium (~7 files; deletes ~120 lines).

## Background you need

- `/` and `/viajes` are already **static (ISR, 1h)** per the build output, and trip mutations already call `revalidatePath("/")` and `revalidatePath("/viajes")` (`src/lib/revalidate.ts`). So server-rendering trip data on these pages is safe and refreshes correctly.
- Today the trip cards and nav menu are fetched **client-side after hydration**:
  - `src/components/home/SectionCalendar.tsx` (used on `/` and `/viajes`) fetches `/api/trips` + `/api/config/menu_destinos_title`, shows a `LogoLoader` spinner, reads/writes `localStorage`.
  - `src/components/layout/Navbar.tsx` fetches `/api/trips`, `/api/menu-images`, `/api/config/menu_destinos_title`.
  - Both go through `src/lib/tripsCache.ts` (module-singleton promises + localStorage).
- Costs: trips invisible to crawlers, spinner/CLS, stale-cache flashes, 3 extra round-trips, and cache code to maintain.
- `SectionHeader.tsx` already accepts server data as props (`initialWebImages`, etc.) AND does a background client refresh with its own localStorage cache — good template, but the refresh is now redundant once data is server-rendered + ISR'd. Keep its props path; the client refresh can be simplified later (out of scope, note it).

## Target architecture

Fetch trips (summary columns), `menu_destinos_title`, and menu images **once on the server**, pass down as props. Convert `SectionCalendar` and the `Navbar` trip/menu rendering to accept props. Keep `Navbar` a client component (it needs scroll/drawer state) but feed it server-fetched data via a thin server wrapper.

## Implementation steps

### Step 1 — Server data helpers
Add to `src/lib/trips.ts` (or a new `src/lib/homeData.ts`), all using `supabaseServer` directly (no HTTP self-fetch):

```ts
export const getActiveTripSummaries = cache(async (): Promise<TripSummary[]> => {
  const { data } = await supabaseServer
    .from("trips")
    .select("id, slug, title, title_2, destiny, coaching_subtitle, date_month, date_days, date_month_2, date_days_2, order")
    .eq("is_deleted", false)
    .order("order", { ascending: true });
  return data ?? [];
});
```

`getCachedConfigValue("menu_destinos_title")` already exists for the title. For menu images, add `getMenuImages()` returning the same grouped shape `/api/menu-images` produces (reuse its reduce logic; better — extract that logic to a shared function per plan 08).

Define `TripSummary` in `src/types/trip.ts` (coordinate with plan 02).

### Step 2 — `SectionCalendar` → presentational
- Change signature to `SectionCalendar({ trips, title }: { trips: TripSummary[]; title: string })`.
- Remove `useEffect`, `useState`, fetch calls, loading/error states, and the `tripsCache` imports. Keep the pure layout logic (the split/interleave into columns).
- It can stop being a client component (`"use client"`) — it has no interactivity. Remove the directive.

### Step 3 — Wire pages
- `src/app/page.tsx`: add `getActiveTripSummaries()` and `getCachedConfigValue("menu_destinos_title")` to the existing `Promise.all`, pass to `<SectionCalendar trips={...} title={...} />`.
- `src/app/viajes/page.tsx`: currently just renders `<SectionCalendar />`. Make it `async`, fetch the same data, pass props. Keep its `metadata` export.

### Step 4 — Navbar data via server wrapper
`Navbar` is rendered in `src/app/layout.tsx` (a server component). Create a server component `src/components/layout/NavbarData.tsx`:

```tsx
export default async function NavbarData() {
  const [trips, destinosTitle, menuImages] = await Promise.all([
    getActiveTripSummaries(),
    getCachedConfigValue("menu_destinos_title"),
    getMenuImages(),
  ]);
  return <Navbar initialTrips={trips} initialDestinosTitle={destinosTitle ?? "DESTINOS 2026"} initialMenuImages={menuImages} />;
}
```

In `layout.tsx` render `<NavbarData />` instead of `<Navbar />`. In `Navbar.tsx`:
- Accept the three new props; initialize the existing `useState` from them instead of `""`/`{}`.
- Remove the `useEffect` that fetches trips/title/menu-images and the `tripsCache` imports. **Keep** the scroll and drawer/focus-trap effects.

### Step 5 — Delete the client cache
Delete `src/lib/tripsCache.ts`. Confirm no remaining imports (`grep -rn "tripsCache" src` → empty). `SectionHeader`'s own `HEADER_CACHE_KEY` localStorage code is separate — leave it for now (its data is already passed as props from `page.tsx`; a follow-up can drop the refresh).

### Step 6 — Centralize the WhatsApp default phone (B6)
In `src/lib/site.ts` add `export const DEFAULT_WHATSAPP_PHONE = "+59899748323";`. Replace the four hardcoded copies in `WhatsAppButton.tsx`, `PriceComponent.tsx`, `src/app/viajes/[slug]/page.tsx` (`DEFAULT_PHONE`), and `Footer.tsx` (`DEFAULT_PHONE`). Prefer passing the server-fetched phone number down as props (page.tsx already fetches it for trip pages) so client components don't self-fetch `/api/config/whatsapp_phone_number` — but that client fetch can stay if prop-drilling is too invasive; at minimum dedupe the constant.

## How to measure the gain

1. **SEO / SSR:** `curl -s http://localhost:3000/ | grep -c "viajes/"` — before: 0 trip links in HTML (rendered client-side); after: one per active trip. Same for `/viajes`.
2. **Network waterfall:** DevTools Network on `/` — before: XHR to `/api/trips`, `/api/menu-images`, `/api/config/menu_destinos_title` after load; after: none of these on initial render.
3. **No spinner / CLS:** the calendar section renders immediately; confirm no `LogoLoader` flash.
4. **Lighthouse** (mobile) before/after on `/` and `/viajes`: record Performance + LCP. Expect LCP and TBT improvement from removing hydration-time fetches.

## Regression safety

- Visual smoke: `/`, `/viajes`, and the navbar mega-menu (desktop) + mobile drawer render identical trip lists and destino title. Deleted trips must not appear.
- Edit a trip in admin → after `revalidatePath` the homepage/viajes reflect the change within a request or two (ISR). Verify by editing a title and reloading.
- `npm run lint && npm run build` green; build output should now show `/viajes` still static.
- With plan 11: a Playwright test asserting trip links exist in the server HTML of `/` (fetch the page, check markup) guards against regressing to client-only rendering.

## Acceptance criteria

- [ ] Trip cards and nav menu render from server data (present in initial HTML).
- [ ] `src/lib/tripsCache.ts` deleted; no dangling imports.
- [ ] No client XHR to `/api/trips` / `/api/menu-images` on `/` or `/viajes`.
- [ ] WhatsApp default phone defined once.
- [ ] Lighthouse LCP before/after recorded.
