import { trips } from "@/constants";
import TripDetail from "@/components/TripDetail";

export async function generateStaticParams() {
  return trips.map((trip) => ({
    id: trip.id,
  }));
}

export default async function TripPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  const trip = trips.find((trip) => trip.slug === slug);

  if (!trip) {
    return <div className="text-center text-red-500">Viaje no encontrado.</div>;
  }

  return (
    <div>
      <TripDetail trip={trip} />
    </div>
  );
}
