"use client";

import { useState, useEffect, FormEvent } from "react";
import type {
  FundamentosPage,
  FundamentosSection,
  FundamentosTeamMember,
  FundamentosSectionImage,
} from "@/types/fundamentos";
import CloudinaryUploadButton from "@/components/ui/CloudinaryUploadButton";

export default function ManageFundamentosPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Sections form state
  const [editingSections, setEditingSections] = useState<FundamentosSection[]>(
    []
  );
  const [newSection, setNewSection] = useState({
    title: "",
    description: "",
    images: [] as FundamentosSectionImage[],
    order_number: 0,
    team_members: [] as FundamentosTeamMember[],
  });

  const fetchFundamentosData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/fundamentos");
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch fundamentos data");
      }
      const data: FundamentosPage = await response.json();
      setEditingSections(data.sections);
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
    fetchFundamentosData();
  }, []);

  const handleSaveAll = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const response = await fetch("/api/admin/fundamentos", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sections: editingSections,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update fundamentos page");
      }

      alert("Fundamentos page updated successfully!");
      fetchFundamentosData(); // Refresh data
    } catch (err) {
      alert(
        "Error updating fundamentos page: " +
          (err instanceof Error ? err.message : "Unknown error")
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddSection = () => {
    if (!newSection.title || !newSection.description) {
      alert("Please fill in all section fields");
      return;
    }

    const sectionToAdd: FundamentosSection = {
      id: `temp-${Date.now()}`, // Temporary ID for new section
      ...newSection,
    };

    setEditingSections([...editingSections, sectionToAdd]);
    setNewSection({
      title: "",
      description: "",
      images: [],
      order_number: editingSections.length + 1,
      team_members: [],
    });
  };

  const handleRemoveSection = (index: number) => {
    if (confirm("Are you sure you want to remove this section?")) {
      setEditingSections(editingSections.filter((_, i) => i !== index));
    }
  };

  const handleSectionChange = (
    index: number,
    field: keyof FundamentosSection,
    value: string | number
  ) => {
    setEditingSections(
      editingSections.map((section, i) =>
        i === index ? { ...section, [field]: value } : section
      )
    );
  };

  const moveSection = (index: number, direction: "up" | "down") => {
    const newSections = [...editingSections];
    if (direction === "up" && index > 0) {
      [newSections[index], newSections[index - 1]] = [
        newSections[index - 1],
        newSections[index],
      ];
      newSections[index].order_number = index + 1;
      newSections[index - 1].order_number = index;
    } else if (direction === "down" && index < newSections.length - 1) {
      [newSections[index], newSections[index + 1]] = [
        newSections[index + 1],
        newSections[index],
      ];
      newSections[index].order_number = index + 1;
      newSections[index + 1].order_number = index + 2;
    }
    setEditingSections(newSections);
  };

  const handleAddTeamMember = (sectionIndex: number) => {
    const section = editingSections[sectionIndex];
    const newMember: FundamentosTeamMember = {
      id: `temp-${Date.now()}`,
      name: "",
      description: "",
      image_url: "",
      order_number: section.team_members.length + 1,
    };

    const updatedSections = [...editingSections];
    updatedSections[sectionIndex] = {
      ...section,
      team_members: [...section.team_members, newMember],
    };
    setEditingSections(updatedSections);
  };

  const handleRemoveTeamMember = (
    sectionIndex: number,
    memberIndex: number
  ) => {
    if (confirm("Are you sure you want to remove this team member?")) {
      const updatedSections = [...editingSections];
      updatedSections[sectionIndex] = {
        ...updatedSections[sectionIndex],
        team_members: updatedSections[sectionIndex].team_members.filter(
          (_, i) => i !== memberIndex
        ),
      };
      setEditingSections(updatedSections);
    }
  };

  const handleTeamMemberChange = (
    sectionIndex: number,
    memberIndex: number,
    field: keyof FundamentosTeamMember,
    value: string | number
  ) => {
    const updatedSections = [...editingSections];
    updatedSections[sectionIndex] = {
      ...updatedSections[sectionIndex],
      team_members: updatedSections[sectionIndex].team_members.map(
        (member, i) =>
          i === memberIndex ? { ...member, [field]: value } : member
      ),
    };
    setEditingSections(updatedSections);
  };

  if (isLoading)
    return <p className="text-center p-4">Cargando la página de fundamentos...</p>;
  if (error)
    return <p className="text-center p-4 text-red-500">Error: {error}</p>;

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-10 text-primary text-center">
        Administrar la página de Fundamentos
      </h1>

      <form onSubmit={handleSaveAll} className="space-y-8">
        {/* Sections */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-primary">Secciones</h2>

          {/* Add New Section */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="text-lg font-medium mb-4">Agregar Nueva Sección</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Título
                </label>
                <input
                  type="text"
                  value={newSection.title}
                  onChange={(e) =>
                    setNewSection({ ...newSection, title: e.target.value })
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Imágenes
                </label>
                <div className="space-y-4">
                  {newSection.images.map((image, imageIndex) => (
                    <div key={imageIndex} className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-medium text-gray-600">
                          Image {imageIndex + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const updatedImages = newSection.images.filter(
                              (_, i) => i !== imageIndex
                            );
                            setNewSection({
                              ...newSection,
                              images: updatedImages,
                            });
                          }}
                          className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                        >
                          Quitar
                        </button>
                      </div>
                      <div className="mb-3">
                        <CloudinaryUploadButton
                          value={image.image_url}
                          onChange={(url) => {
                            const updatedImages = [...newSection.images];
                            updatedImages[imageIndex] = {
                              ...updatedImages[imageIndex],
                              image_url: url,
                            };
                            setNewSection({
                              ...newSection,
                              images: updatedImages,
                            });
                          }}
                          folder="integral-surf/fundamentos/sections"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          Alt text
                        </label>
                        <input
                          type="text"
                          placeholder="Describe the image..."
                          value={image.alt_text || ""}
                          onChange={(e) => {
                            const updatedImages = [...newSection.images];
                            updatedImages[imageIndex] = {
                              ...updatedImages[imageIndex],
                              alt_text: e.target.value,
                            };
                            setNewSection({
                              ...newSection,
                              images: updatedImages,
                            });
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                        />
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      const newImage: FundamentosSectionImage = {
                        id: `temp-${Date.now()}`,
                        image_url: "",
                        alt_text: "",
                        order_number: newSection.images.length,
                      };
                      setNewSection({
                        ...newSection,
                        images: [...newSection.images, newImage],
                      });
                    }}
                    className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                  >
                    Agregar Imagen
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">
                Descripción
              </label>
              <textarea
                value={newSection.description}
                onChange={(e) =>
                  setNewSection({ ...newSection, description: e.target.value })
                }
                rows={4}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <button
              type="button"
              onClick={handleAddSection}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Agregar Sección
            </button>
          </div>

          {/* Existing Sections */}
          {editingSections.map((section, sectionIndex) => (
            <div key={section.id} className="border rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">
                  Sección {sectionIndex + 1}
                </h3>
                <div className="space-x-2">
                  <button
                    type="button"
                    onClick={() => moveSection(sectionIndex, "up")}
                    disabled={sectionIndex === 0}
                    className="bg-gray-500 text-white px-2 py-1 rounded text-sm hover:bg-gray-600 disabled:opacity-50"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => moveSection(sectionIndex, "down")}
                    disabled={sectionIndex === editingSections.length - 1}
                    className="bg-gray-500 text-white px-2 py-1 rounded text-sm hover:bg-gray-600 disabled:opacity-50"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveSection(sectionIndex)}
                    className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
                  >
                    Quitar
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Título
                  </label>
                  <input
                    type="text"
                    value={section.title}
                    onChange={(e) =>
                      handleSectionChange(sectionIndex, "title", e.target.value)
                    }
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Imágenes
                  </label>
                  <div className="space-y-4">
                    {section.images.map((image, imageIndex) => (
                      <div key={imageIndex} className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-sm font-medium text-gray-600">
                            Imagen {imageIndex + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              const updatedSections = [...editingSections];
                              const updatedImages = section.images.filter(
                                (_, i) => i !== imageIndex
                              );
                              updatedSections[sectionIndex] = {
                                ...section,
                                images: updatedImages,
                              };
                              setEditingSections(updatedSections);
                            }}
                            className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                          >
                            Quitar
                          </button>
                        </div>
                        <div className="mb-3">
                          <CloudinaryUploadButton
                            value={image.image_url}
                            onChange={(url) => {
                              const updatedSections = [...editingSections];
                              const updatedImages = [...section.images];
                              updatedImages[imageIndex] = {
                                ...updatedImages[imageIndex],
                                image_url: url,
                              };
                              updatedSections[sectionIndex] = {
                                ...section,
                                images: updatedImages,
                              };
                              setEditingSections(updatedSections);
                            }}
                            folder="integral-surf/fundamentos/sections"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">
                            Alt text
                          </label>
                          <input
                            type="text"
                            placeholder="Describe the image..."
                            value={image.alt_text || ""}
                            onChange={(e) => {
                              const updatedSections = [...editingSections];
                              const updatedImages = [...section.images];
                              updatedImages[imageIndex] = {
                                ...updatedImages[imageIndex],
                                alt_text: e.target.value,
                              };
                              updatedSections[sectionIndex] = {
                                ...section,
                                images: updatedImages,
                              };
                              setEditingSections(updatedSections);
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                          />
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        const updatedSections = [...editingSections];
                        const newImage: FundamentosSectionImage = {
                          id: `temp-${Date.now()}`,
                          image_url: "",
                          alt_text: "",
                          order_number: section.images.length,
                        };
                        updatedSections[sectionIndex] = {
                          ...section,
                          images: [...section.images, newImage],
                        };
                        setEditingSections(updatedSections);
                      }}
                      className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                    >
                      Agregar Imagen
                    </button>
                  </div>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Descripción
                </label>
                <textarea
                  value={section.description}
                  onChange={(e) =>
                    handleSectionChange(
                      sectionIndex,
                      "description",
                      e.target.value
                    )
                  }
                  rows={4}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              {/* Team Members */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-md font-medium">Miembros del Equipo</h4>
                  <button
                    type="button"
                    onClick={() => handleAddTeamMember(sectionIndex)}
                    className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                  >
                    Agregar Miembro del Equipo
                  </button>
                </div>

                {section.team_members.map((member, memberIndex) => (
                  <div key={member.id} className="bg-gray-50 p-3 rounded mb-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">
                        Miembro {memberIndex + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          handleRemoveTeamMember(sectionIndex, memberIndex)
                        }
                        className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                      >
                        Quitar
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700">
                          Nombre
                        </label>
                        <input
                          type="text"
                          value={member.name}
                          onChange={(e) =>
                            handleTeamMemberChange(
                              sectionIndex,
                              memberIndex,
                              "name",
                              e.target.value
                            )
                          }
                          className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      </div>
                      <div>
                        <CloudinaryUploadButton
                          value={member.image_url}
                          onChange={(url) =>
                            handleTeamMemberChange(
                              sectionIndex,
                              memberIndex,
                              "image_url",
                              url
                            )
                          }
                          label="Image URL"
                          folder="integral-surf/fundamentos/team"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700">
                          Descripción
                        </label>
                        <textarea
                          value={member.description}
                          onChange={(e) =>
                            handleTeamMemberChange(
                              sectionIndex,
                              memberIndex,
                              "description",
                              e.target.value
                            )
                          }
                          rows={2}
                          className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Save Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={isSaving}
            className="bg-primary text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-primary/90 disabled:opacity-50"
          >
            {isSaving ? "Guardando..." : "Guardar Todos los Cambios"}
          </button>
        </div>
      </form>
    </div>
  );
}
