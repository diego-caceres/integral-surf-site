import Navbar from "./Navbar";
import { getActiveTripSummaries, getCachedConfigValue } from "@/lib/trips";
import { getMenuImages } from "@/lib/menuImages";

/**
 * Server component wrapper: fetches the navbar's data (active trips for the
 * mega-menu, the "destinos" section title, and the mega-menu images)
 * directly from Supabase and passes it to the client `Navbar` as props.
 * Rendered from the root layout, so this data is present in the initial
 * HTML on every page instead of appearing after a post-hydration fetch.
 */
export default async function NavbarData() {
  const [trips, destinosTitle, menuImages] = await Promise.all([
    getActiveTripSummaries(),
    getCachedConfigValue("menu_destinos_title"),
    getMenuImages(),
  ]);

  return (
    <Navbar
      initialTrips={trips}
      initialDestinosTitle={destinosTitle || "DESTINOS 2026"}
      initialMenuImages={menuImages}
    />
  );
}
