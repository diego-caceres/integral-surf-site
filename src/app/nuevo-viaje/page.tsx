"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import type { Trip, TripContent } from "@/types/trip";
import { EMPTY_TRIP, EMPTY_CONTENT } from "@/lib/tripDefaults";
import TripForm from "@/components/trips/TripForm";

export default function NuevoViaje() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (form: Trip, contents: TripContent[]) => {
    try {
      setIsSubmitting(true);
      const viajeId = crypto.randomUUID();

      // id/created_at/updated_at are DB-managed columns carrying placeholder
      // "" values from EMPTY_TRIP (Trip requires them, but the create form
      // never lets a user edit them) — strip them out and let the database
      // set created_at/updated_at, with the freshly generated id instead.
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id: _placeholderId, created_at, updated_at, ...tripFields } = form;

      const response = await fetch("/api/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...tripFields, id: viajeId, contents }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to create trip");
      }

      toast.success("Viaje agregado correctamente");
      router.push("/admin/trips");
    } catch (err) {
      console.error("Error al agregar viaje:", err);
      toast.error(err instanceof Error ? err.message : "Error al agregar el viaje");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-6">Agregar Nuevo Viaje</h1>
      <TripForm
        initialTrip={EMPTY_TRIP}
        initialContents={[EMPTY_CONTENT]}
        onSubmit={handleSubmit}
        submitting={isSubmitting}
        submitLabel="Guardar Viaje"
      />
    </div>
  );
}
