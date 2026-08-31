import { supabaseServer } from "@/lib/supabaseServer";
import { isSupabaseAuthError, SUPABASE_KEY_HINT } from "@/lib/supabaseError";
import type { AboutPage } from "@/types/about";

/**
 * Fetches the About page (a single row) with its instructor list attached.
 * `about_instructors` has no foreign key back to `about_page` (there's only
 * ever one about_page row), so this is two independent parallel queries
 * rather than a nested select.
 *
 * Shared by the public page (src/app/about/page.tsx), the public API
 * (/api/about), and the admin API (/api/admin/about) — previously each of
 * those three call sites duplicated this same two-query fetch.
 */
export async function getAboutPage(): Promise<AboutPage | null> {
  const [aboutResult, instructorsResult] = await Promise.all([
    supabaseServer.from("about_page").select("*").single(),
    supabaseServer
      .from("about_instructors")
      .select("*")
      .order("order_number", { ascending: true }),
  ]);

  if (isSupabaseAuthError(aboutResult.error)) {
    console.error(SUPABASE_KEY_HINT, aboutResult.error);
  }

  if (aboutResult.error || !aboutResult.data) return null;

  return {
    ...aboutResult.data,
    instructors: instructorsResult.data ?? [],
  };
}
