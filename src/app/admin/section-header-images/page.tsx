"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import CloudinaryUploadButton from "@/components/ui/CloudinaryUploadButton";

// Matches the structure returned by GET and expected by PUT for each image
interface HeaderImage {
  id?: string; // Present when fetching, optional when sending (will be new)
  image_url: string;
  alt_text: string | null;
  display_order?: number; // Present when fetching, implicit by array order when sending
}

// Structure for the data fetched and sent (grouped by device type)
interface HeaderImagesData {
  web: HeaderImage[];
  mobile: HeaderImage[];
}

interface SaveState {
  saving: boolean;
  message: string | null;
  isError: boolean;
}

const initialHeaderImagesData: HeaderImagesData = {
  web: [],
  mobile: [],
};

export default function AdminSectionHeaderImagesPage() {
  const [imagesData, setImagesData] = useState<HeaderImagesData>(
    initialHeaderImagesData
  );
  const [loading, setLoading] = useState(true);
  const [initialLoadError, setInitialLoadError] = useState<string | null>(null);
  const [saveState, setSaveState] = useState<SaveState>({
    saving: false,
    message: null,
    isError: false,
  });

  const fetchHeaderImages = useCallback(async () => {
    setLoading(true);
    setInitialLoadError(null);
    try {
      const response = await fetch("/api/admin/section-header-images");
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.details ||
            `Failed to fetch header images: ${response.statusText}`
        );
      }
      const data: HeaderImagesData = await response.json();
      setImagesData(data);
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "An unknown error occurred";
      setInitialLoadError(errorMsg);
      console.error("Fetch error:", err);
      setImagesData(initialHeaderImagesData); // Reset on error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHeaderImages();
  }, [fetchHeaderImages]);

  const handleInputChange = (
    device: keyof HeaderImagesData,
    imageIndex: number,
    field: keyof Omit<HeaderImage, "id" | "display_order">, // Allow editing url or alt_text
    value: string
  ) => {
    setImagesData((prev) => ({
      ...prev,
      [device]: prev[device].map((img, idx) =>
        idx === imageIndex ? { ...img, [field]: value } : img
      ),
    }));
  };

  const handleAddImage = (device: keyof HeaderImagesData) => {
    setImagesData((prev) => ({
      ...prev,
      [device]: [...(prev[device] || []), { image_url: "", alt_text: "" }],
    }));
  };

  const handleRemoveImage = (
    device: keyof HeaderImagesData,
    imageIndex: number
  ) => {
    setImagesData((prev) => ({
      ...prev,
      [device]: prev[device].filter((_, idx) => idx !== imageIndex),
    }));
  };

  const handleSaveChanges = async () => {
    setSaveState({ saving: true, message: null, isError: false });

    // Prepare only image_url and alt_text for saving, order is implicit
    const payload: HeaderImagesData = {
      web: imagesData.web.map(({ image_url, alt_text }) => ({
        image_url,
        alt_text,
      })),
      mobile: imagesData.mobile.map(({ image_url, alt_text }) => ({
        image_url,
        alt_text,
      })),
    };

    try {
      const response = await fetch("/api/admin/section-header-images", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.details || result.error || "Failed to save changes"
        );
      }
      setSaveState({
        saving: false,
        message: "Header images saved!",
        isError: false,
      });
      fetchHeaderImages(); // Re-fetch to get IDs and confirm order
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "An unknown error occurred";
      setSaveState({
        saving: false,
        message: `Error: ${errorMsg}`,
        isError: true,
      });
      console.error("Save error:", err);
    }
    setTimeout(() => {
      setSaveState((prev) => ({ ...prev, message: null }));
    }, 3000);
  };

  if (loading && !initialLoadError) {
    return <div className="p-8 text-center">Loading header images...</div>;
  }

  if (initialLoadError) {
    return (
      <div className="p-8 text-center text-red-500">
        Error loading header images: {initialLoadError}
        <button
          onClick={fetchHeaderImages}
          className="ml-4 px-3 py-1 bg-blue-500 text-white rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-primary">
          Manage Section Header Images
        </h1>
        <button
          onClick={handleSaveChanges}
          disabled={saveState.saving}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors text-sm font-medium"
        >
          {saveState.saving ? "Guardando..." : "Guardar Todos los Cambios"}
        </button>
      </div>

      {saveState.message && (
        <div
          className={`p-3 mb-6 rounded-md text-sm ${
            saveState.isError
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          }
          }`}
        >
          {saveState.message}
        </div>
      )}

      {(["web", "mobile"] as Array<keyof HeaderImagesData>).map(
        (deviceType) => (
          <section
            key={deviceType}
            className="mb-10 p-6 bg-white shadow-lg rounded-lg"
          >
            <h2 className="text-2xl font-semibold text-secondary capitalize mb-6 border-b pb-2">
              {deviceType} Images
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {(imagesData[deviceType] || []).map((image, index) => (
                <div
                  key={image.id || `new-${deviceType}-${index}`}
                  className="border p-4 rounded-md shadow-sm bg-gray-50 flex flex-col"
                >
                  <Image
                    src={
                      image.image_url ||
                      "https://via.placeholder.com/300x200?text=New+Image"
                    }
                    alt={image.alt_text || "Image preview"}
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
                    <CloudinaryUploadButton
                      value={image.image_url}
                      onChange={(url) => handleInputChange(deviceType, index, "image_url", url)}
                      label="Image URL"
                      folder={`integral-surf/section-headers/${deviceType}`}
                    />
                  </div>
                  <div className="mb-3">
                    <label
                      htmlFor={`alt-${deviceType}-${index}`}
                      className="text-sm font-medium text-gray-700 block mb-1"
                    >
                      Alt Text:
                    </label>
                    <input
                      id={`alt-${deviceType}-${index}`}
                      type="text"
                      value={image.alt_text || ""}
                      onChange={(e) =>
                        handleInputChange(
                          deviceType,
                          index,
                          "alt_text",
                          e.target.value
                        )
                      }
                      placeholder="Enter alt text"
                      className="w-full p-2 border rounded text-xs text-gray-700 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <button
                    onClick={() => handleRemoveImage(deviceType, index)}
                    className="mt-auto px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm"
                  >
                    Eliminar imagen
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={() => handleAddImage(deviceType)}
              className="px-5 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
            >
              + Agregar nueva imagen para {deviceType}
            </button>
          </section>
        )
      )}
    </div>
  );
}
