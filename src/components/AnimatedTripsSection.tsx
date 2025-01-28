"use client";
import { motion } from "framer-motion";
import Link from "next/link";

import { trips } from "@/constants";

export default function AnimatedTripsSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="mt-12 text-center"
    >
      <h2 className="text-4xl md:text-5xl font-serif text-primary">
        Nuestros Destinos
      </h2>
      <p className="mt-4 max-w-2xl mx-auto text-lg text-textPrimary">
        Explora los destinos más icónicos para surfear, seleccionados para
        brindarte la mejor experiencia de aventura y adrenalina.
      </p>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
        {trips.map((trip) => {
          return (
            <div
              key={trip.id}
              className="bg-secondary p-6 rounded-lg shadow-md"
            >
              <Link href={`/viajes/${trip.slug}`} passHref>
                <p className="mb-2 bg-black text-white uppercase p-2 rounded text-[11px]">
                  {trip.destiny}
                </p>
                <h3 className="text-xl font-serif text-primary">
                  {trip.title}
                </h3>
                <p className="mt-2 text-sm">
                  {trip.date} {trip.date2}
                </p>
                <p className="mt-2 bg-red-600 text-white uppercase p-2 rounded text-[10px]">
                  {trip.seats} cupos disponibles
                </p>
              </Link>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
