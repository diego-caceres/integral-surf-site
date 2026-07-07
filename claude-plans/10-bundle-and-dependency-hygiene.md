# Plan 10 — Bundle & dependency hygiene (P6, P11, S7)

**Severity:** Low–Medium (perf / maintainability). **Audit refs:** P6, P11, S7.
**Estimated size:** small, but do it in independently-verifiable sub-steps.

## Background you need

- `date-fns` is a dependency but appears **unused** (`grep -rn "date-fns" src` → no imports).
- `uuid` is used in exactly 2 files (`nuevo-viaje/page.tsx`, `api/trips/[id]/clone/route.ts`). `crypto.randomUUID()` is built into Node 18+ and modern browsers — the dependency is removable.
- `framer-motion` (~40 kB gz) is imported by `Navbar`, `WhatsAppButton`, `MegaMenuItem`. It loads on **every page** (Navbar is in the root layout). The effects are simple slides/fades that CSS transitions can do.
- `GTM-P874N777` is hardcoded in `src/components/layout/ClientGTM.tsx`, and `<ClientGTM/>` is rendered as a child of `<html>` after `</body>` in `layout.tsx` (invalid placement).

Do each sub-step as its own commit so regressions are bisectable.

## Sub-step A — Remove `date-fns` (safe, do first)
1. `grep -rn "date-fns" src` → confirm zero imports.
2. `npm uninstall date-fns`.
3. `npm run build` green. Done.

## Sub-step B — Replace `uuid` with `crypto.randomUUID()`
1. In `src/app/api/trips/[id]/clone/route.ts`: `const newTripId = crypto.randomUUID();` (Node runtime — `crypto` is global in the Next server runtime; if lint complains, `import { randomUUID } from "crypto"`).
2. In `src/app/nuevo-viaje/page.tsx`: `const viajeId = crypto.randomUUID();` (browser — `crypto.randomUUID()` is global; requires HTTPS/localhost, which is always true here). Note: if plan 07 refactors this file, coordinate — the id may be generated server-side instead.
3. `npm uninstall uuid`. Remove `@types/uuid` if present.
4. Verify: clone a trip (new id works), create a trip (new id works). `npm run build` green.

## Sub-step C — GTM env var + correct placement (S7)
1. Add `NEXT_PUBLIC_GTM_ID` to `.env.local` and document in CLAUDE.md's env section.
2. `ClientGTM.tsx`: `const id = process.env.NEXT_PUBLIC_GTM_ID; if (!id) return null; return <GoogleTagManager gtmId={id} />;`
3. In `src/app/layout.tsx`, move `<ClientGTM />` to be the **last child inside `<body>`**, not after `</body>`.
4. Coordinate with plan 12 (which also touches GTM to add events and exclude `/admin`). If doing both, do 12's changes here too.
5. Verify GTM still loads (Network: `gtm.js?id=GTM-...`).

## Sub-step D — Evaluate framer-motion (measure before removing)
1. Add the bundle analyzer to see the actual cost:
   ```bash
   npm i -D @next/bundle-analyzer
   ```
   Wrap `next.config.ts` with it (guarded by `ANALYZE=true`), run `ANALYZE=true npm run build`, record framer-motion's contribution to the shared/first-load JS.
2. If material (it will be on First Load JS, currently 102 kB shared): replace the simple cases with CSS:
   - `WhatsAppButton` bubble in/out: a CSS `transition` + conditional class (opacity/translate) instead of `AnimatePresence`.
   - `Navbar` sticky bar + mobile drawer slide: CSS transitions / `data-state` classes. The drawer has a focus trap that must be preserved (keep the effect logic, drop only the motion wrapper).
   - `MegaMenuItem` dropdown: CSS.
   This is the biggest but most invasive win. If the owner values the current animation feel, **keep framer-motion** and stop here — document the decision. Do NOT half-remove it (leaving one import still ships the whole lib).
3. If fully removed: `npm uninstall framer-motion`, confirm no imports remain, re-run analyzer to confirm the drop.

## How to measure the gain

- Record **First Load JS shared by all** from `npm run build` before (currently 102 kB) and after each sub-step.
- Bundle analyzer treemap screenshots before/after for framer-motion.
- `du -sh node_modules` before/after (minor, but shows dependency removal).

## Regression safety

- A: pure removal, build proves safety.
- B: manual test clone + create.
- C: confirm GTM network request fires; check `dataLayer` exists in console.
- D: **visual regression risk** — manually exercise every animated surface (mobile drawer open/close + focus trap + Escape, sticky navbar on scroll up/down, mega-menu hover, WhatsApp bubble appear on scroll). Test keyboard nav still works (the drawer focus trap is accessibility-critical — see docs/audit-2026-05-08).
- `npm run lint && npm run build` green after each sub-step.
- With plan 11: a Playwright smoke that opens the mobile drawer and tabs through it guards the focus-trap during a framer-motion removal.

## Acceptance criteria

- [ ] `date-fns` removed.
- [ ] `uuid` removed in favor of `crypto.randomUUID()`; clone + create verified.
- [ ] GTM id from env, script inside `<body>`.
- [ ] framer-motion decision made and recorded (removed with First-Load-JS delta, or explicitly kept).
- [ ] First Load JS before/after recorded.
