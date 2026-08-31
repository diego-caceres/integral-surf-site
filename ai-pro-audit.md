# AI Pro Audit — Integral Surf Site

**Date:** 2026-07-07
**Scope:** Full codebase review — performance, code quality, simplification opportunities, infrastructure usage (Supabase / Cloudinary / Vercel / GTM / Next.js), bugs & security, and product opportunities.
**Method:** Every file under `src/` was read; a production build was run to confirm route rendering modes; claims about caching/rendering behavior below are based on the actual build output, not assumptions.
**Companion documents:** each key finding has a detailed implementation plan in [`claude-plans/`](claude-plans/). Finding IDs (S1, B2, P3, …) are referenced from those plans.

> Note: `docs/audit-2026-05-08 v2.md` is an earlier **design/accessibility** audit. This document deliberately focuses on engineering concerns and only repeats a11y items where they intersect with code changes proposed here.

---

## Build-verified rendering facts (baseline)

From `npm run build` (2026-07-07):

| Route | Mode | Revalidate |
|---|---|---|
| `/`, `/about`, `/fundamentos`, `/viajes` | Static (prerendered) | 1h (inherited from `unstable_cache` in Footer) |
| `/viajes/[slug]` | SSG via `generateStaticParams` | 1h (explicit) |
| All `/admin/*` pages | Dynamic | — |
| All `/api/*` route handlers | Dynamic | — |

Key consequence: **public pages are served statically and only refresh hourly unless something calls `revalidatePath`** — and today only trip mutations do (`src/lib/revalidate.ts`). Edits to About, Fundamentos, Home sections, header images, menu images and Instagram posts do **not** trigger revalidation (see I2/B3).

---

## Executive summary — prioritized

| # | Finding | Type | Severity | Plan |
|---|---------|------|----------|------|
| S1 | `POST /api/configurations` is reachable **without authentication** (middleware matcher gap) | Security | **Critical** | [01](claude-plans/01-close-unauthenticated-config-endpoint.md) |
| B2 | `PUT /api/trips/[id]` silently fails to delete removed content blocks (malformed `.not("id","in",…)` filter, error ignored); whole update is non-atomic | Bug / data loss | **High** | [06](claude-plans/06-atomic-writes-and-not-in-fix.md) |
| B3 | Homepage header title reads from `configurations` table while the rest of the app uses `general_configurations` — two sources of truth for the same value | Bug | High | [05](claude-plans/05-on-demand-revalidation.md) |
| I2 | Admin edits to About/Fundamentos/Home sections/menu images/header images never call `revalidatePath` → up to 1h of stale content | Infra misuse | High | [05](claude-plans/05-on-demand-revalidation.md) |
| S2/P3 | Public `GET /api/trips` returns soft-deleted trips and every column (all section HTML) — info disclosure + oversized payloads, CDN-cached publicly | Security + Perf | High | [02](claude-plans/02-slim-public-trips-api.md) |
| P1 | N+1 query patterns in 6 endpoints/pages (trip-by-id, trip-by-slug, home-sections ×2, fundamentos ×2, clone) | Performance | High | [03](claude-plans/03-eliminate-n-plus-one.md) |
| P2 | Homepage/menu data fetched client-side (spinner + localStorage cache) although server components already have it | Performance / UX | High | [04](claude-plans/04-server-render-homepage-data.md) |
| S3 | ~43 API error responses leak `details: error.message` (Supabase internals), bypassing the existing `apiError()` sanitizer | Security | Medium | [08](claude-plans/08-shared-data-layer-and-api-dedup.md) |
| B11 | About/Fundamentos/Section-header admin PUTs do delete-all-then-reinsert with no transaction → a mid-write failure wipes live content | Bug / data loss | High | [06](claude-plans/06-atomic-writes-and-not-in-fix.md) |
| Q1 | Public and admin GET endpoints are near-duplicates (about, fundamentos, home-sections, section-header-images) | Quality | Medium | [08](claude-plans/08-shared-data-layer-and-api-dedup.md) |
| Q2 | 1,330 lines of duplicated hand-rolled form code between `nuevo-viaje` and `TripEditFetcher` | Quality | Medium | [07](claude-plans/07-unify-trip-forms.md) |
| P7/I9 | Double image optimization (Cloudinary + Vercel) and unused image remote patterns | Perf / cost | Medium | [09](claude-plans/09-image-delivery.md) |
| P6/P11 | Unused `date-fns`; `uuid` replaceable by `crypto.randomUUID()`; framer-motion loaded on every page for simple fades; GTM ID hardcoded | Perf / hygiene | Low-Med | [10](claude-plans/10-bundle-and-dependency-hygiene.md) |
| Q9 | **Zero tests** and no CI for lint/build — every finding above shipped without a safety net | Quality | High (enabler) | [11](claude-plans/11-testing-and-ci-foundation.md) |
| F1 | No conversion tracking at all: WhatsApp CTA clicks (the business KPI) fire no GTM events | Product / analytics | High (business) | [12](claude-plans/12-conversion-tracking.md) |
| F2/F8 | No draft/sold-out lifecycle for trips; no lead capture fallback | Product | Medium | [13](claude-plans/13-product-opportunities.md) |

---

## 1. Security findings

### S1 — CRITICAL: `POST /api/configurations` is unauthenticated
`src/middleware.ts` intends to protect writes to config endpoints (`WRITE_PROTECTED = ["/api/trips", "/api/config"]`, matched with `startsWith`), **but the matcher never runs the middleware for `/api/configurations`**:

```ts
export const config = {
  matcher: [
    "/api/admin/:path*",
    "/api/cloudinary/:path*",
    "/api/trips/:path*",
    "/api/config/:path*",   // ← matches /api/config and /api/config/*, NOT /api/configurations
    "/nuevo-viaje/:path*",
  ],
};
```

`src/app/api/configurations/route.ts` has a `POST` handler (creates rows in `general_configurations`) with **no auth check inside the handler** either. Any anonymous visitor can create arbitrary configuration keys. Blast radius today is limited (existing keys can't be overwritten — POST rejects duplicates; `PUT/DELETE /api/config/[key]` are covered by the matcher), but it is a live unauthenticated write to the database through the service-role client, and a booby trap for any future code that reads a config key an attacker pre-created (e.g. seeding `whatsapp_phone_number` before the admin does → phishing the WhatsApp funnel).

**Fix direction:** add `"/api/configurations/:path*"` to the matcher (and to `WRITE_PROTECTED`), plus an in-handler `isAuthenticatedRequest` check as defense in depth (the pattern already used by `/api/admin/instagram-posts`). See plan 01.

### S2 — Public trips API exposes soft-deleted trips and full content
- `GET /api/trips` (`src/app/api/trips/route.ts`) does not filter `is_deleted` and selects `*`. Soft-deleted trips (possibly retired pricing, unpublished content) are served to anyone and cached at the CDN (`s-maxage=300`).
- `GET /api/trips/slug/[slug]` also returns deleted trips (the page checks `is_deleted`, the API doesn't).
- Root cause: the **admin** trips list (`src/app/admin/trips/page.tsx`) consumes the same public endpoint and needs the deleted rows. The public and admin needs must be separated. See plan 02.

### S3 — Error detail leakage across API routes
`src/lib/apiError.ts` exists precisely to avoid leaking Supabase internals, but **43 occurrences** of `details: error.message` remain in route handlers (`/api/about`, `/api/fundamentos`, `/api/configurations`, `/api/config/[key]` PUT/DELETE, `/api/menu-images`, `/api/section-header-images`, admin routes, `/api/trips/slug/[slug]` returns the raw message as `error`, `/api/healthcheck` echoes `error.message`). These reveal table/column names and PostgREST error codes. Standardize on `apiError()`. See plan 08.

### S4 — Login rate limiter is per-instance (accepted, documented)
`src/lib/rateLimiter.ts` documents this honestly. On Vercel, concurrent lambdas each get their own window, so the effective limit is `5 × instances`. Acceptable for now; if hardening is desired, back it with Upstash Redis (`@upstash/ratelimit`) — noted in plan 01 as optional.

### S5 — Session tokens cannot be revoked before expiry
Logout only clears the cookie; a stolen token stays valid for up to 7 days, and the payload contains only `exp` (no issued-at, no session id). Rotating `ADMIN_SESSION_SECRET` is the only kill switch (documented in CLAUDE.md). Low priority for a single-admin site; noted for completeness.

### S6 — Cloudinary signing endpoint signs arbitrary extra params
`/api/cloudinary/sign` validates `folder` and `public_id` but signs **any other** params present (`overwrite`, `eager`, `invalidate`, …). Confined to the `integral-surf/` folder tree so impact is low, but an allowlist of signable keys would be stricter. Included in plan 01 as a small hardening step.

### S7 — GTM container ID hardcoded; script injected outside `<body>`
`src/components/layout/ClientGTM.tsx` hardcodes `GTM-P874N777`, and `<ClientGTM />` is rendered as a child of `<html>` *after* `</body>` in `src/app/layout.tsx` — React tolerates it but it's invalid placement. Move the ID to `NEXT_PUBLIC_GTM_ID` and render inside `<body>`. See plan 10.

### Positive security notes (keep as-is)
- HMAC-signed expiring session cookie with constant-time comparison (`src/lib/auth.ts`) — solid.
- Central middleware choke point with clear docs — good architecture; S1 is a coverage bug, not a design flaw.
- Login endpoint compares username and password unconditionally in constant time and rate-limits before credential work.
- Security headers + minimal CSP in `next.config.ts`; signed Cloudinary uploads with folder confinement.

---

## 2. Bugs

### B2 — HIGH: Removing a content block from a trip doesn't delete it (and the whole update is non-atomic)
`src/app/api/trips/[id]/route.ts` PUT:

```ts
await supabaseServer
  .from("trip_contents")
  .delete()
  .eq("trip_id", id)
  .not("id", "in", contentIds);   // contentIds is a JS array
```

postgrest-js requires the `in` value for `.not()` to be a **string** of the form `"(uuid1,uuid2)"`. Passing an array serializes to `not.in.uuid1,uuid2` (no parentheses) which PostgREST rejects — and **the result of this call is never checked**, so the failure is silent: content blocks the admin removed in the UI reappear on the public page. Additionally:
- Content update/insert results inside the loop are unchecked (`inserted?.id` can be `undefined` → that content's images are silently dropped).
- The sequence trip-update → delete-contents → per-content upsert → delete-images → insert-images is not transactional; a crash mid-way leaves the trip half-updated (there is already a working example of the right pattern: the `update_menu_items_transactional` RPC used by `/api/admin/menu-images`).

### B3 — HIGH: Two different config tables serve the same homepage title
`src/app/page.tsx` (`getHeaderData`) reads `configurations` (`key`/`value` columns) for `section_header_main_title`, while `SectionHeader`'s client-side refresh and the admin UI use `general_configurations` (`config_key`/`config_value`) via `/api/config/...`. Result: the server-rendered title and the client-refreshed title come from different tables — admins editing the title through the admin panel change a value the homepage SSR never reads (users see a flash of the stale title on every visit, or permanently stale HTML for crawlers). Consolidate on `general_configurations`. See plan 05.

### B11 — HIGH: Delete-all-then-reinsert without a transaction (3 admin endpoints)
`/api/admin/about` (instructors), `/api/admin/fundamentos` (sections + images + team members), `/api/admin/section-header-images` all delete **all** existing rows (`.neq("id", "0000…")` "delete all trick") and then insert the new payload. If the insert fails (network blip, malformed row, Supabase hiccup), **the live site is left with no instructors / no fundamentos content / no header images**. `fundamentos` deletes three tables before the first insert. Same fix family as B2: move each into a single Postgres RPC transaction. See plan 06.

### B10 — `TripEditFetcher` awaits non-promise props and duplicates state references
`src/components/trips/TripEditFetcher.tsx:69`: `const { id } = await params;` — `params` is a plain props object, not a promise (works by accident). `if (params)` at line 119 is always truthy. `handleContentChange` mutates the content object in place (`newContents[index][field] = value`) — the array is copied but the objects are shared with previous state, which breaks referential-equality assumptions. All swept up by the form refactor in plan 07.

### B6 — WhatsApp default phone number duplicated in 4 places
`"+59899748323"` is hardcoded in `WhatsAppButton.tsx`, `PriceComponent.tsx`, `viajes/[slug]/page.tsx`, and `Footer.tsx`. Move to a single constant in `src/lib/site.ts`. Rolled into plan 04.

### Minor
- `src/app/blog/page.tsx` is a copy of `productos/page.tsx` (renders products under a "Nuestro Blog" heading). Both are `noindex` placeholders — either build them (plan 13) or delete the routes.
- Clone route copies `created_at`/`updated_at`/`order` verbatim into the clone (cosmetic).
- `src/app/api/trips/slug/[slug]/route.ts` appears **unused** by the app (trip pages use `getTripBySlug` directly) — candidate for deletion after grep-confirming no external consumers.

---

## 3. Performance

### P1 — N+1 query patterns (6 places)
`src/lib/trips.ts#getTripBySlug` already shows the right pattern (one nested select: `*, trip_contents(*, trip_content_images(*))`). These still do per-row loops:

| Location | Pattern |
|---|---|
| `GET /api/trips/[id]` | 1 query per content block for images |
| `GET /api/trips/slug/[slug]` | same |
| `GET /api/home-sections` and `GET /api/admin/home-sections` | 1 query per section for images |
| `src/app/fundamentos/page.tsx` + `GET /api/fundamentos` + `GET /api/admin/fundamentos` | **2** queries per section (images + team members) |
| `POST /api/trips/[id]/clone` | sequential insert + select per content |

For a trip with 8 content blocks the admin edit page fires ~10 sequential Supabase round-trips (~50–100ms each from a Vercel region) instead of 1. See plan 03.

### P2 — Client-side fetching of data the server already has
- The **homepage** is a server component that fetches header images and home sections from Supabase, but `SectionCalendar` (trip cards — the primary content) and `Navbar` (menu trips + destinos title) are client components that fetch `/api/trips`, `/api/config/menu_destinos_title` and `/api/menu-images` **after hydration**, showing a spinner and papering over it with a hand-rolled localStorage cache (`src/lib/tripsCache.ts`, `SectionHeader`'s `HEADER_CACHE_KEY`).
- Consequences: trips are invisible to crawlers on `/` and `/viajes` (SEO), LCP-adjacent spinner, stale-cache flashes, three extra API round-trips per visit, and ~120 lines of cache code to maintain.
- Since `/` is already ISR'd hourly and trip mutations call `revalidatePath("/")`, server-rendering this data is strictly better. See plan 04.

### P3 — Oversized `/api/trips` payload
`select("*")` ships every HTML section body for every trip to build a menu of links and calendar cards that use ~8 fields. Combined with the localStorage copy, a phone stores/parses the full content of every trip twice. Plan 02 slims this.

### P12 — Public content APIs have no CDN caching
`/api/trips` and `/api/config/[key]` set `s-maxage=300, stale-while-revalidate=600`, but `/api/menu-images`, `/api/section-header-images`, `/api/instagram-posts`, `/api/home-sections`, `/api/about`, `/api/fundamentos` set no cache headers → every visitor's browser hits Supabase through a cold lambda. One `READ_CACHE` constant exists in the trips route; apply it uniformly (plan 02 / 08).

### P9 — `getTripBySlug` runs twice per request
`generateMetadata` and the page component both call `getTripBySlug(slug)`. supabase-js requests aren't deduplicated by Next. Wrap it in `React.cache()` — one line, halves Supabase load for every trip page render (plan 03).

### P7 — Double image optimization (cost + latency)
Content images use `next/image` with Cloudinary URLs → Vercel's image optimizer re-downloads and re-encodes what Cloudinary already optimizes (`f_auto,q_auto` helpers exist in `src/lib/cloudinary.ts` but are only used for headers). This costs Vercel image-optimization quota and adds a hop. Define a Cloudinary **loader** for `next/image` so transformations happen at Cloudinary's CDN only. Also: `next.config.ts` whitelists unused hosts (`thumbs.dreamstime.com`, `encrypted-tbn0.gstatic.com`, `instagram.com`) — trim them. See plan 09.

### P6/P11 — Bundle weight & dead dependencies
- `date-fns` is **completely unused** — remove.
- `uuid` is used twice; `crypto.randomUUID()` is built-in — remove the dependency.
- `framer-motion` (~40 kB gz) loads on **every page** via Navbar/WhatsAppButton for simple slide/fade effects achievable with CSS transitions. Keep it where it earns its keep (MegaMenu) or replace entirely; measure with the bundle analyzer. See plan 10.

### P8 — Sequential awaits in admin write loops
`PUT /api/trips/[id]` and the clone/fundamentos loops await each row one at a time. Subsumed by the transactional rewrites (plans 03/06).

---

## 4. Code quality & simplification

### Q1 — Public/admin API duplication
`/api/about` vs `/api/admin/about` (GET), `/api/fundamentos` vs `/api/admin/fundamentos` (GET), `/api/home-sections` vs `/api/admin/home-sections` (GET), `/api/section-header-images` vs admin variant are ~90% identical. Extract shared data-access functions into `src/lib/` (the pattern `src/lib/trips.ts` already establishes) and have both route families call them. This also gives one place to fix N+1s and error handling. See plan 08.

### Q2 — Trip form duplication and size
`TripEditFetcher.tsx` (879 lines) and `nuevo-viaje/page.tsx` (453 lines) are parallel implementations of the same form; the create form lacks slideshow-image support that the edit form has, so content created via "nuevo viaje" silently has fewer capabilities. Every field is ~15 lines of copy-pasted label+input markup. Extract a shared `TripForm` with a small `Field` component (or `react-hook-form`). See plan 07.

### Q3 — Duplicated alternating-layout markup + `"\\n\\n"` splitting
`about/page.tsx` and `fundamentos/page.tsx` repeat the same two-column alternating section markup four times, each computing `description.split("\\n\\n")` twice per paragraph. The escaped-backslash delimiter (`\n\n` stored literally in the DB) is a data smell worth normalizing when touched. Extract an `AlternatingSection` component + `renderParagraphs` helper (rolled into plan 08's shared-layer work).

### Q5 — Dead code / leftovers
- `/api/trips/slug/[slug]` likely unused (see Bugs).
- `/blog` + `/productos` placeholder twins.
- Commented-out code and "trivial usage to satisfy the linter" blocks in `logout/route.ts`, `menu-images/route.ts` (embedded SQL comment is fine to keep, but move to `supabase/`).
- `scripts/ping-database.js` + GitHub workflow exist solely to keep the free-tier Supabase alive — fine, but document it in CLAUDE.md.

### Q6 — Inconsistent import styles
Mix of `@/lib/...` alias and long relative paths (`../../../lib/supabaseServer`). Trivial, fix opportunistically.

### Q7 — CLAUDE.md drift
CLAUDE.md describes a "public client using the anon key" (doesn't exist — everything uses the service role), a `configurations` table (the app mostly uses `general_configurations`), and table names that don't match code (`menu_images` vs `menu_item_images`). Update alongside plan 05/08 work.

### Q9 — No tests, no CI quality gate
There are **zero** test files and the only workflow is the Supabase keep-alive ping. `npm run lint` and `npm run build` are not enforced on push. Every plan in `claude-plans/` depends on plan 11 (Vitest + Playwright smoke + GitHub Actions) for its regression-safety story.

---

## 5. Infrastructure usage assessment

### Supabase
- **Service role everywhere (I1):** all reads/writes use the service-role key; RLS is effectively bypassed. Middleware is the *only* wall (which is why S1 matters so much). Recommended defense-in-depth: enable RLS, use the anon key for public reads, keep service role only in admin mutation paths. (Documented as future hardening; not scheduled in a plan.)
- **No transactions (B2/B11):** multi-step writes should be Postgres RPCs. A working example already exists (`update_menu_items_transactional`).
- **Schema not versioned (I7):** only `supabase/home_sections.sql` exists. Adopt Supabase CLI migrations so the RPCs added by plan 06 are tracked in git.
- **Indexes (I3):** verify FK indexes exist for `trip_contents.trip_id`, `trip_content_images.trip_content_id`, `home_section_images.section_key`, `fundamentos_section_images.section_id`, `fundamentos_team_members.section_id`, and a unique index on `trips.slug`. Plan 03 includes the SQL.

### Cloudinary
- Signed uploads with folder confinement: good.
- **Orphaned assets (I6):** images are replaced by URL with no deletion — the account accumulates unused uploads forever. Low priority; a periodic cleanup script is sketched in plan 09.
- Delivery: `f_auto,q_auto` helpers exist but are inconsistently applied (P7 / plan 09).

### Vercel / Next.js
- ISR + `revalidatePath` for trips: correct and well-commented. The gap is that **only** trips get on-demand revalidation (I2 / plan 05).
- Middleware auth at the edge: right pattern; matcher gap is S1.
- `unstable_cache` in the Footer silently sets every static page's revalidate to 1h — subtle; make each page's `revalidate` explicit (plan 05) so the behavior survives a Footer refactor.
- Image optimizer double-work: P7 / plan 09.

### Google Tag Manager
- **No events are pushed at all (F1):** no `dataLayer` usage anywhere. The single business conversion — WhatsApp CTA click — is invisible to analytics. Plan 12 adds `sendGTMEvent` instrumentation (CTA clicks with trip slug, price card variant, menu navigation) — this is likely the highest business-value/effort ratio in this audit.
- Hardcoded container ID + invalid placement (S7 / plan 10).
- GTM also loads on `/admin/*` pages, polluting analytics with admin traffic — exclude it (plan 12).

---

## 6. Product & feature opportunities (F)

Detailed in [plan 13](claude-plans/13-product-opportunities.md); summarized:

1. **F1 — Conversion tracking** (plan 12): WhatsApp click events per trip/CTA position; this unlocks knowing which trips/sections convert.
2. **F2 — Trip lifecycle states:** `sold out` / `few spots left` badges and a `draft` state (today a trip is public the instant it's created — admins edit live). Draft + preview link.
3. **F3 — Social proof:** past-trips gallery / testimonials section (content exists on Instagram; the DB already has an `instagram_posts` table to build on).
4. **F5 — Lead capture fallback:** a minimal "dejanos tu contacto" form (name + WhatsApp/email + trip) stored in Supabase, for users who won't open WhatsApp — also builds a remarketing list. Doubles as the funnel for **waitlists** on sold-out trips.
5. **F7 — Real dates:** `date_month`/`date_days` are free-text strings. Adding real `start_date`/`end_date` columns enables: automatic "próximo viaje" ordering, hiding past trips, `Event` JSON-LD rich results, and ICS "add to calendar".
6. **F6 — i18n (EN)** for international surf travelers — larger effort, listed last.
7. **F4 — Blog:** either implement (SEO long-tail: "surf en Cabo Polonio", etc.) or remove the placeholder routes.

---

## Cross-reference: implementation plans

| Plan | Covers |
|---|---|
| [01-close-unauthenticated-config-endpoint](claude-plans/01-close-unauthenticated-config-endpoint.md) | S1, S6, S4 (optional) |
| [02-slim-public-trips-api](claude-plans/02-slim-public-trips-api.md) | S2, P3, P12 |
| [03-eliminate-n-plus-one](claude-plans/03-eliminate-n-plus-one.md) | P1, P9, I3 |
| [04-server-render-homepage-data](claude-plans/04-server-render-homepage-data.md) | P2, P4, I10, B6 |
| [05-on-demand-revalidation](claude-plans/05-on-demand-revalidation.md) | I2, B3, P5, Q7 |
| [06-atomic-writes-and-not-in-fix](claude-plans/06-atomic-writes-and-not-in-fix.md) | B2, B11, P8, I7 |
| [07-unify-trip-forms](claude-plans/07-unify-trip-forms.md) | Q2, B10 |
| [08-shared-data-layer-and-api-dedup](claude-plans/08-shared-data-layer-and-api-dedup.md) | Q1, Q3, S3, Q5, Q6 |
| [09-image-delivery](claude-plans/09-image-delivery.md) | P7, I9, I6 |
| [10-bundle-and-dependency-hygiene](claude-plans/10-bundle-and-dependency-hygiene.md) | P6, P11, S7 |
| [11-testing-and-ci-foundation](claude-plans/11-testing-and-ci-foundation.md) | Q9 (enabler for all others) |
| [12-conversion-tracking](claude-plans/12-conversion-tracking.md) | F1, GTM hygiene |
| [13-product-opportunities](claude-plans/13-product-opportunities.md) | F2, F3, F5, F7, F4, F6 |

**Suggested execution order:** 11 (safety net) → 01 (critical security) → 06 (data-loss bugs) → 05 (stale content + config bug) → 02/03 (API correctness+perf) → 04 (homepage) → 08 (dedup) → 12 (analytics) → 07, 09, 10 → 13 (features, product decision needed).
