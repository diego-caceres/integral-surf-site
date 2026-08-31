# Plan 11 — Testing & CI foundation (Q9) — DO THIS FIRST

**Severity:** High (enabler). **Audit ref:** Q9.
**Estimated size:** medium (new tooling + a starter suite + one workflow).
**Why first:** every other plan's "regression safety" section assumes a test runner and a CI gate exist. There are currently **zero** tests and no lint/build enforcement on push.

## Background you need

- Next 15 + React 19 + TypeScript, App Router. No test tooling installed.
- The only GitHub workflow is `ping-database.yml` (Supabase keep-alive).
- Pure logic worth testing already exists: `src/lib/auth.ts` (HMAC sign/verify, timing-safe compare), `src/lib/cloudinary.ts` (URL transforms), `src/lib/rateLimiter.ts` (windowing), `src/lib/site.ts` (`absoluteUrl`), `src/middleware.ts` (path classification, if extracted per plan 01), plus `toPlainText` in the trip page.

## Implementation steps

### Step 1 — Install Vitest (unit/integration)
```bash
npm i -D vitest @vitejs/plugin-react vite-tsconfig-paths jsdom @testing-library/react @testing-library/jest-dom
```
Create `vitest.config.ts`:
```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: { environment: "jsdom", setupFiles: ["./vitest.setup.ts"], globals: true },
});
```
`vitest.setup.ts`: `import "@testing-library/jest-dom";`
Add scripts to `package.json`: `"test": "vitest run"`, `"test:watch": "vitest"`.

### Step 2 — Starter unit tests (pure functions, no DB)
Create tests that will actually catch the audit bugs:
- `src/lib/auth.test.ts`: `createSessionToken` → `verifySessionToken` round-trips true; a tampered signature verifies false; an expired token (mock `Date.now`) verifies false; wrong secret fails. Set `ADMIN_SESSION_SECRET` in the test env.
- `src/lib/cloudinary.test.ts`: `cloudinaryUrl` inserts transform for upload URLs, passes through non-Cloudinary and non-upload URLs; `cloudinarySrcSet` builds the width descriptors; returns "" for non-Cloudinary. (Guards plan 09.)
- `src/lib/rateLimiter.test.ts`: not limited under the limit; limited at the limit; `clearAttempts` resets; window expiry frees the key (mock time).
- `src/lib/site.test.ts`: `absoluteUrl` for path, for already-absolute, trailing-slash handling.
- `src/lib/text.test.ts` (once plan 08 adds `renderParagraphs`).
- If plan 01 extracts `classifyPath`, test the matcher logic (this directly guards S1).

### Step 3 — API/integration tests (mock Supabase)
The route handlers import `supabaseServer` from `src/lib/supabaseServer.ts`. Mock it with `vi.mock("@/lib/supabaseServer", ...)` returning a chainable query-builder stub, OR (better long-term) refactor routes to call the `src/lib/*` data functions from plan 08 and test **those** with a mocked client — smaller surface. Priority tests:
- `POST /api/configurations` unauthenticated → 401 (guards S1). Forge a valid cookie via `createSessionToken()` for the authorized case.
- Public `GET /api/trips` excludes `is_deleted` and omits `section_*` fields (guards S2/P3) — assert against a mocked dataset.
- `update_trip_transactional` content-deletion behavior is DB-level (plan 06); cover with a real-DB integration test only if a disposable Supabase project/branch is available — otherwise assert the route calls `.rpc("update_trip_transactional", ...)` with the expected args.

### Step 4 — Playwright smoke (optional but recommended)
```bash
npm i -D @playwright/test && npx playwright install --with-deps chromium
```
A tiny suite (runs against `next build && next start` or a preview URL):
- `/` returns 200 and contains trip links in the HTML (guards plan 04's SSR).
- `/viajes/<known-slug>` returns 200 with the trip title in an `<h1>`.
- Mobile drawer opens and is keyboard-navigable (guards plan 10-D focus trap).
Keep it small; it's a smoke net, not full coverage.

### Step 5 — CI workflow
Create `.github/workflows/ci.yml`:
```yaml
name: CI
on:
  pull_request:
  push:
    branches: [main]
jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: "20", cache: "npm" }
      - run: npm ci
      - run: npm run lint
      - run: npm run test
      - run: npm run build
        env:
          # Build reads these at import time (supabaseServer throws if unset).
          SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          SUPABASE_SERVICE_ROLE: ${{ secrets.SUPABASE_SERVICE_ROLE }}
          ADMIN_SESSION_SECRET: ${{ secrets.ADMIN_SESSION_SECRET }}
          NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: ${{ secrets.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME }}
          NEXT_PUBLIC_CLOUDINARY_API_KEY: ${{ secrets.NEXT_PUBLIC_CLOUDINARY_API_KEY }}
          CLOUDINARY_API_SECRET: ${{ secrets.CLOUDINARY_API_SECRET }}
```
⚠️ `src/lib/supabaseServer.ts` and `generateStaticParams` query Supabase **at build time**, so CI `npm run build` needs real (or a read-only test project's) credentials as GitHub secrets, or the build will fail/produce empty static params. If secrets can't be provided, split CI: always run lint+test; run build only where env is available (e.g. rely on Vercel's own build). Document which path was chosen.

Node version: use 20 in CI (the ping workflow uses 18 — bump it too, or leave it; 18 is EOL soon).

## How to measure / verify

- CI is green on a trial PR and **red** when you intentionally break a test (verify the gate actually blocks).
- `npm run test` passes locally.
- Coverage isn't a goal yet; the goal is a working harness + the specific regression guards for the bugs this audit found.

## Regression safety

- Purely additive; no product code changes (except optional `classifyPath`/`renderParagraphs` extractions, which are covered by their own tests).
- Ensure test env vars don't leak into runtime (use `.env.test` or set in the test config only).

## Acceptance criteria

- [ ] `npm run test` runs Vitest with passing starter suite.
- [ ] Tests exist that would fail on S1, S2, and the auth logic.
- [ ] CI workflow runs lint + test (+ build where creds allow) on PRs and blocks on failure.
- [ ] (Optional) Playwright smoke wired.
