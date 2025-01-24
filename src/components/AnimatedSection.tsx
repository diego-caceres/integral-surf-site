"use client";
import { motion } from "framer-motion";

export default function AnimatedSection() {
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
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-secondary p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-serif text-primary">Bali</h3>
          <p className="mt-2 text-textPrimary">
            Olas perfectas y paisajes paradisíacos.
          </p>
        </div>
        <div className="bg-secondary p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-serif text-primary">Costa Rica</h3>
          <p className="mt-2 text-textPrimary">
            Playas vírgenes y excelente clima todo el año.
          </p>
        </div>
        <div className="bg-secondary p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-serif text-primary">Australia</h3>
          <p className="mt-2 text-textPrimary">
            Hogar de los mejores surfistas del mundo.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
