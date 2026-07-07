# Plan 13 — Product & feature opportunities (F2, F3, F5, F7, F4, F6)

**Severity:** Medium (business growth). **Audit refs:** F2, F3, F5, F7, F4, F6.
**Nature:** This is a **menu of independent features**, not one change. Each sub-plan is self-contained; the owner should pick priorities. Ordered by estimated value/effort. Requires product decisions — do not build all of these speculatively.

> Prerequisite for most: plan 11 (tests) and plan 06 (transactional writes) make schema/feature work safe. Analytics (plan 12) should land first so feature impact is measurable.

---

## F2 — Trip lifecycle: draft + availability states (recommended first)

**Problem:** A trip is publicly visible the instant it's created; admins edit live content. There's no "sold out" / "few spots left" signal, which is a strong conversion lever for group trips.

**Approach:**
1. Schema: add to `trips` — `status text default 'published'` (`draft` | `published` | `archived`) and `availability text default 'available'` (`available` | `few_spots` | `sold_out`). Migration in `supabase/migrations/`.
2. Public reads (`getActiveTripSummaries`, `getTripBySlug`, sitemap, `generateStaticParams`) filter `status = 'published'` in addition to `is_deleted = false`. Draft trips get a preview via an admin-only route or a signed `?preview=` token.
3. Admin: a status dropdown + availability dropdown in `TripForm` (plan 07).
4. UI: a badge on `TripCard` and the trip header for `few_spots`/`sold_out`; when `sold_out`, swap the price CTA for a waitlist action (ties into F5).
5. Revalidate on status change (plan 05).

**Measure:** track (plan 12) whether `few_spots`/`sold_out` badges change `whatsapp_click` rate. Verify drafts never appear in `/api/trips`, sitemap, or as static params.

---

## F5 — Lead capture form + waitlist (recommended second)

**Problem:** Users who won't open WhatsApp have no other way to convert, and the business builds no owned contact list (everything lives in WhatsApp).

**Approach:**
1. Schema: `leads` table (`id, created_at, name, contact, contact_type, trip_slug, message, source`).
2. `POST /api/leads` route handler (rate-limited with the existing `rateLimiter`, honeypot field for spam, server-side validation). This is a **public write** — keep it out of the admin middleware but rate-limit and validate strictly; consider a Cloudflare Turnstile/hCaptcha token if spam appears.
3. A small client form component under the price section and on sold-out trips ("dejanos tu contacto y te avisamos"). On success, still offer the WhatsApp link.
4. Admin: a `/admin/leads` table (read-only list + export CSV).
5. Notify: optionally email/WhatsApp the admin on new lead (Resend, or a Supabase Edge Function/webhook).

**Measure:** leads/week; conversion of sold-out waitlist → booking.

---

## F7 — Structured trip dates

**Problem:** `date_month`/`date_days` are free-text (`"Enero"`, `"12–20"`). Can't sort by date, hide past trips, or emit rich results.

**Approach:**
1. Schema: add `start_date date`, `end_date date` (keep the free-text fields for display flexibility, or derive display from the dates). Backfill existing trips manually (few rows).
2. Order trips by `start_date`; auto-hide/label trips whose `end_date` has passed.
3. SEO: emit `Event` JSON-LD (with `startDate`/`endDate`/`location`) on trip pages in addition to the current `Product` schema → eligible for event rich results.
4. "Add to calendar" (.ics) link on trip pages.

**Measure:** Search Console impressions/rich-result coverage for trip pages; correct chronological ordering.

---

## F3 — Social proof (testimonials / past trips)

**Problem:** No reviews or past-trip gallery; strong for a high-consideration purchase.

**Approach:** a `testimonials` table (name, quote, trip, photo) + a homepage/trip-page section. The `instagram_posts` table already exists as a lightweight social-proof surface — could be extended or curated per trip. Low technical risk; mostly content + one CRUD screen (reuse the admin patterns).

---

## F4 — Blog (decision required)

`/blog` and `/productos` are `noindex` placeholder twins. Either:
- **Build the blog** for SEO long-tail ("surf en Cabo Polonio", "viaje de surf Uruguay"): a `posts` table + `/blog/[slug]` MDX or DB-backed pages, indexable, in the sitemap. Meaningful organic-traffic upside for a travel brand.
- **Or delete both routes** (plan 08 Step 5) to reduce surface area.
Don't leave them as dead placeholders.

---

## F6 — Internationalization (EN) — largest effort, do last

International surf travelers likely search in English. Next App Router i18n (`next-intl`) with `es` default + `en`. Large effort (every string + content translation in the DB). Only pursue if analytics (plan 12) show meaningful non-Spanish traffic. List as a strategic option, not a near-term task.

---

## Cross-cutting verification & safety for any F-item

- Each schema change ships as a committed migration (I7) and updates the relevant `src/lib` data functions + types in `src/types/`.
- Public-facing writes (F5 leads) must be rate-limited, validated, and spam-guarded — treat as untrusted input (the rest of the app's writes are admin-only; this is the first public write).
- Add tests (plan 11) for new API routes and filters (e.g. draft trips excluded from public reads).
- Revalidate affected pages on admin mutations (plan 05).
- Measure with the analytics added in plan 12 so feature value is provable, not assumed.

## Suggested product sequence

1. F2 (draft/sold-out) — small, high conversion leverage, uses existing admin patterns.
2. F5 (lead capture/waitlist) — builds an owned funnel; pairs with F2 sold-out.
3. F7 (real dates) — unlocks SEO Event schema + ordering.
4. F3 (social proof) — content-driven, low risk.
5. F4 decision (build or delete).
6. F6 (i18n) — only if traffic justifies.
