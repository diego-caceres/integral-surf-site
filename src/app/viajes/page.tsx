import type { Metadata } from "next";
import SectionCalendar from "@/components/home/SectionCalendar";
import { getActiveTripSummaries, getCachedConfigValue } from "@/lib/trips";

export const metadata: Metadata = {
  title: "Viajes al Mar",
  description: "Descubrí nuestros destinos de surf, yoga y naturaleza para 2026. Viajes en grupo con coaching profesional.",
};

// Static (ISR). Trip mutations call revalidatePath("/viajes") (see
// src/lib/revalidate.ts) and show up immediately; this is just the fallback
// ceiling on staleness if that somehow doesn't fire.
export const revalidate = 3600;

export default async function Viajes() {
  const [trips, destinosTitle] = await Promise.all([
    getActiveTripSummaries(),
    getCachedConfigValue("menu_destinos_title"),
  ]);

  return (
    <div className="mx-auto md:px-12 lg:px-20 text-center">
      <SectionCalendar trips={trips} title={destinosTitle || "DESTINOS 2026"} />
    </div>
  );
}
