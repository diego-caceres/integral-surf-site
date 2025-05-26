"use client";
import { useEffect, useState } from "react";
import TripCard from "@/components/TripCard";
import { Trip } from "@/types/trip";
import LogoLoader from "./ui/LogoLoader";

const SectionCalendar: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

    fetchTrips();
  }, []);

  if (isLoading) {
    return (
      <section className="w-full md:h-[90vh] md:px-20 pt-10 md:py-20">
        <LogoLoader size={60} />;
      </section>
    );
  }

  if (error) {
    return (
      <div className="w-full md:h-[90vh] md:px-20 pt-10 md:py-20 flex justify-center items-center">
        <div className="text-red-500 text-center">
          <p className="text-xl font-bold">Error loading trips</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (trips.length === 0) {
    return (
      <section className="w-full md:h-[90vh] md:px-20 pt-10 md:py-20">
        <div className="px-2 md:px-5">
          <h2 className="font-[Eckmannpsych] text-redColor tracking-[0.1rem]">
            CALENDARIO 2025
          </h2>
          <div className="container mx-auto px-4 py-8 text-center">
            <p className="text-xl">No hay viajes disponibles por el momento.</p>
          </div>
        </div>
      </section>
    );
  }

  // Split trips into two groups for the grid layout
  const activeTrips = trips; // Assuming 'trips' state already contains only active ones

  const firstHalf = activeTrips.slice(0, Math.floor(activeTrips.length / 2));
  const secondHalf = activeTrips.slice(
    Math.floor(activeTrips.length / 2),
    activeTrips.length - 1 // Corrected to activeTrips.length -1
  );
  const lastTrip =
    activeTrips.length > 0 ? activeTrips[activeTrips.length - 1] : null;

  return (
    <section className="w-full md:h-[90vh] md:px-20 pt-10 md:py-20">
      <div className="px-2 md:px-5">
        <h2 className="font-[Eckmannpsych] text-redColor tracking-[0.1rem]">
          CALENDARIO 2025
        </h2>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4">
            {/* Left column */}
            <div>
              {firstHalf.map((trip) => (
                <div key={trip.id}>
                  <TripCard trip={trip} />
                </div>
              ))}
            </div>

            {/* Right column */}
            <div>
              {secondHalf.map((trip) => (
                <div key={trip.id}>
                  <TripCard trip={trip} />
                </div>
              ))}
            </div>
          </div>

          {/* Last trip centered below the columns */}
          {lastTrip && (
            <div className="flex justify-center md:mt-4">
              <div>
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
