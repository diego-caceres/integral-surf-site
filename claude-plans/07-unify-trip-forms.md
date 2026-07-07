# Plan 07 — Unify the create/edit trip forms into one shared component (Q2, B10)

**Severity:** Medium (quality / maintainability + a real capability bug). **Audit refs:** Q2, B10.
**Estimated size:** medium–large (1 new shared component ~400 lines, deletes ~1000 duplicated lines).

## Background you need

- `src/app/nuevo-viaje/page.tsx` (453 lines) and `src/components/trips/TripEditFetcher.tsx` (879 lines) implement the **same** trip form twice.
- Divergence (real bug, B-adjacent): the **create** form has NO slideshow-image (`content.images`) support, while the edit form does. So trips created via "nuevo viaje" can only get slideshow images by editing them afterward. Also the create form doesn't collect `date_month_2`/`date_days_2`, `top_subtitle` (verify field-by-field).
- Each text field is ~15 lines of repeated `<label>/<input>` markup.
- B10 issues inside `TripEditFetcher`: `await params` on a non-promise props object (works by luck); `if (params)` always truthy; `handleContentChange` mutates content objects in place.

## Two acceptable approaches — pick ONE

**Approach A (recommended, lower risk): extract a shared `TripForm` presentational component** that receives `initialValues` + `onSubmit`, keeping your own `useState`. Reuse it from both a create and an edit wrapper.

**Approach B (more work, cleaner): adopt `react-hook-form`** (already a common choice; not currently a dependency). Only do this if the owner wants form-library standardization; it changes validation ergonomics. Default to Approach A unless told otherwise.

The steps below describe **Approach A**.

## Implementation steps

### Step 1 — A small `Field` primitive
Create `src/components/ui/Field.tsx`: a labeled input/textarea to collapse the 15-line repetition.
```tsx
export function TextField({ label, name, value, onChange, textarea, required, type = "text", placeholder }: {...}) { ... }
```
Render label + (`<input>`|`<textarea>`) with the existing Tailwind classes (copy from the current forms so styling is unchanged).

### Step 2 — Shared `TripFormFields` + `useTripForm`
Create `src/components/trips/TripForm.tsx` exporting a component that renders ALL sections (General, Multimedia, Precios, Sección 1, Sección 2, Sección Video, Imágenes Finales, Contenidos with slideshow images). Model its props on the edit form (the superset). Provide:
- `initialTrip: Trip`, `initialContents: TripContent[]`.
- `onSubmit: (trip, contents) => Promise<void>`.
- `submitting: boolean`, `submitLabel: string`.

Move the content/image manipulation helpers (`addContent`, `removeContent`, `addContentImage`, `removeContentImage`, `handleContentImageChange`, `handleContentChange`) into this component. **Fix B10 while moving them:** make `handleContentChange` immutable:
```ts
setContents(prev => prev.map((c, i) => i === index ? { ...c, [field]: value } : c));
```

### Step 3 — Rewrite the two callers as thin wrappers
- `TripEditFetcher.tsx`: keep the fetch-by-id + sanitize logic (fix `await params` → just use `params.id`; remove the dead `if (params)`), then render `<TripForm initialTrip={...} initialContents={...} onSubmit={putToApi} submitLabel="Guardar Cambios" />`.
- `nuevo-viaje/page.tsx`: render `<TripForm initialTrip={EMPTY_TRIP} initialContents={[EMPTY_CONTENT]} onSubmit={postToApi} submitLabel="Agregar Viaje" />`. Define `EMPTY_TRIP`/`EMPTY_CONTENT` constants once (export from `TripForm` or a `tripDefaults.ts`) — the edit form already has a big default object; reuse it.
- The create form's POST currently sends `{ id, contents, ...form }`; the API `POST /api/trips` expects `{ contents, ...viajeData }`. Keep sending `contents` (now WITH `images` — verify the POST route persists content images; **it currently does NOT** — `POST /api/trips` only inserts `trip_contents`, not `trip_content_images`. Add that insertion to the POST route, mirroring the PUT/RPC, so newly created trips keep their slideshow images). This closes the create/edit capability gap.

### Step 4 — Fix the create POST redirect
`nuevo-viaje` currently only toasts on success (commented-out `router.push`). After unifying, redirect to `/admin/trips` on success (match the edit form's UX).

## How to measure the gain

- Line count: `wc -l src/app/nuevo-viaje/page.tsx src/components/trips/TripEditFetcher.tsx src/components/trips/TripForm.tsx` before/after — expect a large net reduction (target: from ~1330 to ~600 total including the shared component).
- Capability parity: creating a trip with slideshow images now works end-to-end (previously impossible).

## Regression safety

**This is the highest-UI-risk plan — test both forms thoroughly by hand:**
1. Create a new trip with: all header fields, 2 content blocks, one with 3 slideshow images. Save → appears in admin list → public page renders all content + slideshow.
2. Edit that trip: change a title, remove one slideshow image, add a content block, reorder is not supported (fine), save → changes persist on the public page (depends on plan 06 for correct content deletion).
3. Field-by-field diff: before starting, list every `name=` attribute in both current forms; ensure `TripForm` includes the union. Nothing should be dropped.
4. `npm run lint && npm run build` green.
- With plan 11: a Playwright test that fills the create form and asserts the trip appears; component tests for the content-array reducers (add/remove/edit image immutably).

## Acceptance criteria

- [ ] One shared `TripForm` used by both create and edit.
- [ ] Create form supports slideshow images; `POST /api/trips` persists `trip_content_images`.
- [ ] B10 mutation bug fixed (immutable updates); `await params` misuse removed.
- [ ] Net line reduction recorded.
- [ ] Both flows manually verified end-to-end.
