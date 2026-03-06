"use client";
import { useEffect, useState } from "react";
import TripCard from "@/components/TripCard";
import { Trip } from "@/types/trip";
import LogoLoader from "./ui/LogoLoader";

const SectionCalendar: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [calendarTitle, setCalendarTitle] = useState("{calendarTitle}");

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/trips");

        if (!res.ok) {
          throw new Error("Failed to fetch trips");
        }

        const data = await res.json();
        // Filter out soft-deleted trips
        const activeTrips = data.filter((trip: Trip) => !trip.is_deleted);
        setTrips(activeTrips);
      } catch (err) {
        console.error("Error fetching trips:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    const fetchCalendarTitle = async () => {
      try {
        const response = await fetch("/api/config/menu_destinos_title");
        if (response.ok) {
          const data = await response.json();
          if (data.value) {
            setCalendarTitle(data.value);
          }
        }
      } catch (error) {
        console.error("Error fetching calendar title:", error);
      }
    };

    fetchTrips();
    fetchCalendarTitle();
  }, []);

  if (isLoading) {
    return (
      <section className="w-full min-[1190px]:min-h-[90vh] md:px-20 pt-10 pb-10 md:py-20">
        <LogoLoader size={60} />
      </section>
    );
  }

  if (error) {
    return (
      <div className="w-full min-[1190px]:min-h-[90vh] md:px-20 pt-10 pb-10 md:py-20 flex justify-center items-center">
        <div className="text-red-500 text-center">
          <p className="text-xl font-bold">Error loading trips</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (trips.length === 0) {
    return (
      <section className="w-full min-[1190px]:min-h-[90vh] md:px-20 pt-10 pb-10 md:py-20">
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
    <section className="w-full min-[1190px]:min-h-[90vh] md:px-20 pt-10 pb-10 md:py-20">
      <div className="px-2 md:px-5">
        <h2 className="font-[Eckmannpsych] text-redColor tracking-[0.1rem]">
          {calendarTitle}
        </h2>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 min-[1190px]:grid-cols-2 gap-4 items-stretch">
            {gridItems.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>

          {lastTrip && (
            <div className="flex justify-center mt-4">
              <div className="w-full min-[1190px]:w-1/2">
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
