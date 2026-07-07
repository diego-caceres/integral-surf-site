# Plan 01 — Close the unauthenticated `/api/configurations` endpoint (S1) + auth hardening

**Severity:** Critical (security). **Audit refs:** S1, S6, S4 (optional).
**Estimated size:** small (~4 files, no schema changes).

## Background you need

- Admin auth is enforced centrally by `src/middleware.ts`. It only runs on paths listed in the `config.matcher` array at the bottom of that file.
- The matcher entry `"/api/config/:path*"` matches `/api/config` and `/api/config/<anything>`, but **NOT** `/api/configurations` (different path segment). So the middleware never runs for `/api/configurations`.
- `src/app/api/configurations/route.ts` exports `GET` (public listing — intentionally public? see step 3) and `POST` (creates rows in the `general_configurations` table). The POST has no auth check inside the handler. **Result: anyone on the internet can POST and create config rows.**
- The helper `isAuthenticatedRequest(request)` in `src/lib/auth.ts` verifies the signed admin cookie. Several admin routes already use it as a second gate (see `src/app/api/admin/instagram-posts/route.ts` lines 6–13 for the exact pattern to copy).

## Implementation steps

### Step 1 — Extend the middleware matcher and write-protection list
In `src/middleware.ts`:

1. Add `"/api/configurations/:path*"` to `config.matcher`.
2. `WRITE_PROTECTED` already contains `"/api/config"`, and the check uses `pathname.startsWith(p)`, so `/api/configurations` would be covered once the matcher fires. **Do not rely on that accident.** Make the intent explicit by changing:
   ```ts
   const WRITE_PROTECTED = ["/api/trips", "/api/config"];
   ```
   to:
   ```ts
   const WRITE_PROTECTED = ["/api/trips", "/api/config", "/api/configurations"];
   ```
   (Redundant with startsWith but self-documenting; keeps working if someone later switches to exact matching.)
3. Update the doc comment at the top of the file to mention `/api/configurations`.

### Step 2 — In-handler defense in depth
In `src/app/api/configurations/route.ts`, add at the top of the `POST` handler (copy the pattern from `src/app/api/admin/instagram-posts/route.ts`):

```ts
import { isAuthenticatedRequest } from "@/lib/auth";
// note: change the POST signature from `Request` to `NextRequest` so cookies are typed
if (!(await isAuthenticatedRequest(request))) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
```

The handler currently types `request: Request`; change to `NextRequest` (import from `next/server`).

### Step 3 — Decide GET exposure
`GET /api/configurations` returns **all** config rows publicly. Check its consumers: `src/app/admin/configurations/page.tsx` is the only caller (verify with `grep -rn "api/configurations" src`). If confirmed admin-only, add the same auth check to GET. If some config values must stay public, they are already individually readable through `GET /api/config/[key]` — the full listing should still be admin-only.

### Step 4 — Restrict what the Cloudinary sign endpoint will sign (S6)
In `src/app/api/cloudinary/sign/route.ts`, after the existing folder/public_id validation, add an allowlist filter so only expected keys are signed:

```ts
const ALLOWED_SIGN_KEYS = new Set([
  "timestamp", "folder", "public_id", "source", "upload_preset", "eager", "tags",
]);
const unknown = Object.keys(paramsToSign).filter((k) => !ALLOWED_SIGN_KEYS.has(k));
if (unknown.length > 0) {
  return NextResponse.json(
    { error: `Params not permitted: ${unknown.join(", ")}` },
    { status: 400 }
  );
}
```

**Important:** before finalizing the allowlist, test one real upload through the admin UI (`CloudinaryUploadButton` → CldUploadWidget) with the dev server and log `paramsToSign` to see exactly which keys next-cloudinary sends; include all of those and nothing more. If you cannot run an interactive upload, keep `overwrite` and `invalidate` **out** of the list and add keys only if the widget's upload fails with a signature error naming them.

### Step 5 — (Optional, separate commit) shared-store rate limiting (S4)
Only if the owner wants it: replace `src/lib/rateLimiter.ts` internals with `@upstash/ratelimit` + Vercel KV, keeping the same exported function signatures so `login/route.ts` doesn't change. Skip by default — the in-memory limiter is documented as best-effort and acceptable.

## How to verify (must do all)

1. **Reproduce the hole first** (before the fix), with the dev server running:
   ```bash
   curl -s -X POST http://localhost:3000/api/configurations \
     -H 'Content-Type: application/json' \
     -d '{"config_key":"pentest_probe","config_value":"1"}'
   ```
   Expect (bug): `201` with the created row. Delete the row afterwards via the admin UI or SQL.
2. **After the fix:** same curl → expect `401 {"error":"Unauthorized"}`.
3. Logged in as admin (browser), the configurations admin page (`/admin/configurations`) must still list, create, update, delete keys.
4. `GET /api/config/whatsapp_phone_number` (public) must still return `200` — the middleware must not accidentally block public config reads.
5. An image upload through any admin form (e.g. edit a trip → "Cargar Imagen") must still succeed after Step 4.
6. `npm run lint && npm run build` pass.

## Regression safety

- Add route tests (once plan 11's Vitest setup exists — otherwise add them in plan 11's suite): unauthenticated `POST /api/configurations` → 401; authenticated (cookie forged with the test secret via `createSessionToken`) → 201.
- Middleware matcher behavior can be unit-tested by exporting the path-classification logic into a pure function `classifyPath(pathname, method)` and testing it directly — recommended small refactor while in the file.

## Acceptance criteria

- [ ] Anonymous `POST /api/configurations` returns 401.
- [ ] Anonymous `GET /api/configurations` returns 401 (if Step 3 confirms admin-only).
- [ ] Admin configurations UI fully functional.
- [ ] Cloudinary uploads from admin UI still work; signing rejects unknown params.
- [ ] Lint + build green.
