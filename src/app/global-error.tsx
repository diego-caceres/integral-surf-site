"use client";

import { useEffect } from "react";

/**
 * Last-resort boundary. Catches errors thrown in the root layout itself (where
 * the segment-level error.tsx can't reach). Must render its own <html>/<body>.
 */
export default function GlobalError({
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
    <html lang="es">
      <body
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "1.5rem",
          fontFamily: "system-ui, sans-serif",
          color: "#0E1A1B",
          background: "#FFFFFF",
        }}
      >
        <h1 style={{ fontSize: "1.75rem", marginBottom: "0.75rem" }}>
          Integral Surf
        </h1>
        <p style={{ maxWidth: "28rem", marginBottom: "1.5rem", opacity: 0.7 }}>
          Estamos teniendo problemas para cargar el sitio. Por favor, intentá de
          nuevo en unos instantes.
        </p>
        <button
          onClick={reset}
          style={{
            padding: "0.5rem 1.25rem",
            borderRadius: "0.375rem",
            background: "#E4572E",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
        >
          Reintentar
        </button>
      </body>
    </html>
  );
}
