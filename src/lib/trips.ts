import { unstable_cache } from "next/cache";
import { supabaseServer } from "@/lib/supabaseServer";

/**
 * Reads a single value from the general_configurations table.
 */
export async function getConfigValue(key: string): Promise<string | null> {
  const { data } = await supabaseServer
    .from("general_configurations")
    .select("config_value")
    .eq("config_key", key)
    .single();

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
