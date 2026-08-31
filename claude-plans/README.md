# Implementation Plans — Integral Surf Site

These plans operationalize the findings in [`../ai-pro-audit.md`](../ai-pro-audit.md). Each is self-contained: it explains the background, exact steps, how to measure the gain (for perf items), and how to avoid regressions. They are written to be followed by an implementer without the full context of the audit session — read `ai-pro-audit.md` first for the big picture, then the specific plan.

## Index

| # | Plan | Type | Severity |
|---|------|------|----------|
| 01 | [Close unauthenticated `/api/configurations`](01-close-unauthenticated-config-endpoint.md) | Security | Critical |
| 02 | [Slim & filter public trips API; cache content APIs](02-slim-public-trips-api.md) | Security + Perf | High |
| 03 | [Eliminate N+1 queries; dedup; indexes](03-eliminate-n-plus-one.md) | Perf | High |
| 04 | [Server-render homepage & navbar data](04-server-render-homepage-data.md) | Perf / SEO | High |
| 05 | [On-demand revalidation + fix config table split](05-on-demand-revalidation.md) | Bug + Infra | High |
| 06 | [Atomic admin writes (RPCs) + content-delete bug](06-atomic-writes-and-not-in-fix.md) | Data loss | High |
| 07 | [Unify create/edit trip forms](07-unify-trip-forms.md) | Quality | Medium |
| 08 | [Shared data layer, API dedup, error sanitizing](08-shared-data-layer-and-api-dedup.md) | Quality + Security | Medium |
| 09 | [Fix double image optimization; trim hosts](09-image-delivery.md) | Perf / cost | Medium |
| 10 | [Bundle & dependency hygiene](10-bundle-and-dependency-hygiene.md) | Perf | Low–Med |
| 11 | [Testing & CI foundation](11-testing-and-ci-foundation.md) | Quality (enabler) | High |
| 12 | [Conversion tracking (WhatsApp funnel)](12-conversion-tracking.md) | Product | High (business) |
| 13 | [Product & feature opportunities](13-product-opportunities.md) | Product | Medium |

## Recommended execution order

**11** (safety net) → **01** (critical security) → **06** (data-loss bugs) → **05** (stale content + config bug) → **02** / **03** (API correctness + perf) → **04** (homepage SSR) → **08** (dedup) → **12** (analytics) → **07**, **09**, **10** → **13** (features — needs product decisions).

Rationale: land the test/CI harness first so every subsequent change has a regression net; then fix security and data-loss issues (highest downside); then correctness/perf; then quality refactors; then analytics and features.
