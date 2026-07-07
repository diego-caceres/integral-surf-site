import { supabaseServer } from "@/lib/supabaseServer";
import { isSupabaseAuthError, SUPABASE_KEY_HINT } from "@/lib/supabaseError";

export interface SectionHeaderImage {
  image_url: string;
  alt_text: string | null;
}

export interface SectionHeaderImageWithId extends SectionHeaderImage {
  id: string;
  display_order: number;
}

export interface SectionHeaderImages<T> {
  web: T[];
  mobile: T[];
}

/**
 * Fetches the homepage hero carousel images, split into web/mobile arrays
 * ordered by display_order. Shared by the homepage (src/app/page.tsx), the
 * public API (/api/section-header-images), and the admin API
 * (/api/admin/section-header-images) — previously each of those three call
 * sites ran the same query independently with slightly different column
 * lists.
 *
 * @param includeIds - the admin UI needs each row's `id` (to know which rows
 * are being replaced) and `display_order`; the public read doesn't.
 */
export async function getSectionHeaderImages(
  includeIds: true
): Promise<SectionHeaderImages<SectionHeaderImageWithId>>;
export async function getSectionHeaderImages(
  includeIds?: false
): Promise<SectionHeaderImages<SectionHeaderImage>>;
export async function getSectionHeaderImages(
  includeIds = false
): Promise<SectionHeaderImages<SectionHeaderImage | SectionHeaderImageWithId>> {
  // Two separate literal `.select()` calls rather than one dynamic column
  // string — supabase-js parses the select string at the type level, and a
  // computed (non-literal) string defeats that parser.
  const { data, error } = includeIds
    ? await supabaseServer
        .from("section_header_images")
        .select("id, image_url, alt_text, device_type, display_order")
        .order("device_type", { ascending: true })
        .order("display_order", { ascending: true })
    : await supabaseServer
        .from("section_header_images")
        .select("image_url, alt_text, device_type")
        .order("device_type", { ascending: true })
        .order("display_order", { ascending: true });

  if (isSupabaseAuthError(error)) console.error(SUPABASE_KEY_HINT, error);

  const rows = (data ?? []) as ({ device_type: "web" | "mobile" } & (
    | SectionHeaderImage
    | SectionHeaderImageWithId
  ))[];

  // Strip device_type from each row — it's only needed to split into the
  // web/mobile buckets below, and callers' response contracts never included
  // it on the individual image objects.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const strip = ({ device_type, ...rest }: (typeof rows)[number]) => rest;

  return {
    web: rows.filter((r) => r.device_type === "web").map(strip),
    mobile: rows.filter((r) => r.device_type === "mobile").map(strip),
  };
}
