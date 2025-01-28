import AnimatedTripsSection from "@/components/AnimatedTripsSection";
import Link from "next/link";

export default function HomePage() {
  return (
    <section className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 text-center py-20">
      <h1 className="text-5xl md:text-7xl font-serif">
        Explora el <span className="text-accent">Mar</span>
      </h1>
      <p className="mt-6 max-w-3xl mx-auto">
        Sumérgete en la cultura del surf con nuestros viajes a destinos
        increíbles alrededor del mundo.
      </p>
      <div className="mt-10">
        <Link href="/viajes" className="btn-primary">
          Ver Viajes
        </Link>
      </div>
      {/* Sección animada de destinos */}
      <AnimatedTripsSection />
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
