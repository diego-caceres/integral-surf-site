import { notFound } from "next/navigation";
import type { Metadata } from "next";
import TripDetail from "@/components/trips/TripDetail";
import { getTripBySlug, getConfigValue } from "@/lib/trips";
import { supabaseServer } from "@/lib/supabaseServer";
import { SITE_NAME, SITE_URL, absoluteUrl } from "@/lib/site";

const DEFAULT_PHONE = "+59899748323";

// Render trip pages as ISR: statically generated, served from the edge cache,
// and revalidated hourly — instead of querying Supabase on every request.
export const revalidate = 3600;

// Prebuild the known trip slugs at build time. Unknown slugs still render
// on-demand (dynamicParams defaults to true) and are then cached.
export async function generateStaticParams() {
  const { data } = await supabaseServer
    .from("trips")
    .select("slug")
    .eq("is_deleted", false);

  return (data ?? [])
    .filter((t): t is { slug: string } => Boolean(t?.slug))
    .map((t) => ({ slug: t.slug }));
}

/** Strips HTML tags and collapses whitespace, then truncates for meta tags. */
function toPlainText(html: string | undefined, max = 160): string {
  if (!html) return "";
  const text = html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const trip = await getTripBySlug(slug);

  if (!trip || trip.is_deleted) {
    return { title: "Viaje no encontrado", robots: { index: false } };
  }

  const title = [trip.title, trip.title_2].filter(Boolean).join(" ");
  const description =
    toPlainText(trip.top_subtitle) ||
    toPlainText(trip.section_1_description) ||
    `Viaje de surf a ${trip.destiny} con Integral Surf: surf, yoga y naturaleza con coaching profesional.`;
  const image = trip.header_image;
  const canonical = `/viajes/${trip.slug}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url: absoluteUrl(canonical),
      type: "website",
      ...(image ? { images: [{ url: image, alt: title }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description,
      ...(image ? { images: [image] } : {}),
    },
  };
}

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

  if (!trip || trip.is_deleted) notFound();

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: [trip.title, trip.title_2].filter(Boolean).join(" "),
    description:
      toPlainText(trip.top_subtitle) ||
      toPlainText(trip.section_1_description, 300),
    ...(trip.header_image ? { image: trip.header_image } : {}),
    brand: { "@type": "Brand", name: SITE_NAME },
    url: `${SITE_URL}/viajes/${trip.slug}`,
    ...(trip.price_final
      ? {
          offers: {
            "@type": "Offer",
            price: trip.price_final,
            priceCurrency: "USD",
            availability: "https://schema.org/InStock",
            url: `${SITE_URL}/viajes/${trip.slug}`,
          },
        }
      : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <TripDetail trip={trip} phoneNumber={phoneNumber ?? DEFAULT_PHONE} />
    </>
  );
}
