import { unstable_cache } from "next/cache";
import { supabaseServer } from "@/lib/supabaseServer";
import { isSupabaseAuthError, SUPABASE_KEY_HINT } from "@/lib/supabaseError";
import { Trip } from "@/types/trip";

/**
 * Fetches a trip (with its ordered contents and content images) by slug,
 * directly from Supabase. Used by Server Components so the data — and the
 * header image URL in particular — is present in the initial HTML.
 */
export async function getTripBySlug(slug: string): Promise<Trip | null> {
  const { data: tripData, error: tripError } = await supabaseServer
    .from("trips")
    .select("*")
    .eq("slug", slug)
    .single();

  if (tripError || !tripData) {
    // A rejected key would otherwise silently 404 every trip page — make it loud.
    if (isSupabaseAuthError(tripError)) console.error(SUPABASE_KEY_HINT, tripError);
    return null;
  }

  const { data: contentData } = await supabaseServer
    .from("trip_contents")
    .select("*")
    .eq("trip_id", tripData.id)
    .order("order", { ascending: true });

  const enrichedContents = await Promise.all(
    (contentData || []).map(async (content) => {
      const { data: images } = await supabaseServer
        .from("trip_content_images")
        .select("*")
        .eq("trip_content_id", content.id)
        .order("order_number", { ascending: true });
      return { ...content, images: images || [] };
    })
  );

  return { ...tripData, trip_contents: enrichedContents };
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
