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

export default function HomePage() {
  // const { data: trips, error } = await supabase.from("trips").select("*");
  // console.log("trips", trips);
  // console.log("error", error);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [viajes, setViajes] = useState<any[]>([]);

  useEffect(() => {
    const fetchViajes = async () => {
      const res = await fetch("/api/trips"); // 🔐 Ahora consultamos nuestra API segura
      const data = await res.json();
      setViajes(data);
    };

    fetchViajes();
  }, []);

  console.log("viajes", viajes);

  return (
    <section className="mx-auto text-center">
      {/* Hero Image Section */}
      <SectionHeader title="Viajes al mar" />

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
