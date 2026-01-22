"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Trip, TripContent } from "@/types/trip";
import CloudinaryUploadButton from "@/components/ui/CloudinaryUploadButton";

interface TripEditFetcherProps {
  id: string;
}
export default function TripEditFetcher(params: TripEditFetcherProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<Trip>({
    id: "",
    slug: "",
    title: "",
    title_2: "",
    top_subtitle: "",
    destiny: "",
    coaching_subtitle: "",
    date_month: "",
    date_days: "",
    header_image: "",
    header_video: "",
    header_mobile_image: "",
    price_promo: 0,
    price_final: 0,
    price_promo_message: "",
    price_final_message: "",
    section_1_title: "",
    section_1_description: "",
    section_1_subdescription: "",
    section_1_image: "",
    section_2_title: "",
    section_2_description: "",
    section_2_image: "",
    section_video_title: "",
    section_video_description: "",
    section_video_url: "",
    final_img_1: "",
    final_img_2: "",
    order: 0,
  });

  const [contents, setContents] = useState<TripContent[]>([]);

  useEffect(() => {
    // Helper to convert null values to empty strings for form inputs
    const sanitizeFormData = (data: Trip): Trip => {
      const sanitized = { ...data };
      const numericFields = ['price_promo', 'price_final', 'order'];
      for (const key in sanitized) {
        const value = sanitized[key as keyof Trip];
        if (value === null) {
          (sanitized as Record<string, unknown>)[key] = numericFields.includes(key) ? 0 : '';
        }
      }
      return sanitized;
    };

    const fetchTrip = async () => {
      try {
        const { id } = await params;
        setIsLoading(true);
        const res = await fetch(`/api/trips/${id}`);

        if (!res.ok) {
          throw new Error("Failed to fetch trip");
        }

        const data = await res.json();

        if (data && data.trip) {
          setForm(sanitizeFormData(data.trip));

          if (data.contents && data.contents.length > 0) {
            // Sanitize contents to convert null values to empty strings
            const sanitizedContents = data.contents.map((content: TripContent) => ({
              ...content,
              title: content.title ?? '',
              subtitle: content.subtitle ?? '',
              description: content.description ?? '',
              subtitle_2: content.subtitle_2 ?? '',
              description_2: content.description_2 ?? '',
              image_url: content.image_url ?? '',
            }));
            setContents(sanitizedContents);
          } else {
            setContents([
              {
                title: "",
                subtitle: "",
                description: "",
                subtitle_2: "",
                description_2: "",
                image_url: "",
              },
            ]);
          }
        } else {
          throw new Error("Trip data not found");
        }
      } catch (err) {
        console.error("Error fetching trip:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    if (params) {
      fetchTrip();
    }
  }, [params]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === "price_promo" || name === "price_final" || name === "order"
          ? Number(value)
          : value,
    }));
  };

  type ContentField =
    | "title"
    | "subtitle"
    | "description"
    | "subtitle_2"
    | "description_2"
    | "image_url";

  const handleContentChange = (
    index: number,
    field: ContentField,
    value: string
  ) => {
    const newContents = [...contents];
    newContents[index][field] = value;
    setContents(newContents);
  };

  const addContent = () => {
    setContents([
      ...contents,
      {
        title: "",
        subtitle: "",
        description: "",
        subtitle_2: "",
        description_2: "",
        image_url: "",
      },
    ]);
  };

  const removeContent = (index: number) => {
    setContents(contents.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsLoading(true);

      // Update trip and its contents
      const response = await fetch(`/api/trips/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trip: form,
          contents: contents.map((content) => ({
            ...content,
            trip_id: params.id,
          })),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to update trip");
      }

      toast.success("Viaje actualizado correctamente");
      router.push("/admin/trips");
    } catch (err) {
      console.error("Error updating trip:", err);
      toast.error(
        err instanceof Error ? err.message : "Error al actualizar el viaje"
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold text-red-500 mb-4">Error</h1>
        <p className="text-lg mb-6">{error}</p>
        <button
          onClick={() => router.back()}
          className="bg-primary text-white px-6 py-2 rounded-md hover:bg-opacity-90"
        >
          Volver
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Editar Viaje</h1>
        <button
          type="button"
          onClick={() => router.back()}
          className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
        >
          Cancelar
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Información general */}
        <div className="bg-gray-50 p-4 rounded-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Información General</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Slug
              </label>
              <input
                type="text"
                name="slug"
                placeholder="Slug"
                value={form.slug}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Título
              </label>
              <input
                type="text"
                name="title"
                placeholder="Título"
                value={form.title}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Título 2 (opcional)
              </label>
              <input
                type="text"
                name="title_2"
                placeholder="Título 2"
                value={form.title_2}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Destino
              </label>
              <input
                type="text"
                name="destiny"
                placeholder="Destino"
                value={form.destiny}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subtítulo Superior (opcional)
              </label>
              <input
                type="text"
                name="top_subtitle"
                placeholder="Subtítulo encima del título principal"
                value={form.top_subtitle || ""}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subtítulo Coaching
              </label>
              <input
                type="text"
                name="coaching_subtitle"
                placeholder="Subtítulo Coaching"
                value={form.coaching_subtitle}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mes
              </label>
              <input
                type="text"
                name="date_month"
                placeholder="Mes"
                value={form.date_month}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Días
              </label>
              <input
                type="text"
                name="date_days"
                placeholder="Días"
                value={form.date_days}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Orden
              </label>
              <input
                type="number"
                name="order"
                placeholder="Orden"
                value={form.order}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        </div>

        {/* Multimedia */}
        <div className="bg-gray-50 p-4 rounded-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Multimedia</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <CloudinaryUploadButton
                value={form.header_image}
                onChange={(url) => setForm((prev) => ({ ...prev, header_image: url }))}
                label="Imagen Principal"
                folder="integral-surf/trips/headers"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Video Principal
              </label>
              <input
                type="text"
                name="header_video"
                placeholder="URL del Video Principal"
                value={form.header_video}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <CloudinaryUploadButton
                value={form.header_mobile_image || ""}
                onChange={(url) => setForm((prev) => ({ ...prev, header_mobile_image: url }))}
                label="Imagen Principal (Móvil)"
                folder="integral-surf/trips/headers"
              />
            </div>
          </div>
        </div>

        {/* Precios */}
        <div className="bg-gray-50 p-4 rounded-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Precios</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Precio Promocional
              </label>
              <input
                type="number"
                name="price_promo"
                placeholder="Precio Promocional"
                value={form.price_promo}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Precio Final
              </label>
              <input
                type="number"
                name="price_final"
                placeholder="Precio Final"
                value={form.price_final}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mensaje Precio Promocional
              </label>
              <input
                type="text"
                name="price_promo_message"
                placeholder="Mensaje Precio Promocional"
                value={form.price_promo_message}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mensaje Precio Final
              </label>
              <input
                type="text"
                name="price_final_message"
                placeholder="Mensaje Precio Final"
                value={form.price_final_message}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        </div>

        {/* Sección 1 */}
        <div className="bg-gray-50 p-4 rounded-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Sección 1</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Título
              </label>
              <input
                type="text"
                name="section_1_title"
                placeholder="Título Sección 1"
                value={form.section_1_title}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción
              </label>
              <textarea
                name="section_1_description"
                placeholder="Descripción Sección 1"
                value={form.section_1_description}
                onChange={handleChange}
                className="w-full p-2 border rounded h-32"
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subdescripción
              </label>
              <input
                type="text"
                name="section_1_subdescription"
                placeholder="Subdescripción Sección 1"
                value={form.section_1_subdescription}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <CloudinaryUploadButton
                value={form.section_1_image}
                onChange={(url) => setForm((prev) => ({ ...prev, section_1_image: url }))}
                label="URL de la Imagen"
                folder="integral-surf/trips/sections"
              />
            </div>
          </div>
        </div>

        {/* Sección 2 */}
        <div className="bg-gray-50 p-4 rounded-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Sección 2</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Título
              </label>
              <input
                type="text"
                name="section_2_title"
                placeholder="Título Sección 2"
                value={form.section_2_title}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción
              </label>
              <textarea
                name="section_2_description"
                placeholder="Descripción Sección 2"
                value={form.section_2_description}
                onChange={handleChange}
                className="w-full p-2 border rounded h-32"
              ></textarea>
            </div>
            <div>
              <CloudinaryUploadButton
                value={form.section_2_image}
                onChange={(url) => setForm((prev) => ({ ...prev, section_2_image: url }))}
                label="URL de la Imagen"
                folder="integral-surf/trips/sections"
              />
            </div>
          </div>
        </div>

        {/* Sección Video */}
        <div className="bg-gray-50 p-4 rounded-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Sección Video</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Título
              </label>
              <input
                type="text"
                name="section_video_title"
                placeholder="Título Video"
                value={form.section_video_title}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción
              </label>
              <textarea
                name="section_video_description"
                placeholder="Descripción Video"
                value={form.section_video_description}
                onChange={handleChange}
                className="w-full p-2 border rounded h-32"
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL del Video
              </label>
              <input
                type="text"
                name="section_video_url"
                placeholder="URL Video"
                value={form.section_video_url}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        </div>

        {/* Imágenes Finales */}
        <div className="bg-gray-50 p-4 rounded-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Imágenes Finales</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <CloudinaryUploadButton
                value={form.final_img_1}
                onChange={(url) => setForm((prev) => ({ ...prev, final_img_1: url }))}
                label="Imagen Final 1"
                folder="integral-surf/trips/finals"
              />
            </div>
            <div>
              <CloudinaryUploadButton
                value={form.final_img_2}
                onChange={(url) => setForm((prev) => ({ ...prev, final_img_2: url }))}
                label="Imagen Final 2"
                folder="integral-surf/trips/finals"
              />
            </div>
          </div>
        </div>

        {/* Sección para Contenidos */}
        <div className="bg-gray-50 p-4 rounded-md mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Contenidos del Viaje</h2>
            <button
              type="button"
              onClick={addContent}
              className="bg-green-500 text-white p-2 px-4 rounded hover:bg-green-600"
            >
              Agregar Contenido
            </button>
          </div>

          {contents.map((content, index) => (
            <div key={index} className="border p-4 rounded mb-4 bg-white">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">Contenido #{index + 1}</h3>
                <button
                  type="button"
                  onClick={() => removeContent(index)}
                  className="bg-red-500 text-white p-1 px-3 rounded hover:bg-red-600 text-sm"
                >
                  Eliminar
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Título
                  </label>
                  <input
                    type="text"
                    value={content.title}
                    onChange={(e) =>
                      handleContentChange(index, "title", e.target.value)
                    }
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subtítulo
                  </label>
                  <input
                    type="text"
                    value={content.subtitle || ""}
                    onChange={(e) =>
                      handleContentChange(index, "subtitle", e.target.value)
                    }
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción
                  </label>
                  <textarea
                    value={content.description}
                    onChange={(e) =>
                      handleContentChange(index, "description", e.target.value)
                    }
                    className="w-full p-2 border rounded h-24"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subtítulo 2
                  </label>
                  <input
                    type="text"
                    value={content.subtitle_2 || ""}
                    onChange={(e) =>
                      handleContentChange(index, "subtitle_2", e.target.value)
                    }
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción 2
                  </label>
                  <textarea
                    value={content.description_2 || ""}
                    onChange={(e) =>
                      handleContentChange(
                        index,
                        "description_2",
                        e.target.value
                      )
                    }
                    className="w-full p-2 border rounded h-24"
                  ></textarea>
                </div>
                <div>
                  <CloudinaryUploadButton
                    value={content.image_url}
                    onChange={(url) => handleContentChange(index, "image_url", url)}
                    label="URL de la Imagen"
                    folder="integral-surf/trips/contents"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Botón de Guardar */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 disabled:bg-blue-300"
          >
            {isLoading ? "Guardando..." : "Guardar Cambios"}
          </button>
        </div>
      </form>
    </div>
  );
}
