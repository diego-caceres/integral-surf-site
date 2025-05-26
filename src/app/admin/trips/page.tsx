"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { FaEdit, FaTrash, FaPlus, FaCopy, FaUndo } from "react-icons/fa";

type Trip = {
  id: string;
  slug: string;
  title: string;
  title_2?: string;
  destiny: string;
  date_month: string;
  date_days: string;
  order: number;
  is_deleted?: boolean;
};

export default function TripsManagement() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeletedTrips, setShowDeletedTrips] = useState(false);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/trips");

        if (!res.ok) {
          throw new Error("Failed to fetch trips");
        }

        const data = await res.json();
        setTrips(data);
      } catch (err) {
        console.error("Error fetching trips:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrips();
  }, []);

  const handleDeleteTrip = async (id: string) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar este viaje?")) {
      return;
    }

    try {
      const res = await fetch(`/api/trips/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete trip");
      }

      // Update the trips list after deletion
      setTrips(
        trips.map((trip) =>
          trip.id === id ? { ...trip, is_deleted: true } : trip
        )
      );
      toast.success("Viaje eliminado correctamente (marcado como eliminado)");
    } catch (err) {
      console.error("Error deleting trip:", err);
      toast.error("Error al eliminar el viaje");
    }
  };

  const handleCloneTrip = async (id: string) => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/trips/${id}/clone`, {
        method: "POST",
      });

      if (!res.ok) {
        throw new Error("Failed to clone trip");
      }

      const data = await res.json();

      // Add the newly cloned trip to the list
      setTrips([...trips, data.trip]);
      toast.success("Viaje clonado correctamente");
    } catch (err) {
      console.error("Error cloning trip:", err);
      toast.error("Error al clonar el viaje");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestoreTrip = async (id: string) => {
    if (!window.confirm("¿Estás seguro de que quieres restaurar este viaje?")) {
      return;
    }

    try {
      const res = await fetch(`/api/trips/${id}/restore`, {
        method: "POST",
      });

      if (!res.ok) {
        throw new Error("Failed to restore trip");
      }

      // Update the trips list after restoration
      setTrips(
        trips.map((trip) =>
          trip.id === id ? { ...trip, is_deleted: false } : trip
        )
      );
      toast.success("Viaje restaurado correctamente");
    } catch (err) {
      console.error("Error restoring trip:", err);
      toast.error("Error al restaurar el viaje");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold text-red-500 mb-4">Error</h1>
        <p className="text-lg mb-6">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-primary text-white px-6 py-2 rounded-md hover:bg-opacity-90"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Administración de Viajes</h1>
        <div className="flex items-center space-x-4">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={showDeletedTrips}
              onChange={() => setShowDeletedTrips(!showDeletedTrips)}
              className="form-checkbox h-5 w-5 text-primary rounded"
            />
            <span className="ml-2 text-sm text-gray-700">
              Mostrar Eliminados
            </span>
          </label>
          <Link
            href="/nuevo-viaje"
            className="flex items-center bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
          >
            <FaPlus className="mr-2" /> Nuevo Viaje
          </Link>
        </div>
      </div>

      {trips.filter((trip) =>
        showDeletedTrips ? trip.is_deleted : !trip.is_deleted
      ).length === 0 ? (
        <div className="text-center py-12 bg-gray-100 rounded-lg">
          <p className="text-xl text-gray-600 mb-4">
            {showDeletedTrips
              ? "No hay viajes eliminados"
              : "No hay viajes disponibles"}
          </p>
          {!showDeletedTrips && (
            <Link
              href="/nuevo-viaje"
              className="inline-flex items-center bg-primary text-white px-6 py-2 rounded-md hover:bg-opacity-90"
            >
              <FaPlus className="mr-2" /> Crear tu primer viaje
            </Link>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Destino
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Título
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Fechas
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Orden
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Slug
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {trips
                .filter((trip) =>
                  showDeletedTrips ? trip.is_deleted : !trip.is_deleted
                )
                .map((trip) => (
                  <tr
                    key={trip.id}
                    className={`hover:bg-gray-50 ${
                      trip.is_deleted ? "bg-red-50 opacity-70" : ""
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {trip.destiny}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{trip.title}</div>
                      {trip.title_2 && (
                        <div className="text-sm text-gray-500">
                          {trip.title_2}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {trip.date_month} {trip.date_days}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{trip.order}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{trip.slug}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        {trip.is_deleted ? (
                          <button
                            onClick={() => handleRestoreTrip(trip.id)}
                            className="text-yellow-600 hover:text-yellow-900 p-2"
                            title="Restaurar viaje"
                          >
                            <FaUndo />
                          </button>
                        ) : (
                          <>
                            <Link
                              href={`/admin/trips/edit/${trip.id}`}
                              className="text-blue-600 hover:text-blue-900 p-2"
                            >
                              <FaEdit />
                            </Link>
                            <button
                              onClick={() => handleCloneTrip(trip.id)}
                              className="text-green-600 hover:text-green-900 p-2"
                              title="Clonar viaje"
                            >
                              <FaCopy />
                            </button>
                            <button
                              onClick={() => handleDeleteTrip(trip.id)}
                              className="text-red-600 hover:text-red-900 p-2"
                              title="Eliminar viaje"
                            >
                              <FaTrash />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
