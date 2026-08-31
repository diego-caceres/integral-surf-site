import SectionOurPurpose from "@/components/home/SectionOurPurpose";
import SectionCalendar from "@/components/home/SectionCalendar";
import SectionTheRoad from "@/components/home/SectionTheRoad";
import SectionCoaching from "@/components/home/SectionCoaching";
import SectionExperiences from "@/components/home/SectionExperiences";
import SectionInstagram from "@/components/home/SectionInstagram";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import SectionHeader from "@/components/home/SectionHeader";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import { getCachedConfigValue, getActiveTripSummaries } from "@/lib/trips";
import { getHomeSectionsList } from "@/lib/homeSections";
import { getSectionHeaderImages } from "@/lib/sectionHeaderImages";
import type { HomeSection } from "@/types/homeSections";

// Static (ISR): this page previously inherited a 1h revalidate implicitly
// from the Footer's `unstable_cache` (getCachedConfigValue) being present in
// the tree. Making it explicit here means the behavior survives a Footer
// refactor. Admin edits to homepage content bypass this via revalidatePath
// (see src/lib/revalidate.ts) and show up immediately regardless.
export const revalidate = 3600;

async function getHeaderData() {
  // The header title lives in `general_configurations` (config_key/config_value),
  // the same table the admin config UI and every /api/config/[key] read use.
  // A previous version of this query read from a `configurations` table
  // (key/value columns) that no longer exists in the schema — that query
  // errored on every request and silently fell back to the hardcoded
  // default below, so admin edits to the title never reached the homepage.
  const [images, title] = await Promise.all([
    getSectionHeaderImages(),
    getCachedConfigValue("section_header_main_title"),
  ]);

  return {
    web: images.web,
    mobile: images.mobile,
    title: title || "Viajes al Mar",
  };
}

async function getHomeSections(): Promise<Record<string, HomeSection>> {
  const sections = await getHomeSectionsList();
  const map: Record<string, HomeSection> = {};
  for (const s of sections) {
    map[s.section_key] = s;
  }
  return map;
}

export default async function HomePage() {
  const [homeSections, headerData, trips, destinosTitle] = await Promise.all([
    getHomeSections(),
    getHeaderData(),
    getActiveTripSummaries(),
    getCachedConfigValue("menu_destinos_title"),
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
        <SectionCalendar trips={trips} title={destinosTitle || "DESTINOS 2026"} />
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
