"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminNavbar() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await fetch("/api/admin/logout", {
        method: "POST",
      });
      // No matter the response, clear client state and refresh
    } catch (error) {
      console.error("Logout failed:", error);
      // Still attempt to refresh to clear client state if server fails
    } finally {
      setIsLoading(false);
      router.refresh(); // Refresh to trigger AdminLayout to re-check auth cookie
    }
  };

  return (
    <nav className="bg-primary shadow-md">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/admin" legacyBehavior>
              <a className="text-white text-xl font-bold hover:text-gray-200">
                Integral Surf Admin
              </a>
            </Link>
            <div className="hidden md:flex space-x-4">
              <Link href="/admin" legacyBehavior>
                <a className="text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium">
                  Dashboard
                </a>
              </Link>
              <Link href="/admin/menu-images" legacyBehavior>
                <a className="text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium">
                  Imágenes del Menú
                </a>
              </Link>
              <Link href="/admin/section-header-images" legacyBehavior>
                <a className="text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium">
                  Imágenes del Header
                </a>
              </Link>
              <Link href="/admin/about" legacyBehavior>
                <a className="text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium">
                  About
                </a>
              </Link>
              <Link href="/admin/fundamentos" legacyBehavior>
                <a className="text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium">
                  Fundamentos
                </a>
              </Link>
              <Link href="/admin/trips" legacyBehavior>
                <a className="text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium">
                  Trips
                </a>
              </Link>
              <Link href="/admin/configurations" legacyBehavior>
                <a className="text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium">
                  Configuraciones
                </a>
              </Link>
            </div>
          </div>
          <button
            onClick={handleLogout}
            disabled={isLoading}
            className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-gray-400 transition-colors"
          >
            {isLoading ? "Logging out..." : "Log Out"}
          </button>
        </div>
      </div>
    </nav>
  );
}
