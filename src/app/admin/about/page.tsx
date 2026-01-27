"use client";

import { useState, useEffect, FormEvent } from "react";
import type { AboutPage, AboutInstructor } from "@/types/about";
import CloudinaryUploadButton from "@/components/ui/CloudinaryUploadButton";

export default function ManageAboutPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Hero section form state
  const [heroTitle, setHeroTitle] = useState("");
  const [heroDescription1, setHeroDescription1] = useState("");
  const [heroDescription2, setHeroDescription2] = useState("");

  // Instructor form state
  const [editingInstructors, setEditingInstructors] = useState<
    AboutInstructor[]
  >([]);
  const [newInstructor, setNewInstructor] = useState({
    name: "",
    description: "",
    image_url: "",
    order_number: 0,
  });

  const fetchAboutData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/about");
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch about data");
      }
      const data: AboutPage = await response.json();
      setHeroTitle(data.hero_title);
      setHeroDescription1(data.hero_description_1);
      setHeroDescription2(data.hero_description_2);
      setEditingInstructors(data.instructors);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAboutData();
  }, []);

  const handleSaveAll = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const response = await fetch("/api/admin/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hero_title: heroTitle,
          hero_description_1: heroDescription1,
          hero_description_2: heroDescription2,
          instructors: editingInstructors,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update about page");
      }

      alert("About page updated successfully!");
      fetchAboutData(); // Refresh data
    } catch (err) {
      alert(
        "Error updating about page: " +
          (err instanceof Error ? err.message : "Unknown error")
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddInstructor = () => {
    if (
      !newInstructor.name ||
      !newInstructor.description ||
      !newInstructor.image_url
    ) {
      alert("Please fill in all instructor fields");
      return;
    }

    const instructorToAdd: AboutInstructor = {
      id: `temp-${Date.now()}`, // Temporary ID for new instructor
      ...newInstructor,
    };

    setEditingInstructors([...editingInstructors, instructorToAdd]);
    setNewInstructor({
      name: "",
      description: "",
      image_url: "",
      order_number: editingInstructors.length + 1,
    });
  };

  const handleRemoveInstructor = (index: number) => {
    if (confirm("Are you sure you want to remove this instructor?")) {
      setEditingInstructors(editingInstructors.filter((_, i) => i !== index));
    }
  };

  const handleInstructorChange = (
    index: number,
    field: keyof AboutInstructor,
    value: string | number
  ) => {
    setEditingInstructors(
      editingInstructors.map((instructor, i) =>
        i === index ? { ...instructor, [field]: value } : instructor
      )
    );
  };

  const moveInstructor = (index: number, direction: "up" | "down") => {
    const newInstructors = [...editingInstructors];
    if (direction === "up" && index > 0) {
      [newInstructors[index], newInstructors[index - 1]] = [
        newInstructors[index - 1],
        newInstructors[index],
      ];
      newInstructors[index].order_number = index + 1;
      newInstructors[index - 1].order_number = index;
    } else if (direction === "down" && index < newInstructors.length - 1) {
      [newInstructors[index], newInstructors[index + 1]] = [
        newInstructors[index + 1],
        newInstructors[index],
      ];
      newInstructors[index].order_number = index + 1;
      newInstructors[index + 1].order_number = index + 2;
    }
    setEditingInstructors(newInstructors);
  };

  if (isLoading)
    return <p className="text-center p-4">Loading about page data...</p>;
  if (error)
    return <p className="text-center p-4 text-red-500">Error: {error}</p>;

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-10 text-primary text-center">
        Administra la Página About (Nosotros)
      </h1>

      <form onSubmit={handleSaveAll} className="space-y-8">
        {/* Hero Section */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-primary">
            Hero Section
          </h2>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="heroTitle"
                className="block text-sm font-medium text-gray-700"
              >
                Hero Title
              </label>
              <input
                type="text"
                id="heroTitle"
                value={heroTitle}
                onChange={(e) => setHeroTitle(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="heroDescription1"
                className="block text-sm font-medium text-gray-700"
              >
                Hero Description 1
              </label>
              <textarea
                id="heroDescription1"
                value={heroDescription1}
                onChange={(e) => setHeroDescription1(e.target.value)}
                required
                rows={3}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="heroDescription2"
                className="block text-sm font-medium text-gray-700"
              >
                Hero Description 2
              </label>
              <textarea
                id="heroDescription2"
                value={heroDescription2}
                onChange={(e) => setHeroDescription2(e.target.value)}
                required
                rows={3}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>
        </div>

        {/* Instructors Section */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-primary">
            Instructors
          </h2>

          {/* Add New Instructor */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="text-lg font-medium mb-4">Add New Instructor</h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Image Preview */}
              <div className="lg:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image Preview
                </label>
                <div className="relative h-48 w-full rounded-lg overflow-hidden border border-gray-300 bg-gray-100">
                  {newInstructor.image_url ? (
                    <img
                      src={newInstructor.image_url}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                        target.nextElementSibling?.classList.remove("hidden");
                      }}
                    />
                  ) : null}
                  <div
                    className={`absolute inset-0 flex items-center justify-center text-gray-500 ${
                      newInstructor.image_url ? "hidden" : ""
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-4xl mb-2">📷</div>
                      <div className="text-sm">No image</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="lg:col-span-2 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Name
                    </label>
                    <input
                      type="text"
                      value={newInstructor.name}
                      onChange={(e) =>
                        setNewInstructor({
                          ...newInstructor,
                          name: e.target.value,
                        })
                      }
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <CloudinaryUploadButton
                      value={newInstructor.image_url}
                      onChange={(url) =>
                        setNewInstructor({
                          ...newInstructor,
                          image_url: url,
                        })
                      }
                      label="Image URL"
                      folder="integral-surf/about/instructors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    value={newInstructor.description}
                    onChange={(e) =>
                      setNewInstructor({
                        ...newInstructor,
                        description: e.target.value,
                      })
                    }
                    rows={3}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Use \\n\\n for line breaks"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddInstructor}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Add Instructor
                </button>
              </div>
            </div>
          </div>

          {/* Existing Instructors */}
          <div className="space-y-4">
            {editingInstructors.map((instructor, index) => (
              <div
                key={instructor.id}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-lg font-medium">
                    Instructor {index + 1}
                  </h4>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => moveInstructor(index, "up")}
                      disabled={index === 0}
                      className="px-2 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => moveInstructor(index, "down")}
                      disabled={index === editingInstructors.length - 1}
                      className="px-2 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveInstructor(index)}
                      className="px-2 py-1 text-sm bg-red-600 text-white hover:bg-red-700 rounded"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Image Preview */}
                  <div className="lg:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Image Preview
                    </label>
                    <div className="relative h-48 w-full rounded-lg overflow-hidden border border-gray-300 bg-gray-100">
                      {instructor.image_url ? (
                        <img
                          src={instructor.image_url}
                          alt={instructor.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = "none";
                            target.nextElementSibling?.classList.remove(
                              "hidden"
                            );
                          }}
                        />
                      ) : null}
                      <div
                        className={`absolute inset-0 flex items-center justify-center text-gray-500 ${
                          instructor.image_url ? "hidden" : ""
                        }`}
                      >
                        <div className="text-center">
                          <div className="text-4xl mb-2">📷</div>
                          <div className="text-sm">No image</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="lg:col-span-2 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Name
                        </label>
                        <input
                          type="text"
                          value={instructor.name}
                          onChange={(e) =>
                            handleInstructorChange(
                              index,
                              "name",
                              e.target.value
                            )
                          }
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <CloudinaryUploadButton
                          value={instructor.image_url}
                          onChange={(url) =>
                            handleInstructorChange(
                              index,
                              "image_url",
                              url
                            )
                          }
                          label="Image URL"
                          folder="integral-surf/about/instructors"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Description
                      </label>
                      <textarea
                        value={instructor.description}
                        onChange={(e) =>
                          handleInstructorChange(
                            index,
                            "description",
                            e.target.value
                          )
                        }
                        rows={4}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="Use \\n\\n for line breaks"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Save All Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
