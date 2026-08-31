import { supabaseServer } from "@/lib/supabaseServer";
import type { HomeSection, HomeSectionImage } from "@/types/homeSections";

/**
 * Fetches every home section with its slideshow images attached, in exactly
 * two Supabase round-trips regardless of how many sections/images exist.
 *
 * `home_section_images.section_key` is a text column, not a foreign key to
 * `home_sections.id` — PostgREST can't auto-detect that relationship for a
 * nested `select("*, home_section_images(*)")`, so this fetches both tables
 * in parallel and groups the images in memory instead. (Previously this was
 * 1 query for the sections + 1 more query per individual section for its
 * images — an N+1 that both `/api/home-sections` and
 * `/api/admin/home-sections` duplicated.)
 */
export async function getHomeSectionsList(): Promise<HomeSection[]> {
  const [sectionsResult, imagesResult] = await Promise.all([
    supabaseServer.from("home_sections").select("*").order("section_key"),
    supabaseServer
      .from("home_section_images")
      .select("id, image_url, alt_text, order_number, section_key")
      .order("order_number", { ascending: true }),
  ]);

  if (sectionsResult.error || !sectionsResult.data) return [];

  const imagesBySection = new Map<string, HomeSectionImage[]>();
  for (const img of (imagesResult.data ?? []) as (HomeSectionImage & {
    section_key: string;
  })[]) {
    const { section_key, ...image } = img;
    const bucket = imagesBySection.get(section_key);
    if (bucket) bucket.push(image);
    else imagesBySection.set(section_key, [image]);
  }

  return sectionsResult.data.map((section) => ({
    ...section,
    images: imagesBySection.get(section.section_key) ?? [],
  }));
}
