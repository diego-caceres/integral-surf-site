# Plan 09 — Fix double image optimization, trim remote patterns, orphan cleanup (P7, I9, I6)

**Severity:** Medium (perf + Vercel cost). **Audit refs:** P7, I9, I6.
**Estimated size:** small–medium (config + a loader + optional script).

## Background you need

- `src/lib/cloudinary.ts` has `cloudinaryUrl()` / `cloudinarySrcSet()` that insert `f_auto,q_auto,c_limit,w_*` transforms. These are used **only** for the trip header and `SectionHeader` (via raw `<img>`/`<picture>`).
- Everywhere else images use `next/image` with **raw Cloudinary URLs**. Next's image optimizer then re-fetches and re-encodes an image Cloudinary already serves optimized → double work: uses Vercel image-optimization units (billable) and adds a Cloudinary→Vercel hop.
- `next.config.ts` `images.remotePatterns` allows hosts that aren't used: `thumbs.dreamstime.com`, `encrypted-tbn0.gstatic.com`, and `instagram.com`/`www.instagram.com` (Instagram grid uses `image_url` stored in Supabase → usually Cloudinary or cdninstagram, verify). Extra patterns widen the SSRF-ish surface of the optimizer for no reason.
- I6: replaced images are never deleted from Cloudinary → account bloat.

## Implementation steps

### Step 1 — A Cloudinary loader for `next/image` (P7)
Create `src/lib/cloudinaryLoader.ts`:
```ts
"use client";
export default function cloudinaryLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  // Only transform Cloudinary upload URLs; pass everything else through unchanged.
  const marker = "/image/upload/";
  if (!src.includes("res.cloudinary.com") || !src.includes(marker)) return src;
  const t = `f_auto,q_${quality || "auto"},c_limit,w_${width}`;
  return src.replace(marker, `${marker}${t}/`);
}
```

Two ways to apply it — **prefer per-image** to avoid breaking Supabase/Instagram images:
- **Per-image (safe):** pass `loader={cloudinaryLoader}` to `next/image` instances that render Cloudinary URLs (content sliders via `ImageSlider`, about/fundamentos/instagram images). `ImageSlider` is the main funnel — add an optional `loader` prop defaulting to the Cloudinary loader, since its images are Cloudinary-hosted.
- **Global (aggressive):** set `images.loader = "custom"` + `images.loaderFile` in `next.config.ts`. This routes ALL `next/image` through the loader; the loader must pass non-Cloudinary URLs through untouched (it does). Only choose this after confirming every `next/image` source is either Cloudinary or safely passed through. **Default to per-image** unless you verify all sources.

When the loader is active, Next stops using its own optimizer for those images (the `unoptimized` path), so Vercel image units drop.

### Step 2 — Trim `remotePatterns` (I9)
Audit actual image hosts: `grep -rn "image_url\|src=" src | ...` plus inspect DB sample values. Remove `thumbs.dreamstime.com` and `encrypted-tbn0.gstatic.com` (placeholder/test hosts). Keep `res.cloudinary.com`, the Supabase storage host, and `**.cdninstagram.com` only if Instagram images actually use it. Removing unused patterns is safe as long as no stored `image_url` points at them — spot-check the `instagram_posts`, `about_instructors`, `home_section_images` tables first.

### Step 3 — Consistent sizing on content images
`TripDetail.tsx` uses fixed `width/height` on `next/image` for section/final images; ensure `sizes` is set (some are) so the loader picks sane widths. Low priority polish.

### Step 4 — Orphan cleanup script (I6, optional)
Add `scripts/cloudinary-prune.mjs`: list assets under `integral-surf/`, collect all `image_url`s referenced across tables, delete assets not referenced. **Guard it:** dry-run by default (log what would be deleted), require an explicit `--apply` flag, and never touch assets younger than N days (in-flight uploads). This is a maintenance tool, run manually — do NOT wire it to a cron without review.

## How to measure the gain

1. **Vercel image optimization usage:** in the Vercel dashboard (Usage → Image Optimization), record the count before, deploy, compare over a few days. Expect a large drop if most images move to the loader.
2. **Direct check:** in DevTools Network on a trip page, image requests should go to `res.cloudinary.com/...f_auto,q_auto,c_limit,w_XXXX...` directly rather than `/_next/image?url=...`.
3. **Payload/format:** confirm images are served as WebP/AVIF (`f_auto`) with `content-type` image/webp from Cloudinary.

## Regression safety

- Images must still render on: home sliders, trip detail (header + content sliders + final images), about, fundamentos, instagram grid. Check both desktop and mobile crops.
- Non-Cloudinary images (Supabase storage, any Instagram CDN) must still load — the loader passes them through; verify one of each.
- `npm run lint && npm run build` green (a bad `loaderFile` path fails the build).
- With plan 11: a unit test for `cloudinaryLoader` (transforms Cloudinary upload URLs; passes through others; respects width/quality).

## Acceptance criteria

- [ ] Cloudinary images served directly with transforms (no `/_next/image` double-pass) OR global loader configured and verified.
- [ ] `remotePatterns` contains only hosts actually used.
- [ ] Vercel image-optimization usage before/after recorded.
- [ ] (Optional) guarded prune script committed, dry-run by default.
