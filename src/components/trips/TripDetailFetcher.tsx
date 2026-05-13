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
  const [phoneNumber, setPhoneNumber] = useState<string>("+59899748323");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      if (!slug) return;

      setLoading(true);

      const [tripResponse, phoneResponse] = await Promise.all([
        fetch(`/api/trips/slug/${slug}`),
        fetch("/api/config/whatsapp_phone_number"),
      ]);

      if (!tripResponse.ok) {
        const errorData = await tripResponse.json();
        throw new Error(errorData.error || "Failed to fetch trip data");
      }

      const tripData: Trip = await tripResponse.json();
      setTrip(tripData);

      if (phoneResponse.ok) {
        const phoneData = await phoneResponse.json();
        if (phoneData.value) setPhoneNumber(phoneData.value);
      }
    }

    fetchData()
      .catch((err) => {
        if (process.env.NODE_ENV !== "production") {
          console.error("Error fetching trip:", err);
        }
        setError(err instanceof Error ? err.message : "Failed to load trip");
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <TripDetailSkeleton />;
  if (error) return <div className="text-center text-red-500 p-8">{error}</div>;
  if (!trip)
    return <div className="text-center text-gray-500 p-8">No trip found</div>;

  return (
    <div>
      <TripDetail trip={trip} phoneNumber={phoneNumber} />
    </div>
  );
}
