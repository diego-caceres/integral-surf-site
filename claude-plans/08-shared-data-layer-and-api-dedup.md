# Plan 08 — Shared data-access layer, API de-duplication, and consistent error handling (Q1, Q3, S3, Q5, Q6)

**Severity:** Medium (quality + a security cleanup). **Audit refs:** Q1, Q3, S3, Q5, Q6.
**Estimated size:** medium (~12 files touched, net line reduction).

## Background you need

- Public and admin GET endpoints are near-duplicates:
  - `/api/about` GET ≈ `/api/admin/about` GET.
  - `/api/fundamentos` GET ≈ `/api/admin/fundamentos` GET.
  - `/api/home-sections` GET ≈ `/api/admin/home-sections` GET.
  - `/api/section-header-images` GET ≈ `/api/admin/section-header-images` GET (admin also returns ids).
- `src/lib/trips.ts` already demonstrates the target pattern: data-access functions used by server components; route handlers should call the same functions.
- **S3:** ~43 handlers return `details: error.message` (leaks Supabase internals). `src/lib/apiError.ts` already exists to prevent this and even upgrades Supabase-key failures to 503. It is under-used.
- **Q3:** `about/page.tsx` and `fundamentos/page.tsx` repeat alternating two-column markup 4× and `description.split("\\n\\n")` twice per paragraph.

> Sequencing: if plan 03 (N+1) is done first, do the nested-select fix **inside** the shared functions created here to avoid touching the same code twice. If plan 08 is done first, put the nested selects here and mark plan 03 items as done for these tables.

## Implementation steps

### Step 1 — Data-access modules in `src/lib/`
Create thin modules, each returning the fully-shaped object the pages/APIs need (with nested children via one query per plan 03):
- `src/lib/about.ts` → `getAboutPage(): Promise<AboutPage | null>`.
- `src/lib/fundamentos.ts` → `getFundamentosPage(): Promise<FundamentosPage | null>`.
- `src/lib/homeSections.ts` → `getHomeSections(): Promise<HomeSection[]>` (array form for the API) and/or the keyed-map form used by `page.tsx` — expose both, or one plus a small adapter. Reuse the existing logic in `src/app/page.tsx#getHomeSections`.
- `src/lib/sectionHeaderImages.ts` → `getSectionHeaderImages({ includeIds }): Promise<{ web, mobile }>`.
- `src/lib/menuImages.ts` → `getMenuImages()` (the grouped reduce from `/api/menu-images`).

Wrap read functions that feed static pages in `React.cache` where a page calls them more than once per render.

### Step 2 — Rewire routes and pages to the shared functions
- Public GET routes become: `const data = await getX(); if (!data) return 404; return NextResponse.json(data, { headers: { "Cache-Control": READ_CACHE } });`
- Admin GET routes: same, plus the existing `isAuthenticatedRequest` gate and no cache header. For section-header the admin variant passes `includeIds: true`.
- `src/app/about/page.tsx`, `src/app/fundamentos/page.tsx`, `src/app/page.tsx` call the same functions directly instead of inlining Supabase queries.

### Step 3 — Route error handling through `apiError()` (S3)
Replace every `return NextResponse.json({ error: ..., details: error.message }, { status: 500 })` in API routes with `return apiError("<context>:", error)`. Files with the most occurrences: `/api/configurations`, `/api/config/[key]`, `/api/about`, `/api/fundamentos`, `/api/admin/about`, `/api/admin/fundamentos`, `/api/menu-images`, `/api/section-header-images`, `/api/home-sections`, `/api/instagram-posts`, `/api/trips/slug/[slug]`. Keep validation 400s (those messages are safe and useful) — only sanitize the ones echoing DB/exception internals. `grep -rn "details:" src/app/api` to find them all; target zero remaining `error.message`/`String(error)` leaks in responses.

### Step 4 — Shared UI for alternating sections (Q3)
Create `src/components/ui/AlternatingSection.tsx` taking `{ title, body, media, reverse }` and a `renderParagraphs(text)` helper (in `src/lib/text.ts`) that does the `split("\\n\\n")`→`<br/>` logic once. Refactor `about/page.tsx` and `fundamentos/page.tsx` to map over their sections rendering `<AlternatingSection reverse={index % 2 !== 0} .../>`. Also normalize the literal `"\\n\\n"` delimiter question: check what's actually stored (query one `description`); if it's a literal backslash-n, keep the split but add a code comment; ideally migrate stored content to real newlines and split on `/\n\n/`.

### Step 5 — Dead code & import hygiene (Q5, Q6)
- Delete `/api/trips/slug/[slug]` if plan 02 didn't (confirm unused).
- Decide `/blog` + `/productos`: keep for plan 13 or delete both routes now.
- Normalize imports to the `@/` alias (mechanical; `grep -rn "\.\./\.\./\.\./lib" src`). Optional but cheap.

## How to measure the gain

- Net LOC: `git diff --stat` should show a net reduction in `src/app/api/**`.
- `grep -rn "details: .*\.message\|String(error)" src/app/api | wc -l` → target 0.
- No behavior change expected → measurement is mostly "same output, less code".

## Regression safety

- **Contract preservation is the risk.** For each rewired endpoint, capture `curl | jq -S` before and after and diff (both public and admin variants; for admin, pass a valid cookie).
- Pages: visual smoke of `/about`, `/fundamentos`, `/` — identical rendering, paragraph breaks preserved.
- `npm run lint && npm run build` green.
- With plan 11: unit tests for `renderParagraphs` (single paragraph, multiple, empty) and for each `getX` data function against fixtures; API contract snapshot tests.

## Acceptance criteria

- [ ] Public + admin GETs for about/fundamentos/home-sections/section-header call shared `src/lib` functions.
- [ ] Zero `error.message`/`String(error)` leaked in API error responses (validation 400s exempt).
- [ ] `AlternatingSection` + `renderParagraphs` used by about & fundamentos pages.
- [ ] Dead routes removed.
- [ ] Endpoint JSON contracts unchanged (diffed).
