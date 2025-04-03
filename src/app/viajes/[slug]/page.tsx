import TripDetailFetcher from "@/components/TripDetailFetcher";

export default async function TripPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;

  console.log("Slug:", slug);
  if (!slug) {
    return <div className="text-center text-red-500">Viaje no encontrado.</div>;
  }

  return (
    <div>
      <TripDetailFetcher slug={slug} />
    </div>
  );
}
