"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface MenuItemImage {
  url: string;
  alt: string;
}

interface MenuImagesData {
  [key: string]: MenuItemImage[];
}

interface SectionSaveState {
  [key: string]: {
    saving: boolean;
    message: string | null;
    isError: boolean;
  };
}

export default function AdminMenuImagesPage() {
  const [menuImages, setMenuImages] = useState<MenuImagesData>({});
  const [loading, setLoading] = useState(true);
  const [initialLoadError, setInitialLoadError] = useState<string | null>(null);
  const [sectionSaveStates, setSectionSaveStates] = useState<SectionSaveState>(
    {}
  );

  useEffect(() => {
    const fetchMenuImages = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/menu-images");
        if (!response.ok) {
          throw new Error(
            `Failed to fetch menu images: ${response.statusText}`
          );
        }
        const data: MenuImagesData = await response.json();
        setMenuImages(data);
        setInitialLoadError(null);
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : "An unknown error occurred";
        setInitialLoadError(errorMsg);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuImages();
  }, []);

  const handleInputChange = (
    title: string,
    imageIndex: number,
    field: keyof MenuItemImage,
    value: string
  ) => {
    setMenuImages((prev) => ({
      ...prev,
      [title]: prev[title].map((img, idx) =>
        idx === imageIndex ? { ...img, [field]: value } : img
      ),
    }));
  };

  const handleAddImage = (title: string) => {
    setMenuImages((prev) => ({
      ...prev,
      [title]: [...(prev[title] || []), { url: "", alt: "" }],
    }));
  };

  const handleRemoveImage = (title: string, imageIndex: number) => {
    setMenuImages((prev) => ({
      ...prev,
      [title]: prev[title].filter((_, idx) => idx !== imageIndex),
    }));
  };

  const handleSaveChanges = async (title: string) => {
    setSectionSaveStates((prev) => ({
      ...prev,
      [title]: { saving: true, message: null, isError: false },
    }));

    const imagesToSave = { [title]: menuImages[title] || [] };

    try {
      const response = await fetch("/api/admin/menu-images", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(imagesToSave),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.details || result.error || "Failed to save changes"
        );
      }
      setSectionSaveStates((prev) => ({
        ...prev,
        [title]: { saving: false, message: "Changes saved!", isError: false },
      }));
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "An unknown error occurred";
      setSectionSaveStates((prev) => ({
        ...prev,
        [title]: {
          saving: false,
          message: `Error: ${errorMsg}`,
          isError: true,
        },
      }));
      console.error("Save error:", err);
    }
    setTimeout(() => {
      setSectionSaveStates((prev) => ({
        ...prev,
        [title]: { ...prev[title], message: null }, // Clear message after a few seconds
      }));
    }, 3000);
  };

  if (loading) {
    return <div className="p-8 text-center">Loading menu images...</div>;
  }

  if (initialLoadError) {
    return (
      <div className="p-8 text-center text-red-500">
        Error: {initialLoadError}
      </div>
    );
  }

  if (Object.keys(menuImages).length === 0) {
    return (
      <div className="p-8 text-center">
        No menu image categories found. Configure them first.
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-8 text-primary">
        Manage Menu Images
      </h1>

      {Object.entries(menuImages).map(([title, images]) => (
        <section
          key={title}
          className="mb-10 p-6 bg-white shadow-lg rounded-lg"
        >
          <div className="flex justify-between items-center mb-6 border-b pb-2">
            <h2 className="text-2xl font-semibold text-secondary">{title}</h2>
            <button
              onClick={() => handleSaveChanges(title)}
              disabled={sectionSaveStates[title]?.saving}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors text-sm font-medium"
            >
              {sectionSaveStates[title]?.saving
                ? "Guardando..."
                : "Guardar cambios para esta sección"}
            </button>
          </div>
          {sectionSaveStates[title]?.message && (
            <div
              className={`p-3 mb-4 rounded-md text-sm ${
                sectionSaveStates[title]?.isError
                  ? "bg-red-100 text-red-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {sectionSaveStates[title]?.message}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {(images || []).map((image, index) => (
              <div
                key={index} // Consider more stable keys if reordering is implemented
                className="border p-4 rounded-md shadow-sm bg-gray-50 flex flex-col"
              >
                <Image
                  src={
                    image.url ||
                    "https://via.placeholder.com/300x200?text=New+Image"
                  }
                  alt={image.alt || "Image preview"}
                  width={300}
                  height={192}
                  className="w-full h-48 object-cover rounded-md mb-3 bg-gray-200"
                  onError={(
                    e: React.SyntheticEvent<HTMLImageElement, Event>
                  ) => {
                    const target = e.currentTarget as HTMLImageElement;
                    target.src =
                      "https://via.placeholder.com/300x200?text=Invalid+URL";
                    target.alt = "Invalid image URL";
                  }}
                />
                <div className="mb-2">
                  <label
                    htmlFor={`url-${title}-${index}`}
                    className="text-sm font-medium text-gray-700 block mb-1"
                  >
                    URL:
                  </label>
                  <input
                    id={`url-${title}-${index}`}
                    type="text"
                    value={image.url}
                    onChange={(e) =>
                      handleInputChange(title, index, "url", e.target.value)
                    }
                    placeholder="Enter image URL"
                    className="w-full p-2 border rounded text-xs text-gray-700 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="mb-3">
                  <label
                    htmlFor={`alt-${title}-${index}`}
                    className="text-sm font-medium text-gray-700 block mb-1"
                  >
                    Alt Text:
                  </label>
                  <input
                    id={`alt-${title}-${index}`}
                    type="text"
                    value={image.alt}
                    onChange={(e) =>
                      handleInputChange(title, index, "alt", e.target.value)
                    }
                    placeholder="Enter alt text"
                    className="w-full p-2 border rounded text-xs text-gray-700 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <button
                  onClick={() => handleRemoveImage(title, index)}
                  className="mt-auto px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm"
                >
                  Eliminar imagen
                </button>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => handleAddImage(title)}
              className="px-5 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
            >
              + Agrega una nueva imagen para {title}
            </button>
            <p className="text-sm text-gray-500">
              Recuerda que el menú espera 3 imágenes por sección.
            </p>
          </div>
        </section>
      ))}
    </div>
  );
}
