"use client";

import { useEffect } from "react";

/**
 * Route-level safety net. If a page segment throws despite the per-section
 * boundaries, this renders a friendly fallback (with the shared Navbar/Footer
 * still in place) instead of a blank "Application error" screen.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center">
      <h1 className="font-[Eckmannpsych] text-3xl text-primary mb-3">
        Algo salió mal
      </h1>
      <p className="text-primary/70 max-w-md mb-6">
        No pudimos cargar esta sección en este momento. Por favor, intentá de
        nuevo en unos instantes.
      </p>
      <button
        onClick={reset}
        className="px-5 py-2 rounded-md bg-accent text-white hover:opacity-90 transition"
      >
        Reintentar
      </button>
    </section>
  );
}
