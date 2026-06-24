import { unstable_cache } from "next/cache";
import { supabaseServer } from "@/lib/supabaseServer";
import { isSupabaseAuthError, SUPABASE_KEY_HINT } from "@/lib/supabaseError";
import { Trip, TripContent, TripContentImage } from "@/types/trip";

/**
 * Fetches a trip (with its ordered contents and content images) by slug,
 * directly from Supabase. Used by Server Components so the data — and the
 * header image URL in particular — is present in the initial HTML.
 */
export async function getTripBySlug(slug: string): Promise<Trip | null> {
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

  // Supabase doesn't guarantee nested ordering, so sort in memory.
  type NestedContent = TripContent & {
    trip_content_images?: TripContentImage[];
  };
  const { trip_contents, ...tripFields } = tripData as Omit<
    Trip,
    "trip_contents"
  > & { trip_contents?: NestedContent[] };

  const enrichedContents = (trip_contents ?? [])
    .slice()
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map(({ trip_content_images, ...content }) => ({
      ...content,
      images: (trip_content_images ?? [])
        .slice()
        .sort((a, b) => (a.order_number ?? 0) - (b.order_number ?? 0)),
    }));

  return { ...tripFields, trip_contents: enrichedContents };
}

/**
 * Reads a single value from the general_configurations table.
 */
export async function getConfigValue(key: string): Promise<string | null> {
  const { data, error } = await supabaseServer
    .from("general_configurations")
    .select("config_value")
    .eq("config_key", key)
    .single();

  if (isSupabaseAuthError(error)) console.error(SUPABASE_KEY_HINT, error);

  return data?.config_value ?? null;
}

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
