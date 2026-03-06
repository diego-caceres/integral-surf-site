"use client";

import { useState, useEffect, FormEvent } from "react";
import CloudinaryUploadButton from "@/components/ui/CloudinaryUploadButton";
import type { HomeSection } from "@/types/homeSections";

const SECTION_LABELS: Record<string, string> = {
  our_purpose: "Nuestro Propósito",
  the_road: "El Camino del Surf",
  coaching: "La Importancia del Coaching",
  experiences: "Experiencias Integrales",
};

const SECTION_ORDER = ["our_purpose", "the_road", "coaching", "experiences"];

type SectionsMap = Record<string, HomeSection>;

export default function ManageHomeSectionsPage() {
  const [sections, setSections] = useState<SectionsMap>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSections = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/home-sections");
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to fetch home sections");
      }
      const data: HomeSection[] = await res.json();
      const map: SectionsMap = {};
      for (const s of data) {
        map[s.section_key] = s;
      }
      setSections(map);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  const updateField = (
    key: string,
    field: keyof HomeSection,
    value: string
  ) => {
    setSections((prev) => ({
      ...prev,
      [key]: { ...prev[key], [field]: value },
    }));
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/home-sections", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sections: Object.values(sections) }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save home sections");
      }
      alert("Secciones guardadas correctamente!");
      fetchSections();
    } catch (err) {
      alert(
        "Error: " + (err instanceof Error ? err.message : "Unknown error")
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading)
    return <p className="text-center p-4">Cargando secciones...</p>;
  if (error)
    return <p className="text-center p-4 text-red-500">Error: {error}</p>;

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-10 text-primary text-center">
        Administra las Secciones del Home
      </h1>

      <form onSubmit={handleSave} className="space-y-8">
        {SECTION_ORDER.map((key) => {
          const section = sections[key];
          if (!section) return null;
          const isExperiences = key === "experiences";
          const isOurPurpose = key === "our_purpose";
          const isTheRoad = key === "the_road";
          const hasBackground = isTheRoad || isExperiences;

          return (
            <div key={key} className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-6 text-primary border-b pb-3">
                {SECTION_LABELS[key]}
              </h2>

              <div className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Título
                  </label>
                  <input
                    type="text"
                    value={section.title || ""}
                    onChange={(e) => updateField(key, "title", e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción
                  </label>
                  <textarea
                    value={section.description || ""}
                    onChange={(e) =>
                      updateField(key, "description", e.target.value)
                    }
                    rows={3}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>

                {/* Extra text (quote) - only for our_purpose */}
                {isOurPurpose && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cita / Texto adicional
                    </label>
                    <textarea
                      value={section.extra_text || ""}
                      onChange={(e) =>
                        updateField(key, "extra_text", e.target.value)
                      }
                      rows={3}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                )}

                {/* Button text - not for experiences */}
                {!isExperiences && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Texto del botón
                    </label>
                    <input
                      type="text"
                      value={section.button_text || ""}
                      onChange={(e) =>
                        updateField(key, "button_text", e.target.value)
                      }
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                )}

                {/* Image URL - not for experiences */}
                {!isExperiences && (
                  <CloudinaryUploadButton
                    value={section.image_url || ""}
                    onChange={(url) => updateField(key, "image_url", url)}
                    label="Imagen"
                    folder="integral-surf/home"
                  />
                )}

                {/* Second image - only for the_road */}
                {isTheRoad && (
                  <CloudinaryUploadButton
                    value={section.image_2_url || ""}
                    onChange={(url) => updateField(key, "image_2_url", url)}
                    label="Segunda Imagen"
                    folder="integral-surf/home"
                  />
                )}

                {/* Background image - for the_road and experiences */}
                {hasBackground && (
                  <CloudinaryUploadButton
                    value={section.background_image_url || ""}
                    onChange={(url) => updateField(key, "background_image_url", url)}
                    label="Imagen de Fondo"
                    folder="integral-surf/home"
                  />
                )}

                {/* Video URL - only for experiences */}
                {isExperiences && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      URL del Video (YouTube embed)
                    </label>
                    <input
                      type="text"
                      value={section.video_url || ""}
                      onChange={(e) =>
                        updateField(key, "video_url", e.target.value)
                      }
                      placeholder="https://www.youtube.com/embed/VIDEO_ID"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    {section.video_url && (
                      <div className="mt-3">
                        <p className="text-xs text-gray-500 mb-1">Preview:</p>
                        <div className="relative w-full max-w-lg h-48 rounded-lg overflow-hidden border">
                          <iframe
                            className="absolute top-0 left-0 w-full h-full"
                            src={section.video_url}
                            title="Video preview"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        <div className="flex justify-center pb-10">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex justify-center py-3 px-8 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-primary hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isSaving ? "Guardando..." : "Guardar Cambios"}
          </button>
        </div>
      </form>
    </div>
  );
}
