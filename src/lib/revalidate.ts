import { revalidatePath } from "next/cache";

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
