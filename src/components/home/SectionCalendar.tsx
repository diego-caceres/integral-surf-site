import TripCard from "@/components/trips/TripCard";
import { TripSummary } from "@/types/trip";

interface SectionCalendarProps {
  trips: TripSummary[];
  title: string;
}

// Server-rendered: `trips` and `title` are fetched by the pages that render
// this (src/app/page.tsx, src/app/viajes/page.tsx) via
// getActiveTripSummaries()/getCachedConfigValue() directly from Supabase, so
// the calendar is present in the initial HTML instead of appearing after a
// client-side fetch (previously this was a "use client" component that
// fetched /api/trips on mount, showing a spinner and hiding the trip list
// from crawlers).
const SectionCalendar: React.FC<SectionCalendarProps> = ({ trips, title }) => {
  // On empty, degrade to a friendly message rather than nothing — the rest
  // of the page stays usable.
  if (trips.length === 0) {
    return (
      <section className="w-full xl-surf:min-h-[90vh] md:px-20 pt-10 pb-10 md:py-20">
        <div className="px-2 md:px-5">
          <h2 className="font-[Eckmannpsych] text-redColor tracking-[0.1rem]">
            {title}
          </h2>
          <div className="container mx-auto px-4 py-8 text-center">
            <p className="text-xl">No hay viajes disponibles por el momento.</p>
          </div>
        </div>
      </section>
    );
  }

  // Split trips: even pairs go into two columns, odd last trip spans both
  const activeTrips = trips;
  let pairedTrips: TripSummary[];
  let lastTrip: TripSummary | null = null;

  if (activeTrips.length % 2 !== 0) {
    lastTrip = activeTrips[activeTrips.length - 1];
    pairedTrips = activeTrips.slice(0, activeTrips.length - 1);
  } else {
    pairedTrips = activeTrips;
  }

  // Interleave into [left0, right0, left1, right1, ...] so CSS grid rows align heights
  const half = pairedTrips.length / 2;
  const leftTrips = pairedTrips.slice(0, half);
  const rightTrips = pairedTrips.slice(half);
  const gridItems: TripSummary[] = [];
  for (let i = 0; i < half; i++) {
    gridItems.push(leftTrips[i]);
    gridItems.push(rightTrips[i]);
  }

  return (
    <section className="w-full xl-surf:min-h-[90vh] md:px-20 pt-10 pb-10 md:py-20">
      <div className="px-2 md:px-5">
        <h2 className="font-[Eckmannpsych] text-redColor tracking-[0.1rem]">
          {title}
        </h2>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 xl-surf:grid-cols-2 gap-4 items-stretch">
            {gridItems.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>

          {lastTrip && (
            <div className="flex justify-center mt-4">
              <div className="w-full xl-surf:w-1/2">
                <TripCard trip={lastTrip} />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default SectionCalendar;
