"use client";
import Button from "@/components/ui/Button";
import AnimatedTripsSection from "@/components/AnimatedTripsSection";
import Image from "next/image";
// import Link from "next/link";
// import { motion } from "framer-motion";

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

      <section className="w-full md:h-[90vh] md:px-20 md:py-20 grid grid-cols-1 md:grid-cols-2 md:gap-10">
        <div className="max-w-[660px] px-10 md:px-20 py-10 md:py-20 text-left">
          <h2 className="font-[Eckmannpsych]">Nuestro proposito</h2>
          <p className="mt-6 text-xl tracking-[0.2rem]">
            es ayudarte a lograr tus objetivos de manera consciente, ya sea
            conectar por primera vez con el surf o a mejorar tu performance
            sobre las olas.
          </p>
          <p className="mt-10 text-xl tracking-[0.2rem]">
            “Elegimos la naturaleza para interpretar lo más profundo de nuestro
            ser. El surfing, el yoga y el arte son las experiencias que nos
            permiten reencontrarnos”.
          </p>
          <Button className="mt-8">Sobre Nosotros</Button>
        </div>
        <div className="flex flex-row justify-center items-start md:items-center">
          <Image
            src="/images/home/image1.png"
            alt="Nuestro propósito"
            className="max-h-[500px]"
            width={402}
            height={500}
          />
        </div>
      </section>

      {/* <div className="mt-10">
        <Link href="/viajes" className="btn-primary">
          Ver Viajes
        </Link>
      </div> */}
      {/* Sección animada de destinos */}
      {/* <AnimatedTripsSection /> */}
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
