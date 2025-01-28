import { trips } from "@/constants";
import TripDetail from "@/components/TripDetail";

interface TripPageProps {
  params: { id: string };
}

export async function generateStaticParams() {
  return trips.map((trip) => ({
    id: trip.id,
  }));
}

export default async function TripPage({ params }: TripPageProps) {
  const { id } = await params;
  const trip = trips.find((trip) => trip.id === id);

  if (!trip) {
    return <div className="text-center text-red-500">Viaje no encontrado.</div>;
  }

  return (
    <div>
      <TripDetail trip={trip} />
    </div>
  );
}
