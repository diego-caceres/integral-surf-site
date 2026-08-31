import { cache } from "react";
import { unstable_cache } from "next/cache";
import { supabaseServer } from "@/lib/supabaseServer";
import { isSupabaseAuthError, SUPABASE_KEY_HINT } from "@/lib/supabaseError";
import { Trip, TripContent, TripContentImage, TripSummary } from "@/types/trip";

type NestedContent = TripContent & {
  trip_content_images?: TripContentImage[];
};

/**
 * Sorts a trip's nested `trip_contents(*, trip_content_images(*))` result
 * (Supabase doesn't guarantee nested ordering) and renames `trip_content_images`
 * to `images` to match the shape the rest of the app expects. Shared by every
 * call site that fetches a trip via a single nested select instead of the
 * previous per-content, per-image N+1 query loops.
 */
export function normalizeTripContents(
  nested: NestedContent[] | null | undefined
): TripContent[] {
  return (nested ?? [])
    .slice()
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map(({ trip_content_images, ...content }) => ({
      ...content,
      images: (trip_content_images ?? [])
        .slice()
        .sort((a, b) => (a.order_number ?? 0) - (b.order_number ?? 0)),
    }));
}

/**
 * Fetches a trip (with its ordered contents and content images) by slug,
 * directly from Supabase. Used by Server Components so the data — and the
 * header image URL in particular — is present in the initial HTML.
 *
 * Wrapped in React.cache: generateMetadata and the page component on
 * /viajes/[slug] both call this per request, and without the wrapper that's
 * two round-trips to Supabase for the same row on every render.
 */
export const getTripBySlug = cache(async function getTripBySlug(
  slug: string
): Promise<Trip | null> {
  // Single round-trip: trip + its contents + each content's images, instead of
  // one query per content block (the previous N+1).
  const { data: tripData, error: tripError } = await supabaseServer
    .from("trips")
    .select("*, trip_contents(*, trip_content_images(*))")
    .eq("slug", slug)
    .single();

  if (tripError || !tripData) {
    // A rejected key would otherwise silently 404 every trip page — make it loud.
    if (isSupabaseAuthError(tripError)) console.error(SUPABASE_KEY_HINT, tripError);
    return null;
  }

  const { trip_contents, ...tripFields } = tripData as Omit<
    Trip,
    "trip_contents"
  > & { trip_contents?: NestedContent[] };

  return { ...tripFields, trip_contents: normalizeTripContents(trip_contents) };
});

/**
 * Reads a single value from the general_configurations table. Wrapped in
 * React.cache so multiple reads of the same key within one request (e.g. the
 * footer and a page both reading `whatsapp_phone_number`) share one query.
 */
export const getConfigValue = cache(async function getConfigValue(
  key: string
): Promise<string | null> {
  const { data, error } = await supabaseServer
    .from("general_configurations")
    .select("config_value")
    .eq("config_key", key)
    .single();

  if (isSupabaseAuthError(error)) console.error(SUPABASE_KEY_HINT, error);

  return data?.config_value ?? null;
});

/**
 * Cached variant of getConfigValue. Used in shared layout chrome (e.g. the
 * footer, present on every page) so reading a config value doesn't opt every
 * static page into dynamic rendering. Revalidates hourly.
 */
export function getCachedConfigValue(key: string): Promise<string | null> {
  return unstable_cache(() => getConfigValue(key), [`config:${key}`], {
    revalidate: 3600,
    tags: [`config:${key}`],
  })();
}

/**
 * Fetches every active trip's summary fields, ordered for display — the
 * same shape and filter public `GET /api/trips` returns, fetched directly
 * from Supabase for use in Server Components (the homepage and navbar) so
 * the trip menu/calendar are present in the initial HTML instead of
 * appearing after a client-side fetch.
 */
export const getActiveTripSummaries = cache(
  async function getActiveTripSummaries(): Promise<TripSummary[]> {
    const { data, error } = await supabaseServer
      .from("trips")
      .select(
        "id, slug, title, title_2, destiny, coaching_subtitle, date_month, date_days, date_month_2, date_days_2, order"
      )
      .eq("is_deleted", false)
      .order("order", { ascending: true });

    if (isSupabaseAuthError(error)) console.error(SUPABASE_KEY_HINT, error);

    return data ?? [];
  }
);

/**
 * Given the trip_content rows that currently exist for a trip and the
 * content list an admin edit is saving, returns the ids that should be
 * deleted (existing rows whose id is absent from the incoming list).
 *
 * Extracted as a pure function because the original implementation —
 * `.not("id", "in", contentIds)` with a raw JS array passed as the `in`
 * value — silently matched nothing: PostgREST's `.not(col, op, value)`
 * requires the value pre-formatted as a string like "(id1,id2)" for the
 * `in` operator, not a plain array. Removed content blocks were never
 * actually deleted. Diffing in JS and deleting via `.in("id", ids)` (which
 * *does* accept a plain array) avoids that filter-string footgun entirely.
 */
export function computeContentIdsToDelete(
  existingIds: string[],
  incomingContents: { id?: string | null }[]
): string[] {
  const keepIds = new Set(
    incomingContents.map((c) => c.id).filter((id): id is string => Boolean(id))
  );
  return existingIds.filter((id) => !keepIds.has(id));
}
