"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Trip, TripContent } from "@/types/trip";
import TripForm from "@/components/trips/TripForm";

interface TripEditFetcherProps {
  id: string;
}

export default function TripEditFetcher({ id }: TripEditFetcherProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [trip, setTrip] = useState<Trip | null>(null);
  const [contents, setContents] = useState<TripContent[]>([]);

  useEffect(() => {
    // Helper to convert null values to empty strings for form inputs
    const sanitizeFormData = (data: Trip): Trip => {
      const sanitized = { ...data };
      const numericFields = ["price_promo", "price_final", "order"];
      for (const key in sanitized) {
        const value = sanitized[key as keyof Trip];
        if (value === null) {
          (sanitized as Record<string, unknown>)[key] = numericFields.includes(key)
            ? 0
            : "";
        }
      }
      return sanitized;
    };

    const fetchTrip = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/trips/${id}`);

        if (!res.ok) {
          throw new Error("Failed to fetch trip");
        }

        const data = await res.json();

        if (!data?.trip) {
          throw new Error("Trip data not found");
        }

        setTrip(sanitizeFormData(data.trip));

        const sanitizedContents: TripContent[] = (data.contents ?? []).map(
          (content: TripContent) => ({
            ...content,
            title: content.title ?? "",
            subtitle: content.subtitle ?? "",
            description: content.description ?? "",
            subtitle_2: content.subtitle_2 ?? "",
            description_2: content.description_2 ?? "",
            image_url: content.image_url ?? "",
            images: content.images ?? [],
          })
        );
        setContents(sanitizedContents);
      } catch (err) {
        console.error("Error fetching trip:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrip();
  }, [id]);

  const handleSubmit = async (form: Trip, formContents: TripContent[]) => {
    try {
      setIsSubmitting(true);

      const response = await fetch(`/api/trips/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trip: form,
          contents: formContents.map((content) => ({ ...content, trip_id: id })),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to update trip");
      }

      toast.success("Viaje actualizado correctamente");
      router.push("/admin/trips");
    } catch (err) {
      console.error("Error updating trip:", err);
      toast.error(err instanceof Error ? err.message : "Error al actualizar el viaje");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold text-red-500 mb-4">Error</h1>
        <p className="text-lg mb-6">{error}</p>
        <button
          onClick={() => router.back()}
          className="bg-primary text-white px-6 py-2 rounded-md hover:bg-opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          Volver
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Editar Viaje</h1>
        <div className="flex gap-2">
          <button
            type="submit"
            form="trip-form"
            disabled={isSubmitting}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-blue-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          >
            {isSubmitting ? "Guardando..." : "Guardar"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
          >
            Cancelar
          </button>
        </div>
      </div>

      {trip.updated_at && (
        <p className="text-sm text-gray-500 mb-4">
          Última actualización:{" "}
          {new Date(trip.updated_at).toLocaleString("es-AR", {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </p>
      )}

      <TripForm
        initialTrip={trip}
        initialContents={contents}
        onSubmit={handleSubmit}
        submitting={isSubmitting}
        submitLabel="Guardar Cambios"
      />
    </div>
  );
}
