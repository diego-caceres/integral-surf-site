import type { MetadataRoute } from "next";
import { supabaseServer } from "@/lib/supabaseServer";
import { SITE_URL } from "@/lib/site";

// Regenerate the sitemap at most once an hour rather than on every request.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/viajes`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/fundamentos`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.6 },
  ];

  const { data: trips } = await supabaseServer
    .from("trips")
    .select("slug, updated_at")
    .eq("is_deleted", false);

  const tripRoutes: MetadataRoute.Sitemap = (trips ?? []).map((trip) => ({
    url: `${SITE_URL}/viajes/${trip.slug}`,
    lastModified: trip.updated_at ? new Date(trip.updated_at) : undefined,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...tripRoutes];
}
