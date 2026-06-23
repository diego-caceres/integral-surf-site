import { notFound } from "next/navigation";
import TripDetail from "@/components/trips/TripDetail";
import { getTripBySlug, getConfigValue } from "@/lib/trips";

const DEFAULT_PHONE = "+59899748323";

export default async function TripPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!slug) notFound();

  const [trip, phoneNumber] = await Promise.all([
    getTripBySlug(slug),
    getConfigValue("whatsapp_phone_number"),
  ]);

  if (!trip) notFound();

  return <TripDetail trip={trip} phoneNumber={phoneNumber ?? DEFAULT_PHONE} />;
}
