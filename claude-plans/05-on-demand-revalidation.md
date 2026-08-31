# Plan 05 — On-demand revalidation for all content + fix the split config table (B3)

**Severity:** High (bug + infra). **Audit refs:** I2, B3, P5, Q7.
**Estimated size:** small–medium (~8 files, no schema unless migrating the config value).

## Background you need

- Public pages `/`, `/about`, `/fundamentos`, `/viajes`, `/viajes/[slug]` are static with 1h revalidate.
- `src/lib/revalidate.ts#revalidateTripPages()` calls `revalidatePath("/viajes")`, `revalidatePath("/viajes/[slug]","page")`, `revalidatePath("/")`. It is called by the trip create/update/delete/clone/restore routes **only**.
- **Gap (I2):** admin edits to About, Fundamentos, Home sections, section-header images, menu images, and Instagram posts do NOT revalidate anything → up to 1 hour of stale content. The admin saves, refreshes the public page, and sees no change → looks broken.
- **Bug (B3):** `src/app/page.tsx#getHeaderData` reads the homepage title from the **`configurations`** table (`key`/`value` columns), while `SectionHeader`'s client refresh and the admin config UI use **`general_configurations`** (`config_key`/`config_value`) via `/api/config/section_header_main_title`. Editing the title in admin updates `general_configurations`; the SSR homepage reads `configurations` → they diverge.

## Implementation steps

### Part A — Fix the config table split (B3)

1. Confirm the discrepancy: `grep -rn "\"configurations\"" src` (should show only `src/app/page.tsx`) vs `grep -rn "general_configurations" src` (everywhere else).
2. Decide the single source of truth: **`general_configurations`** (used by the admin UI and all `/api/config` routes).
3. In `src/app/page.tsx#getHeaderData`, replace the `configurations` query with the existing cached helper:
   ```ts
   import { getCachedConfigValue } from "@/lib/trips";
   // ...
   const title = (await getCachedConfigValue("section_header_main_title")) ?? "Viajes al Mar";
   ```
   Restructure `getHeaderData` so the images query stays but the title comes from `general_configurations`. (Keep the `Promise.all` shape — run the images query and the cached config read together.)
4. **Data migration:** if a row `section_header_main_title` exists in the old `configurations` table but not in `general_configurations`, copy the value across (one-off SQL in `supabase/migrations/`), then the old table/row can be ignored. Verify current value in the admin config page after deploy.
5. Update CLAUDE.md (Q7): the DB section lists a `configurations` table — correct it to `general_configurations` and note the `menu_item_images` / `home_section_images` / etc. actual names.

### Part B — Generalize revalidation (I2)

1. Rename/expand `src/lib/revalidate.ts` with granular helpers so each mutation revalidates exactly what it affects:

   ```ts
   import { revalidatePath } from "next/cache";

   export function revalidateTripPages() {
     revalidatePath("/viajes");
     revalidatePath("/viajes/[slug]", "page");
     revalidatePath("/");
   }
   export function revalidateHome() { revalidatePath("/"); }
   export function revalidateAbout() { revalidatePath("/about"); }
   export function revalidateFundamentos() { revalidatePath("/fundamentos"); }
   ```

   Note: home sections, section-header images, menu images, and the header title all affect the homepage (and menu images affect the navbar which is in the root layout → affects every page, but revalidating `/` is enough to refresh the layout data for the homepage; the navbar on other static pages also needs it — see step 3).

2. Call the right helper at the end of each admin mutation (after a successful write, before returning success):
   - `src/app/api/admin/about/route.ts` PUT → `revalidateAbout()`.
   - `src/app/api/admin/fundamentos/route.ts` PUT → `revalidateFundamentos()`.
   - `src/app/api/admin/home-sections/route.ts` PUT → `revalidateHome()`.
   - `src/app/api/admin/section-header-images/route.ts` PUT → `revalidateHome()`.
   - `src/app/api/admin/menu-images/route.ts` PUT → revalidate `/` **and** the other static pages whose layout shows the menu. Simplest correct option: `revalidatePath("/", "layout")` which revalidates everything under the root layout. Add `revalidateLayout()` for this case.
   - `src/app/api/admin/instagram-posts/route.ts` POST/PUT/DELETE → `revalidateHome()` (Instagram grid is on `/`).
   - `src/app/api/config/[key]/route.ts` PUT/DELETE → depends on the key. Safe default: `revalidatePath("/", "layout")` (config values feed footer phone, header title, menu title — all layout/home). Document this.

3. **Navbar-on-other-pages caveat:** menu images / destino title / trip list appear in the root-layout navbar on `/about`, `/fundamentos`, etc. `revalidatePath("/", "layout")` refreshes the layout for all pages sharing it, which is what we want for menu changes. Use it specifically for menu/config mutations; use page-scoped revalidation for page-specific content (about/fundamentos) to avoid over-invalidating.

### Part C — Make each page's revalidate explicit (P5)

Static pages currently inherit `revalidate: 3600` implicitly from `getCachedConfigValue`'s `unstable_cache` in the Footer. This is fragile. Add an explicit `export const revalidate = 3600;` to `src/app/page.tsx`, `src/app/about/page.tsx`, `src/app/fundamentos/page.tsx`, `src/app/viajes/page.tsx` so behavior is self-evident and survives a Footer refactor.

## How to measure / verify

This is correctness, not throughput — verify behaviorally:

1. **B3:** In admin, change the header title; reload `/` (hard refresh). Before: title unchanged in SSR HTML (`curl -s / | grep -A2 Eckmannpsych`), only changes after client JS runs. After: new title present in server HTML immediately (post-revalidation).
2. **I2:** For each content type, edit in admin → immediately reload the public page (no waiting):
   - About: change `hero_title`, reload `/about` → updated.
   - Fundamentos: edit a section title, reload `/fundamentos` → updated.
   - Home section: edit `our_purpose` title, reload `/` → updated.
   - Menu images / destino title: edit, reload any page → navbar updated.
   Before the fix, all of these require up to 1h or a redeploy.
3. Confirm no error in the Vercel function logs from `revalidatePath` (it must be called in a route handler / server action context — all these are route handlers, so it's valid).

## Regression safety

- `revalidatePath` is a no-op-safe call; worst case it over-invalidates (a page rebuilds once more than necessary) — never breaks correctness.
- Confirm trips still revalidate (existing behavior unchanged).
- `npm run lint && npm run build` green.
- With plan 11: an integration test is hard for ISR; instead add a unit test that each admin mutation route imports and calls a revalidate helper (spy on the module).

## Acceptance criteria

- [ ] Homepage title reads from `general_configurations` only; no code references the `configurations` table.
- [ ] Every admin content mutation triggers an appropriate `revalidatePath`.
- [ ] Explicit `revalidate` on all static public pages.
- [ ] CLAUDE.md DB section corrected.
- [ ] Manual edit-then-reload verified for about, fundamentos, home, header title, menu.
