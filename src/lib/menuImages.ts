import { supabaseServer } from "@/lib/supabaseServer";
import { isSupabaseAuthError, SUPABASE_KEY_HINT } from "@/lib/supabaseError";
import { cache } from "react";

export interface MenuItemImage {
  url: string;
  alt: string;
}

export interface MenuImagesData {
  [menuItemTitle: string]: MenuItemImage[];
}

/**
 * Fetches the mega-menu images, grouped by menu item title. Shared by the
 * public `/api/menu-images` route and the server-rendered Navbar (see
 * src/components/layout/NavbarData.tsx) so both consume the same query.
 */
export const getMenuImages = cache(async function getMenuImages(): Promise<MenuImagesData> {
  const { data, error } = await supabaseServer
    .from("menu_item_images")
    .select("menu_item_title, image_url, alt_text, display_order")
    .order("menu_item_title")
    .order("display_order", { ascending: true });

  if (isSupabaseAuthError(error)) console.error(SUPABASE_KEY_HINT, error);
  if (!data) return {};

  const grouped: MenuImagesData = {};
  for (const item of data as {
    menu_item_title: string;
    image_url: string;
    alt_text: string | null;
  }[]) {
    const bucket = grouped[item.menu_item_title];
    const image = { url: item.image_url, alt: item.alt_text || "" };
    if (bucket) bucket.push(image);
    else grouped[item.menu_item_title] = [image];
  }
  return grouped;
});
