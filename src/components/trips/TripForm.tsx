"use client";
import { useState } from "react";
import type { Trip, TripContent, TripContentImage } from "@/types/trip";
import { EMPTY_CONTENT } from "@/lib/tripDefaults";
import { TextField } from "@/components/ui/Field";
import CloudinaryUploadButton from "@/components/ui/CloudinaryUploadButton";

interface TripFormProps {
  initialTrip: Trip;
  initialContents: TripContent[];
  onSubmit: (trip: Trip, contents: TripContent[]) => void | Promise<void>;
  submitting?: boolean;
  submitLabel: string;
  submittingLabel?: string;
  /** id on the <form> element, so a page-level "top" save button elsewhere
   * in the DOM can submit it via the HTML `form="..."` attribute. */
  formId?: string;
}

const NUMERIC_TRIP_FIELDS = new Set(["price_promo", "price_final", "order"]);

export default function TripForm({
  initialTrip,
  initialContents,
  onSubmit,
  submitting = false,
  submitLabel,
  submittingLabel = "Guardando...",
  formId = "trip-form",
}: TripFormProps) {
  const [form, setForm] = useState<Trip>(initialTrip);
  const [contents, setContents] = useState<TripContent[]>(
    initialContents.length > 0 ? initialContents : [EMPTY_CONTENT]
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: NUMERIC_TRIP_FIELDS.has(name) ? Number(value) : value,
    }));
  };

  const setFormField = (field: keyof Trip, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  type ContentField =
    | "title"
    | "subtitle"
    | "description"
    | "subtitle_2"
    | "description_2"
    | "image_url";

  // Immutable update — the previous implementation mutated
  // `newContents[index][field] = value` in place, which shared the content
  // object reference with the prior render's state.
  const handleContentChange = (
    index: number,
    field: ContentField,
    value: string
  ) => {
    setContents((prev) =>
      prev.map((c, i) => (i === index ? { ...c, [field]: value } : c))
    );
  };

  const addContent = () => {
    setContents((prev) => [...prev, { ...EMPTY_CONTENT, images: [] }]);
  };

  const removeContent = (index: number) => {
    setContents((prev) => prev.filter((_, i) => i !== index));
  };

  const addContentImage = (contentIndex: number) => {
    setContents((prev) =>
      prev.map((c, i) => {
        if (i !== contentIndex) return c;
        const newImage: TripContentImage = {
          id: `temp-${Date.now()}`,
          image_url: "",
          alt_text: "",
          order_number: c.images?.length ?? 0,
        };
        return { ...c, images: [...(c.images ?? []), newImage] };
      })
    );
  };

  const removeContentImage = (contentIndex: number, imageIndex: number) => {
    setContents((prev) =>
      prev.map((c, i) =>
        i === contentIndex
          ? { ...c, images: (c.images ?? []).filter((_, j) => j !== imageIndex) }
          : c
      )
    );
  };

  const handleContentImageChange = (
    contentIndex: number,
    imageIndex: number,
    field: "image_url" | "alt_text",
    value: string
  ) => {
    setContents((prev) =>
      prev.map((c, i) => {
        if (i !== contentIndex) return c;
        const images = (c.images ?? []).map((img, j) =>
          j === imageIndex ? { ...img, [field]: value } : img
        );
        return { ...c, images };
      })
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form, contents);
  };

  return (
    <form id={formId} onSubmit={handleSubmit} className="space-y-4">
      {/* Información general */}
      <div className="bg-gray-50 p-4 rounded-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Información General</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField label="Slug" name="slug" value={form.slug} onChange={handleChange} required />
          <TextField label="Título" name="title" value={form.title} onChange={handleChange} required />
          <TextField label="País (opcional)" name="title_2" value={form.title_2 ?? ""} onChange={handleChange} />
          <TextField label="Destino" name="destiny" value={form.destiny} onChange={handleChange} required />
          <TextField
            label="Subtítulo Superior (opcional)"
            name="top_subtitle"
            value={form.top_subtitle ?? ""}
            onChange={handleChange}
          />
          <TextField
            label="Subtítulo Coaching"
            name="coaching_subtitle"
            value={form.coaching_subtitle}
            onChange={handleChange}
          />
          <TextField label="Mes" name="date_month" value={form.date_month} onChange={handleChange} />
          <TextField label="Días" name="date_days" value={form.date_days} onChange={handleChange} />
          <TextField
            label="Mes 2 (opcional)"
            name="date_month_2"
            value={form.date_month_2 ?? ""}
            onChange={handleChange}
          />
          <TextField
            label="Días 2 (opcional)"
            name="date_days_2"
            value={form.date_days_2 ?? ""}
            onChange={handleChange}
          />
          <TextField label="Orden" name="order" type="number" value={form.order} onChange={handleChange} />
        </div>
      </div>

      {/* Multimedia */}
      <div className="bg-gray-50 p-4 rounded-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Multimedia</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CloudinaryUploadButton
            value={form.header_image}
            onChange={(url) => setFormField("header_image", url)}
            label="Imagen Principal"
            folder="integral-surf/trips/headers"
          />
          <TextField
            label="Video Principal"
            name="header_video"
            value={form.header_video ?? ""}
            onChange={handleChange}
            placeholder="URL del Video Principal"
          />
          <CloudinaryUploadButton
            value={form.header_mobile_image ?? ""}
            onChange={(url) => setFormField("header_mobile_image", url)}
            label="Imagen Principal (Móvil)"
            folder="integral-surf/trips/headers"
          />
        </div>
      </div>

      {/* Precios */}
      <div className="bg-gray-50 p-4 rounded-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Precios</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField
            label="Precio Promocional"
            name="price_promo"
            type="number"
            value={form.price_promo}
            onChange={handleChange}
          />
          <TextField
            label="Precio Final"
            name="price_final"
            type="number"
            value={form.price_final}
            onChange={handleChange}
          />
          <TextField
            label="Mensaje Precio Promocional"
            name="price_promo_message"
            value={form.price_promo_message}
            onChange={handleChange}
          />
          <TextField
            label="Mensaje Precio Final"
            name="price_final_message"
            value={form.price_final_message}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Sección 1 */}
      <div className="bg-gray-50 p-4 rounded-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Sección 1</h2>
        <div className="space-y-4">
          <TextField
            label="Título"
            name="section_1_title"
            value={form.section_1_title}
            onChange={handleChange}
          />
          <TextField
            label="Descripción"
            name="section_1_description"
            value={form.section_1_description}
            onChange={handleChange}
            textarea
          />
          <TextField
            label="Subdescripción"
            name="section_1_subdescription"
            value={form.section_1_subdescription}
            onChange={handleChange}
          />
          <CloudinaryUploadButton
            value={form.section_1_image}
            onChange={(url) => setFormField("section_1_image", url)}
            label="URL de la Imagen"
            folder="integral-surf/trips/sections"
          />
        </div>
      </div>

      {/* Sección 2 */}
      <div className="bg-gray-50 p-4 rounded-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Sección 2</h2>
        <div className="space-y-4">
          <TextField
            label="Título"
            name="section_2_title"
            value={form.section_2_title}
            onChange={handleChange}
          />
          <TextField
            label="Descripción"
            name="section_2_description"
            value={form.section_2_description}
            onChange={handleChange}
            textarea
          />
          <CloudinaryUploadButton
            value={form.section_2_image}
            onChange={(url) => setFormField("section_2_image", url)}
            label="URL de la Imagen"
            folder="integral-surf/trips/sections"
          />
        </div>
      </div>

      {/* Sección Video */}
      <div className="bg-gray-50 p-4 rounded-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Sección Video</h2>
        <div className="space-y-4">
          <TextField
            label="Título"
            name="section_video_title"
            value={form.section_video_title}
            onChange={handleChange}
          />
          <TextField
            label="Descripción"
            name="section_video_description"
            value={form.section_video_description}
            onChange={handleChange}
            textarea
          />
          <TextField
            label="URL del Video"
            name="section_video_url"
            value={form.section_video_url}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Imágenes Finales */}
      <div className="bg-gray-50 p-4 rounded-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Imágenes Finales</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CloudinaryUploadButton
            value={form.final_img_1}
            onChange={(url) => setFormField("final_img_1", url)}
            label="Imagen Final 1"
            folder="integral-surf/trips/finals"
          />
          <CloudinaryUploadButton
            value={form.final_img_2}
            onChange={(url) => setFormField("final_img_2", url)}
            label="Imagen Final 2"
            folder="integral-surf/trips/finals"
          />
        </div>
      </div>

      {/* Contenidos */}
      <div className="bg-gray-50 p-4 rounded-md mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Contenidos del Viaje</h2>
          <button
            type="button"
            onClick={addContent}
            className="bg-green-500 text-white p-2 px-4 rounded hover:bg-green-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
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
                className="bg-red-500 text-white p-1 px-3 rounded hover:bg-red-600 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
              >
                Eliminar
              </button>
            </div>

            <div className="space-y-3">
              <TextField
                label="Título"
                value={content.title}
                onChange={(e) => handleContentChange(index, "title", e.target.value)}
                required
              />
              <TextField
                label="Subtítulo"
                value={content.subtitle || ""}
                onChange={(e) => handleContentChange(index, "subtitle", e.target.value)}
              />
              <TextField
                label="Descripción"
                value={content.description}
                onChange={(e) => handleContentChange(index, "description", e.target.value)}
                textarea
              />
              <TextField
                label="Subtítulo 2"
                value={content.subtitle_2 || ""}
                onChange={(e) => handleContentChange(index, "subtitle_2", e.target.value)}
              />
              <TextField
                label="Descripción 2"
                value={content.description_2 || ""}
                onChange={(e) => handleContentChange(index, "description_2", e.target.value)}
                textarea
              />
              <CloudinaryUploadButton
                value={content.image_url}
                onChange={(url) => handleContentChange(index, "image_url", url)}
                label="Imagen Principal (fallback)"
                folder="integral-surf/trips/contents"
              />

              {/* Multi-image slideshow */}
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Imágenes del Slideshow
                  </label>
                  <button
                    type="button"
                    onClick={() => addContentImage(index)}
                    className="bg-green-500 text-white p-1 px-3 rounded hover:bg-green-600 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                  >
                    Agregar Imagen
                  </button>
                </div>
                {(content.images ?? []).map((image, imageIndex) => (
                  <div key={image.id} className="border rounded p-3 mb-2 bg-gray-50">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-600">
                        Imagen {imageIndex + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeContentImage(index, imageIndex)}
                        className="bg-red-500 text-white p-1 px-2 rounded hover:bg-red-600 text-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                      >
                        Quitar
                      </button>
                    </div>
                    <CloudinaryUploadButton
                      value={image.image_url}
                      onChange={(url) =>
                        handleContentImageChange(index, imageIndex, "image_url", url)
                      }
                      label="Imagen"
                      folder="integral-surf/trips/contents"
                    />
                    <input
                      type="text"
                      placeholder="Texto alternativo (opcional)"
                      value={image.alt_text || ""}
                      onChange={(e) =>
                        handleContentImageChange(index, imageIndex, "alt_text", e.target.value)
                      }
                      className="w-full p-2 border rounded mt-2 text-sm"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={submitting}
          className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 disabled:bg-blue-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        >
          {submitting ? submittingLabel : submitLabel}
        </button>
      </div>
    </form>
  );
}
