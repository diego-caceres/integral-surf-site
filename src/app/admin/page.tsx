"use client";

import Link from "next/link";
import { PhotoIcon, DocumentTextIcon } from "@heroicons/react/24/outline"; // Example icons

interface AdminSection {
  href: string;
  title: string;
  description: string;
  icon?: React.ElementType;
}

const adminSections: AdminSection[] = [
  {
    href: "/admin/menu-images",
    title: "Administrar imágenes del menú",
    description:
      "Actualiza las imágenes mostradas en el mega menú de navegación.",
    icon: PhotoIcon,
  },
  {
    href: "/admin/trips",
    title: "Administra los Trips",
    description: "Añade, edita o elimina viajes.",
    icon: DocumentTextIcon,
  },
  // Add more admin sections here as needed
];

export default function AdminHomePage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-10 text-primary text-center">
        Admin Dashboard
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {adminSections.map((section) => (
          <Link href={section.href} key={section.title} legacyBehavior>
            <a className="block p-6 bg-white shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300 ease-in-out transform hover:-translate-y-1">
              <div className="flex items-center mb-4">
                {section.icon && (
                  <section.icon className="h-8 w-8 text-secondary mr-4" />
                )}
                <h2 className="text-xl font-semibold text-primary">
                  {section.title}
                </h2>
              </div>
              <p className="text-gray-600 text-sm">{section.description}</p>
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
}
