import TripEditFetcher from "@/components/TripEditFetcher";

export default async function EditTrip({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!id) {
    return <div className="text-center text-red-500">Viaje no encontrado.</div>;
  }
  return (
    <div>
      <TripEditFetcher id={id} />
    </div>
  );
}
