"use client";
import Image from "next/image";

import SectionOurPurpose from "@/components/SectionOurPurpose";
import SectionCalendar from "@/components/SectionCalendar";
import SectionTheRoad from "@/components/SectionTheRoad";
import SectionCoaching from "@/components/SectionCoaching";
import SectionExperiences from "@/components/SectionExperiences";
import SectionInstagram from "@/components/SectionInstagram";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function HomePage() {
  return (
    <section className="mx-auto text-center">
      {/* Hero Image Section */}
      <section className="relative w-full h-[75vh]">
        {/* Desktop */}
        <Image
          src="/images/home/header.jpg"
          alt="Viajes al Mar"
          fill
          className="hidden md:flex absolute inset-0"
        />
        {/* Mobile */}
        <Image
          src="/images/home/header-mobile.png"
          alt="Viajes al Mar"
          fill
          style={{ objectFit: "cover" }}
          className="md:hidden md:flex absolute inset-0"
        />
        <div className="absolute inset-0 flex items-end md:items-center justify-center">
          <h1 className="text-white text-7xl drop-shadow-lg font-[Eckmannpsych] mb-20 md:mb-0">
            VIAJES AL MAR
          </h1>
        </div>
      </section>

      <SectionOurPurpose />
      <SectionCalendar />
      <SectionTheRoad />
      <SectionCoaching />
      <SectionExperiences />
      <SectionInstagram />

      <WhatsAppButton onlyBubble />
    </section>
  );
}

{
  /* <div className="mt-10">
  <Link href="/viajes" className="btn-primary">
    Ver Viajes
  </Link>
</div> */
}
{
  /* Sección animada de destinos */
}
{
  /* <AnimatedTripsSection /> */
}
// 5. Agregar imágenes con estilo retro
// Puedes aprovechar las utilidades de Tailwind para aplicar un estilo a imágenes:
// <img
//   src="/images/surf-trip.jpg"
//   alt="Viaje de Surf"
//   className="w-full h-[400px] object-cover rounded-lg shadow-lg"
// />
