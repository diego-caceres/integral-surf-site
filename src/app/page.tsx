import SectionOurPurpose from "@/components/home/SectionOurPurpose";
import SectionCalendar from "@/components/home/SectionCalendar";
import SectionTheRoad from "@/components/home/SectionTheRoad";
import SectionCoaching from "@/components/home/SectionCoaching";
import SectionExperiences from "@/components/home/SectionExperiences";
import SectionInstagram from "@/components/home/SectionInstagram";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import SectionHeader from "@/components/home/SectionHeader";
import { supabaseServer } from "@/lib/supabaseServer";
import type { HomeSection } from "@/types/homeSections";

async function getHomeSections(): Promise<Record<string, HomeSection>> {
  const { data, error } = await supabaseServer.from("home_sections").select("*");
  if (error || !data) return {};

  const enriched = await Promise.all(
    data.map(async (section) => {
      const { data: images } = await supabaseServer
        .from("home_section_images")
        .select("*")
        .eq("section_key", section.section_key)
        .order("order_number", { ascending: true });
      return { ...section, images: images || [] };
    })
  );

  const map: Record<string, HomeSection> = {};
  for (const s of enriched) map[s.section_key] = s;
  return map;
}

export default async function HomePage() {
  const homeSections = await getHomeSections();

  const ourPurpose = homeSections["our_purpose"];
  const theRoad = homeSections["the_road"];
  const coaching = homeSections["coaching"];
  const experiences = homeSections["experiences"];

  return (
    <section className="mx-auto text-center">
      {/* Hero Image Section */}
      <SectionHeader />

      <SectionOurPurpose
        title={ourPurpose?.title ?? undefined}
        description={ourPurpose?.description ?? undefined}
        quote={ourPurpose?.extra_text ?? undefined}
        buttonText={ourPurpose?.button_text ?? undefined}
        imageUrl={ourPurpose?.image_url || undefined}
        images={ourPurpose?.images ?? []}
      />
      <SectionCalendar />
      <SectionTheRoad
        title={theRoad?.title ?? undefined}
        description={theRoad?.description ?? undefined}
        buttonText={theRoad?.button_text ?? undefined}
        imageUrl={theRoad?.image_url || undefined}
        image2Url={theRoad?.image_2_url || undefined}
        backgroundImageUrl={theRoad?.background_image_url || undefined}
        images={theRoad?.images ?? []}
      />
      <SectionCoaching
        title={coaching?.title ?? undefined}
        description={coaching?.description ?? undefined}
        buttonText={coaching?.button_text ?? undefined}
        imageUrl={coaching?.image_url || undefined}
        images={coaching?.images ?? []}
      />
      <SectionExperiences
        title={experiences?.title ?? undefined}
        description={experiences?.description ?? undefined}
        videoUrl={experiences?.video_url || undefined}
        backgroundImageUrl={experiences?.background_image_url || undefined}
      />
      <SectionInstagram />

      <WhatsAppButton onlyBubble />
    </section>
  );
}
