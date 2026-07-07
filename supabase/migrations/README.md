# Migrations

These SQL files are **not yet applied** to the live Supabase project. The
application code does not call the RPC functions yet (`20260707000001`
through `20260707000004`); the index migration (`20260707000005`) is
additive and has no code dependency — it's safe to apply any time and only
improves query plans for selects the app already issues.

## Atomic-write RPCs (`20260707000001`–`20260707000004`)

Written as part of
[`claude-plans/06-atomic-writes-and-not-in-fix.md`](../../claude-plans/06-atomic-writes-and-not-in-fix.md)
to fix data-loss bugs (B2, B11 in [`ai-pro-audit.md`](../../ai-pro-audit.md))
where several admin "save" endpoints deleted existing rows before inserting
the replacement rows, with no transaction — a failed insert left the live
site with missing content until the admin retried.

One of the four bugs (B2, the trip-content deletion bug) already has an
interim, non-transactional application fix in place (see
`src/app/api/trips/[id]/route.ts` and `src/lib/trips.ts#computeContentIdsToDelete`);
the RPCs here give full atomicity to all four once applied.

### How to apply

Run each file's SQL against the project's database, in order, via:

- The Supabase Dashboard → SQL Editor, or
- `supabase db push` if this project is linked with the Supabase CLI (`supabase link --project-ref <ref>`).

### After applying

Wire up the corresponding route handler to call the RPC instead of its
current imperative multi-step write:

| Migration | Route to update | RPC name |
|---|---|---|
| `20260707000001` | `src/app/api/trips/[id]/route.ts` (PUT) | `update_trip_transactional` |
| `20260707000002` | `src/app/api/admin/about/route.ts` (PUT) | `update_about_transactional` |
| `20260707000003` | `src/app/api/admin/fundamentos/route.ts` (PUT) | `update_fundamentos_transactional` |
| `20260707000004` | `src/app/api/admin/section-header-images/route.ts` (PUT) | `update_section_header_images_transactional` |

Each route becomes: validate the request body → `const { data, error } = await
supabaseServer.rpc("<name>", { ... });` → `if (error) return apiError(...)` →
call the relevant `revalidate*()` helper → return the RPC's result. Test each
RPC directly in the SQL editor with a representative payload before wiring it
up, and verify with a forced-failure test (e.g. an insert with a bad value)
that existing rows survive — that's the whole point of the migration.

## Index migration (`20260707000005`)

Written as part of
[`claude-plans/03-eliminate-n-plus-one.md`](../../claude-plans/03-eliminate-n-plus-one.md).
Adds indexes on the FK/lookup columns the nested-select queries in
`src/lib/trips.ts`, `src/lib/fundamentos.ts`, and `src/lib/homeSections.ts`
join on, plus a unique index on `trips.slug` (confirmed no duplicates exist
in the live data before adding it — see the migration file's header comment).
No code changes depend on this one; apply it whenever convenient.
