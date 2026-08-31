import { revalidatePath, revalidateTag } from "next/cache";

/**
 * Purge the cached public trip pages after an admin mutation (create, update,
 * delete, clone, restore) so changes appear immediately instead of waiting for
 * the hourly ISR timer.
 *
 * Using the `/viajes/[slug]` template with type "page" invalidates every trip
 * detail page at once, so callers don't need the specific slug — and it also
 * covers the case where an edit changes a trip's slug.
 *
 * Note: the homepage calendar reads `/api/trips`, which is separately CDN-cached
 * for up to 5 min (s-maxage), so it can lag briefly there even after this runs.
 */
export function revalidateTripPages(): void {
  revalidatePath("/viajes"); // trip listing
  revalidatePath("/viajes/[slug]", "page"); // every trip detail page
  revalidatePath("/"); // homepage server-rendered sections
}

/** Call after an admin write to the About page (hero + instructors). */
export function revalidateAbout(): void {
  revalidatePath("/about");
}

/** Call after an admin write to the Fundamentos page (sections/images/team). */
export function revalidateFundamentos(): void {
  revalidatePath("/fundamentos");
}

/**
 * Call after an admin write to homepage-only content that is exclusively
 * server-rendered (home sections, hero images/title): the public page has no
 * client-side refresh for this data, so without this it stays stale for up
 * to an hour (the page's ISR revalidate window).
 */
export function revalidateHome(): void {
  revalidatePath("/");
}

/**
 * Call after an admin write to content shown in shared chrome — the navbar
 * (mega-menu images) or footer (config-driven phone number) — that's
 * rendered by the root layout and therefore present on every page. Using
 * "layout" on "/" revalidates every route beneath the root layout at once;
 * that's broader than strictly necessary for any single page but safe (a
 * revalidate is a no-op if nothing actually changed) and simpler than
 * enumerating every route that happens to share the navbar/footer.
 */
export function revalidateLayout(): void {
  revalidatePath("/", "layout");
}

/**
 * Call after updating a `general_configurations` row. Busts the
 * `unstable_cache` entry `getCachedConfigValue` keeps per key (tagged
 * `config:<key>`) in addition to the shared layout — config values like the
 * WhatsApp phone number and the homepage hero title are read through that
 * cache from the footer and homepage.
 */
export function revalidateConfigKey(key: string): void {
  revalidateTag(`config:${key}`);
  revalidateLayout();
}
