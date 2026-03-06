"use client";

import SectionOurPurpose from "@/components/SectionOurPurpose";
import SectionCalendar from "@/components/SectionCalendar";
import SectionTheRoad from "@/components/SectionTheRoad";
import SectionCoaching from "@/components/SectionCoaching";
import SectionExperiences from "@/components/SectionExperiences";
import SectionInstagram from "@/components/SectionInstagram";
import WhatsAppButton from "@/components/WhatsAppButton";
import SectionHeader from "@/components/SectionHeader";
import { useEffect, useState } from "react";
import type { HomeSection } from "@/types/homeSections";

const HOME_SECTIONS_CACHE_KEY = "integral_home_sections";

function buildSectionsMap(data: HomeSection[]): Record<string, HomeSection> {
  const map: Record<string, HomeSection> = {};
  for (const s of data) map[s.section_key] = s;
  return map;
}

export default function HomePage() {
  const [homeSections, setHomeSections] = useState<Record<string, HomeSection>>({});

  useEffect(() => {
    // Load from cache immediately (no flash of defaults)
    try {
      const cached = localStorage.getItem(HOME_SECTIONS_CACHE_KEY);
      if (cached) setHomeSections(buildSectionsMap(JSON.parse(cached)));
    } catch { /* ignore */ }

    // Fetch fresh data in background; update only if changed
    fetch("/api/home-sections")
      .then((res) => res.json())
      .then((data: HomeSection[]) => {
        const fresh = JSON.stringify(data);
        const cached = localStorage.getItem(HOME_SECTIONS_CACHE_KEY);
        if (fresh !== cached) {
          localStorage.setItem(HOME_SECTIONS_CACHE_KEY, fresh);
          setHomeSections(buildSectionsMap(data));
        }
      })
      .catch(() => {/* keep cached data on network error */});
  }, []);

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
      />
      <SectionCalendar />
      <SectionTheRoad
        title={theRoad?.title ?? undefined}
        description={theRoad?.description ?? undefined}
        buttonText={theRoad?.button_text ?? undefined}
        imageUrl={theRoad?.image_url || undefined}
        image2Url={theRoad?.image_2_url || undefined}
        backgroundImageUrl={theRoad?.background_image_url || undefined}
      />
      <SectionCoaching
        title={coaching?.title ?? undefined}
        description={coaching?.description ?? undefined}
        buttonText={coaching?.button_text ?? undefined}
        imageUrl={coaching?.image_url || undefined}
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

// 5. Agregar imágenes con estilo retro
// Puedes aprovechar las utilidades de Tailwind para aplicar un estilo a imágenes:
// <img
//   src="/images/surf-trip.jpg"
//   alt="Viaje de Surf"
//   className="w-full h-[400px] object-cover rounded-lg shadow-lg"
// />
