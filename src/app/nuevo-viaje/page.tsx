"use client";
import { useState } from "react";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";

export default function NuevoViaje() {
  const [form, setForm] = useState({
    slug: "",
    title: "",
    title_2: "",
    destiny: "",
    coaching_subtitle: "",
    date_month: "",
    date_days: "",
    header_image: "",
    header_mobile_image: "",
    header_video: "",
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

  // Lista de contenidos
  const [contents, setContents] = useState([
    {
      title: "",
      subtitle: "",
      description: "",
      subtitle_2: "",
      description_2: "",
      image_url: "",
    },
  ]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
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
    const viajeId = uuidv4(); // Generar un ID manualmente

    // Insertar el viaje
    const response = await fetch("/api/trips", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: viajeId, contents, ...form }),
    });

    const result = await response.json();

    if (!result.success) {
      console.error("Error al agregar viaje:", result.error);
      return;
    }

    toast.success("Viaje agregado correctamente");
    // router.push("/");
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-6">Agregar Nuevo Viaje</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Información general */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="slug"
            placeholder="Slug"
            value={form.slug}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          />
          <input
            type="number"
            name="order"
            placeholder="Order"
            value={form.order}
            onChange={handleChange}
            className="p-2 border rounded"
          />
          <input
            type="text"
            name="title"
            placeholder="Título"
            value={form.title}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          />
          <input
            type="text"
            name="title_2"
            placeholder="Título 2"
            value={form.title_2}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          />
          <input
            type="text"
            name="destiny"
            placeholder="Destino"
            value={form.destiny}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          />
          <input
            type="text"
            name="coaching_subtitle"
            placeholder="Subtítulo Coaching"
            value={form.coaching_subtitle}
            onChange={handleChange}
            className="p-2 border rounded"
          />
          <input
            type="text"
            name="date_month"
            placeholder="Mes"
            value={form.date_month}
            onChange={handleChange}
            className="p-2 border rounded"
          />
          <input
            type="text"
            name="date_days"
            placeholder="Días"
            value={form.date_days}
            onChange={handleChange}
            className="p-2 border rounded"
          />
        </div>

        {/* Multimedia */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="header_image"
              className="block text-sm font-medium text-gray-700"
            >
              Imagen de Cabecera (URL)
            </label>
            <input
              type="text"
              name="header_image"
              id="header_image"
              value={form.header_image}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
            {form.header_image && (
              <img
                src={form.header_image}
                alt="Preview Header Image"
                className="mt-2 max-w-xs max-h-32 object-contain border rounded"
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
            )}
          </div>
          <div>
            <label
              htmlFor="header_mobile_image"
              className="block text-sm font-medium text-gray-700"
            >
              Imagen de Cabecera Móvil (URL)
            </label>
            <input
              type="text"
              name="header_mobile_image"
              id="header_mobile_image"
              value={form.header_mobile_image}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
            {form.header_mobile_image && (
              <img
                src={form.header_mobile_image}
                alt="Preview Header Mobile Image"
                className="mt-2 max-w-xs max-h-32 object-contain border rounded"
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
            )}
          </div>
          <div>
            <label
              htmlFor="header_video"
              className="block text-sm font-medium text-gray-700"
            >
              Video de Cabecera (URL)
            </label>
            <input
              type="text"
              name="header_video"
              id="header_video"
              value={form.header_video}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Precios */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="number"
            name="price_promo"
            placeholder="Precio Promo"
            value={form.price_promo}
            onChange={handleChange}
            className="p-2 border rounded"
          />
          <input
            type="number"
            name="price_final"
            placeholder="Precio Final"
            value={form.price_final}
            onChange={handleChange}
            className="p-2 border rounded"
          />
          <input
            type="text"
            name="price_promo_message"
            placeholder="Mensaje Precio Promo"
            value={form.price_promo_message}
            onChange={handleChange}
            className="p-2 border rounded"
          />
          <input
            type="text"
            name="price_final_message"
            placeholder="Mensaje Precio Final"
            value={form.price_final_message}
            onChange={handleChange}
            className="p-2 border rounded"
          />
        </div>

        {/* Sección 1 */}
        <h2 className="text-xl font-semibold mt-4">Sección 1</h2>
        <input
          type="text"
          name="section_1_title"
          placeholder="Título Sección 1"
          value={form.section_1_title}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <textarea
          name="section_1_description"
          placeholder="Descripción Sección 1"
          value={form.section_1_description}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        ></textarea>
        <input
          type="text"
          name="section_1_subdescription"
          placeholder="Subdescripción Sección 1"
          value={form.section_1_subdescription}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <div>
          <label
            htmlFor="section_1_image"
            className="block text-sm font-medium text-gray-700"
          >
            Imagen Sección 1 (URL)
          </label>
          <input
            type="text"
            name="section_1_image"
            id="section_1_image"
            value={form.section_1_image}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
          {form.section_1_image && (
            <img
              src={form.section_1_image}
              alt="Preview Section 1 Image"
              className="mt-2 max-w-xs max-h-32 object-contain border rounded"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
          )}
        </div>

        {/* Sección 2 */}
        <h2 className="text-xl font-semibold mt-4">Sección 2</h2>
        <input
          type="text"
          name="section_2_title"
          placeholder="Título Sección 2"
          value={form.section_2_title}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <textarea
          name="section_2_description"
          placeholder="Descripción Sección 2"
          value={form.section_2_description}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        ></textarea>
        <div>
          <label
            htmlFor="section_2_image"
            className="block text-sm font-medium text-gray-700"
          >
            Imagen Sección 2 (URL)
          </label>
          <input
            type="text"
            name="section_2_image"
            id="section_2_image"
            value={form.section_2_image}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
          {form.section_2_image && (
            <img
              src={form.section_2_image}
              alt="Preview Section 2 Image"
              className="mt-2 max-w-xs max-h-32 object-contain border rounded"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
          )}
        </div>

        {/* Sección Video */}
        <h2 className="text-xl font-semibold mt-4">Sección Video</h2>
        <input
          type="text"
          name="section_video_title"
          placeholder="Título Video"
          value={form.section_video_title}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <textarea
          name="section_video_description"
          placeholder="Descripción Video"
          value={form.section_video_description}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        ></textarea>
        <input
          type="text"
          name="section_video_url"
          placeholder="URL Video"
          value={form.section_video_url}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        {/* Imágenes Finales */}
        <h2 className="text-xl font-semibold mt-4">Imágenes Finales</h2>
        <div>
          <label
            htmlFor="final_img_1"
            className="block text-sm font-medium text-gray-700"
          >
            Imagen Final 1 (URL)
          </label>
          <input
            type="text"
            name="final_img_1"
            id="final_img_1"
            value={form.final_img_1}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
          {form.final_img_1 && (
            <img
              src={form.final_img_1}
              alt="Preview Final Image 1"
              className="mt-2 max-w-xs max-h-32 object-contain border rounded"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
          )}
        </div>
        <div>
          <label
            htmlFor="final_img_2"
            className="block text-sm font-medium text-gray-700"
          >
            Imagen Final 2 (URL)
          </label>
          <input
            type="text"
            name="final_img_2"
            id="final_img_2"
            value={form.final_img_2}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
          {form.final_img_2 && (
            <img
              src={form.final_img_2}
              alt="Preview Final Image 2"
              className="mt-2 max-w-xs max-h-32 object-contain border rounded"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
          )}
        </div>

        {/* Sección para Contenidos */}
        <h2 className="text-xl font-semibold mt-4">Contenidos del Viaje</h2>
        {contents.map((content, index) => (
          <div key={index} className="border p-4 rounded mb-4">
            <input
              type="text"
              placeholder="Título"
              value={content.title}
              onChange={(e) =>
                handleContentChange(index, "title", e.target.value)
              }
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="text"
              placeholder="Subtítulo"
              value={content.subtitle}
              onChange={(e) =>
                handleContentChange(index, "subtitle", e.target.value)
              }
              className="w-full p-2 border rounded"
            />
            <textarea
              placeholder="Descripción"
              value={content.description}
              onChange={(e) =>
                handleContentChange(index, "description", e.target.value)
              }
              className="w-full p-2 border rounded"
            ></textarea>
            <input
              type="text"
              placeholder="Subtítulo 2"
              value={content.subtitle_2}
              onChange={(e) =>
                handleContentChange(index, "subtitle_2", e.target.value)
              }
              className="w-full p-2 border rounded"
            />
            <textarea
              placeholder="Descripción 2"
              value={content.description_2}
              onChange={(e) =>
                handleContentChange(index, "description_2", e.target.value)
              }
              className="w-full p-2 border rounded"
            ></textarea>
            <div>
              <label
                htmlFor={`content_image_url_${index}`}
                className="block text-sm font-medium text-gray-700"
              >
                Imagen (URL)
              </label>
              <input
                type="text"
                name="image_url"
                id={`content_image_url_${index}`}
                value={content.image_url}
                onChange={(e) =>
                  handleContentChange(index, "image_url", e.target.value)
                }
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
              {content.image_url && (
                <img
                  src={content.image_url}
                  alt={`Preview Content Image ${index + 1}`}
                  className="mt-2 max-w-xs max-h-32 object-contain border rounded"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              )}
            </div>

            <button
              type="button"
              onClick={() => removeContent(index)}
              className="bg-red-500 text-white p-2 rounded mt-2"
            >
              Eliminar
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={addContent}
          className="bg-green-500 text-white p-2 rounded"
        >
          Agregar Contenido
        </button>

        {/* Botón de Enviar */}
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded w-full mt-4"
        >
          Guardar Viaje
        </button>
      </form>
    </div>
  );
}
