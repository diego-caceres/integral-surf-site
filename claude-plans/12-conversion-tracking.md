# Plan 12 — Conversion tracking for the WhatsApp funnel + GTM hygiene (F1)

**Severity:** High (business value). **Audit refs:** F1, GTM hygiene (S7 overlaps plan 10-C).
**Estimated size:** small–medium. Highest business-value/effort ratio in this audit.

## Background you need

- The site's single conversion action is clicking a WhatsApp CTA. Today **no analytics events fire** — GTM (`GTM-P874N777`) is loaded but nothing pushes to `dataLayer`. The business can't tell which trips, which CTA, or which pages drive contacts.
- WhatsApp CTAs live in:
  - `src/components/layout/WhatsAppButton.tsx` — floating bubble (every page) + inline full button (trip pages).
  - `src/components/trips/PriceComponent.tsx` — two price cards (promo / final), each a WhatsApp link.
- `@next/third-parties` is already a dependency; it exports `sendGTMEvent`.
- GTM currently also loads on `/admin/*` (Navbar/layout are global) → admin traffic pollutes analytics.

## Implementation steps

### Step 1 — A typed event helper
Create `src/lib/analytics.ts`:
```ts
import { sendGTMEvent } from "@next/third-parties/google";

type WhatsAppClickPayload = {
  location: "floating_bubble" | "trip_inline_cta" | "price_promo" | "price_final" | "footer";
  trip_slug?: string;
  trip_destiny?: string;
  price?: number;
};

export function trackWhatsAppClick(p: WhatsAppClickPayload) {
  sendGTMEvent({ event: "whatsapp_click", ...p });
}
```
Keep it tiny and centralized so event names/params stay consistent (GTM triggers depend on exact strings).

### Step 2 — Fire on each CTA
- `WhatsAppButton.tsx`: add `onClick={() => trackWhatsAppClick({ location: onlyBubble ? "floating_bubble" : "trip_inline_cta", trip_slug, trip_destiny })}` to both the `<a>` and the `<Link>`. Add optional `tripSlug`/`tripDestiny` props so trip pages can pass context; default undefined on the homepage bubble.
- `PriceComponent.tsx`: pass `location: "price_promo"` / `"price_final"` with `price` and the trip context. Thread `tripSlug`/`tripDestiny` from `TripDetail` → `PriceComponent`/`WhatsAppButton` (TripDetail has the `trip`).
- `Footer.tsx` phone link: `location: "footer"` (optional).

Note: WhatsApp links open in a new tab (`target="_blank"`). `sendGTMEvent` pushes synchronously to `dataLayer`, so the event is recorded before navigation — no need for `beforeunload` tricks.

### Step 3 — Also track key navigation (optional, cheap)
Fire a `trip_view` event on trip pages (in a small client component or via GTM's History Change trigger) and `menu_trip_click` when a mega-menu destination is clicked. Gives a funnel: menu click → trip view → whatsapp click.

### Step 4 — Exclude admin from GTM
In `ClientGTM.tsx` (client component), read the pathname and don't render GTM under `/admin` or `/nuevo-viaje`:
```tsx
"use client";
import { usePathname } from "next/navigation";
export default function ClientGTM() {
  const path = usePathname();
  const id = process.env.NEXT_PUBLIC_GTM_ID;
  if (!id || path.startsWith("/admin") || path.startsWith("/nuevo-viaje")) return null;
  return <GoogleTagManager gtmId={id} />;
}
```
(Combine with plan 10-C's env-var + placement changes.)

### Step 5 — GTM container config (document, not code)
The code only pushes to `dataLayer`. In the GTM web UI (owner action, document it in a README or `docs/analytics.md`): create a trigger on the `whatsapp_click` custom event and a GA4 event tag with the params as event parameters. Note the event name + param schema from Step 1 so the marketer can wire it without guessing.

## How to measure / verify

1. **dataLayer:** with the site running, open console → click a WhatsApp CTA → `window.dataLayer` should contain a `whatsapp_click` entry with the right `location`/`trip_slug`. Do this for the bubble, inline CTA, promo card, final card.
2. **GTM Preview mode** (Tag Assistant): connect to the site, click CTAs, confirm the event and parameters appear.
3. **No admin tracking:** load `/admin`, confirm no `gtm.js` request and no `dataLayer` conversion events.
4. Business measure (post-launch): a week of `whatsapp_click` counts segmented by `location` and `trip_slug` — the whole point is that this number now exists.

## Regression safety

- Additive; CTAs still navigate to the same WhatsApp URLs. Verify each link still opens `wa.me/...` with the message.
- `usePathname` requires the component stay a client component (it already is).
- `npm run lint && npm run build` green.
- With plan 11: a component test asserting a mocked `sendGTMEvent` is called with the expected payload when a CTA is clicked.

## Acceptance criteria

- [ ] `whatsapp_click` fires with location + trip context from every CTA.
- [ ] GTM excluded from `/admin` and `/nuevo-viaje`.
- [ ] Event schema documented for the GTM/GA4 configuration.
- [ ] Verified in GTM Preview.
