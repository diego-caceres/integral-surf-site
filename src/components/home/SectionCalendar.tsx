"use client";
import { useEffect, useState } from "react";
import TripCard from "@/components/trips/TripCard";
import { Trip } from "@/types/trip";
import LogoLoader from "@/components/ui/LogoLoader";
import {
  fetchTripsOnce,
  fetchDestinosTitleOnce,
  getTripsFromCache,
  getDestinosTitleFromCache,
} from "@/lib/tripsCache";

const SectionCalendar: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [calendarTitle, setCalendarTitle] = useState("DESTINOS 2026");

  useEffect(() => {
    // Apply cache immediately after mount to avoid showing the spinner
    const cachedTrips = getTripsFromCache();
    if (cachedTrips) {
      setTrips(cachedTrips.filter((t) => !t.is_deleted));
      setIsLoading(false);
    }
    const cachedTitle = getDestinosTitleFromCache();
    if (cachedTitle) setCalendarTitle(cachedTitle);

    fetchTripsOnce()
      .then((data) => {
        setTrips(data.filter((t) => !t.is_deleted));
        setIsLoading(false);
      })
      .catch((err) => {
        if (process.env.NODE_ENV !== "production") {
          console.error("Error fetching trips:", err);
        }
        setError(err instanceof Error ? err.message : "An error occurred");
        setIsLoading(false);
      });

    fetchDestinosTitleOnce()
      .then((title) => setCalendarTitle(title))
      .catch((err) => {
        if (process.env.NODE_ENV !== "production") {
          console.error("Error fetching calendar title:", err);
        }
      });
  }, []);

  if (isLoading) {
    return (
      <section className="w-full xl-surf:min-h-[90vh] md:px-20 pt-10 pb-10 md:py-20">
        <LogoLoader size={60} />
      </section>
    );
  }

  // On error, degrade to the same friendly empty state rather than a technical
  // message — the rest of the page stays usable.
  if (error || trips.length === 0) {
    return (
      <section className="w-full xl-surf:min-h-[90vh] md:px-20 pt-10 pb-10 md:py-20">
        <div className="px-2 md:px-5">
          <h2 className="font-[Eckmannpsych] text-redColor tracking-[0.1rem]">
            {calendarTitle}
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
  let pairedTrips: Trip[];
  let lastTrip: Trip | null = null;

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
  const gridItems: Trip[] = [];
  for (let i = 0; i < half; i++) {
    gridItems.push(leftTrips[i]);
    gridItems.push(rightTrips[i]);
  }

  return (
    <section className="w-full xl-surf:min-h-[90vh] md:px-20 pt-10 pb-10 md:py-20">
      <div className="px-2 md:px-5">
        <h2 className="font-[Eckmannpsych] text-redColor tracking-[0.1rem]">
          {calendarTitle}
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
