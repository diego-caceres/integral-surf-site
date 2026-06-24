import SectionOurPurpose from "@/components/home/SectionOurPurpose";
import SectionCalendar from "@/components/home/SectionCalendar";
import SectionTheRoad from "@/components/home/SectionTheRoad";
import SectionCoaching from "@/components/home/SectionCoaching";
import SectionExperiences from "@/components/home/SectionExperiences";
import SectionInstagram from "@/components/home/SectionInstagram";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import SectionHeader from "@/components/home/SectionHeader";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import { supabaseServer } from "@/lib/supabaseServer";
import type { HomeSection, HomeSectionImage } from "@/types/homeSections";

interface SectionHeaderImage {
  image_url: string;
  alt_text: string | null;
  device_type: string;
}

async function getHeaderData() {
  const [imagesResult, titleResult] = await Promise.all([
    supabaseServer
      .from("section_header_images")
      .select("image_url, alt_text, device_type")
      .order("device_type", { ascending: true })
      .order("display_order", { ascending: true }),
    supabaseServer
      .from("configurations")
      .select("value")
      .eq("key", "section_header_main_title")
      .maybeSingle(),
  ]);

  const images = (imagesResult.data || []) as SectionHeaderImage[];
  return {
    web: images
      .filter((img) => img.device_type === "web")
      .map(({ image_url, alt_text }) => ({ image_url, alt_text })),
    mobile: images
      .filter((img) => img.device_type === "mobile")
      .map(({ image_url, alt_text }) => ({ image_url, alt_text })),
    title: titleResult.data?.value || "Viajes al Mar",
  };
}

async function getHomeSections(): Promise<Record<string, HomeSection>> {
  const [sectionsResult, imagesResult] = await Promise.all([
    supabaseServer.from("home_sections").select("*"),
    supabaseServer
      .from("home_section_images")
      .select("id, image_url, alt_text, order_number, section_key")
      .order("order_number", { ascending: true }),
  ]);

  if (sectionsResult.error || !sectionsResult.data) return {};

  const imageMap: Record<string, HomeSectionImage[]> = {};
  for (const img of (imagesResult.data || []) as (HomeSectionImage & { section_key: string })[]) {
    const key = img.section_key;
    if (!imageMap[key]) imageMap[key] = [];
    imageMap[key].push({ id: img.id, image_url: img.image_url, alt_text: img.alt_text, order_number: img.order_number });
  }

  const map: Record<string, HomeSection> = {};
  for (const s of sectionsResult.data) {
    map[s.section_key] = { ...s, images: imageMap[s.section_key] || [] };
  }
  return map;
}

export default async function HomePage() {
  const [homeSections, headerData] = await Promise.all([
    getHomeSections(),
    getHeaderData(),
  ]);

  const ourPurpose = homeSections["our_purpose"];
  const theRoad = homeSections["the_road"];
  const coaching = homeSections["coaching"];
  const experiences = homeSections["experiences"];

  return (
    <section className="mx-auto text-center">
      {/* Each section is isolated: if one throws, the others still render. */}
      <ErrorBoundary name="SectionHeader">
        <SectionHeader
          initialWebImages={headerData.web}
          initialMobileImages={headerData.mobile}
          initialTitle={headerData.title}
        />
      </ErrorBoundary>

      <ErrorBoundary name="SectionOurPurpose">
        <SectionOurPurpose
          title={ourPurpose?.title ?? undefined}
          description={ourPurpose?.description ?? undefined}
          quote={ourPurpose?.extra_text ?? undefined}
          buttonText={ourPurpose?.button_text ?? undefined}
          imageUrl={ourPurpose?.image_url || undefined}
          images={ourPurpose?.images ?? []}
        />
      </ErrorBoundary>
      <ErrorBoundary name="SectionCalendar">
        <SectionCalendar />
      </ErrorBoundary>
      <ErrorBoundary name="SectionTheRoad">
        <SectionTheRoad
          title={theRoad?.title ?? undefined}
          description={theRoad?.description ?? undefined}
          buttonText={theRoad?.button_text ?? undefined}
          imageUrl={theRoad?.image_url || undefined}
          image2Url={theRoad?.image_2_url || undefined}
          backgroundImageUrl={theRoad?.background_image_url || undefined}
          images={theRoad?.images ?? []}
        />
      </ErrorBoundary>
      <ErrorBoundary name="SectionCoaching">
        <SectionCoaching
          title={coaching?.title ?? undefined}
          description={coaching?.description ?? undefined}
          buttonText={coaching?.button_text ?? undefined}
          imageUrl={coaching?.image_url || undefined}
          images={coaching?.images ?? []}
        />
      </ErrorBoundary>
      <ErrorBoundary name="SectionExperiences">
        <SectionExperiences
          title={experiences?.title ?? undefined}
          description={experiences?.description ?? undefined}
          videoUrl={experiences?.video_url || undefined}
          backgroundImageUrl={experiences?.background_image_url || undefined}
        />
      </ErrorBoundary>
      <ErrorBoundary name="SectionInstagram">
        <SectionInstagram />
      </ErrorBoundary>

      <ErrorBoundary name="WhatsAppButton">
        <WhatsAppButton onlyBubble />
      </ErrorBoundary>
    </section>
  );
}
