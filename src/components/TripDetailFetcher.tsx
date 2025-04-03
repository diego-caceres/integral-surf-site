"use client";

import { Trip } from "@/types/trip";
import { useEffect, useState } from "react";
import TripDetail from "./TripDetail";
import TripDetailSkeleton from "./TripDetailSkeleton";

interface TripDataFetcherProps {
  slug: string;
}

export default function TripDetailFetcher({ slug }: TripDataFetcherProps) {
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTrip() {
      if (!slug) return;

      try {
        setLoading(true);

        // Fetch the trip data from our API route
        const response = await fetch(`/api/trips/slug/${slug}`);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch trip data");
        }

        const tripData: Trip = await response.json();
        setTrip(tripData);
      } catch (err) {
        console.error("Error fetching trip:", err);
        setError(err instanceof Error ? err.message : "Failed to load trip");
      } finally {
        setLoading(false);
      }
    }

    fetchTrip();
  }, [slug]);

  // const trip = trips.find((trip) => trip.slug === slug);

  // if (!trip) {
  //   return <div className="text-center text-red-500">Viaje no encontrado.</div>;
  // }

  if (loading) return <TripDetailSkeleton />;
  if (error) return <div className="text-center text-red-500 p-8">{error}</div>;
  if (!trip)
    return <div className="text-center text-gray-500 p-8">No trip found</div>;

  return (
    <div>
      <TripDetail trip={trip} />
    </div>
  );
}
