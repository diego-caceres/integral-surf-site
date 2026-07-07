/**
 * Shared Cache-Control for public, read-only content endpoints. Content
 * changes rarely and admin mutations trigger `revalidatePath` for the pages
 * that render server-side (see src/lib/revalidate.ts) — this header is what
 * keeps the *client-fetched* copies (Navbar, sliders, etc.) from hammering
 * Supabase on every request in the meantime.
 *
 * Never apply this to `/api/admin/*` routes or to error responses.
 */
export const READ_CACHE = "public, s-maxage=300, stale-while-revalidate=600";
