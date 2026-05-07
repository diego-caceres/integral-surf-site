"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const navLinks = [
  { href: "/admin/menu-images", label: "Imágenes del Menú" },
  { href: "/admin/section-header-images", label: "Imágenes del Header" },
  { href: "/admin/about", label: "About" },
  { href: "/admin/fundamentos", label: "Fundamentos" },
  { href: "/admin/trips", label: "Trips" },
  { href: "/admin/home-sections", label: "Secciones Home" },
  { href: "/admin/configurations", label: "Configuraciones" },
  { href: "/admin/instagram-posts", label: "Instagram Posts" },
];

export default function AdminNavbar() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoading(false);
      router.refresh();
    }
  };

  return (
    <nav className="bg-primary shadow-md">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="text-white text-xl font-bold hover:text-gray-200">
              Integral Surf Admin
            </Link>
            <Link href="/admin" className="text-white hover:text-gray-200 text-sm font-medium px-3 py-2 rounded-md">
              Dashboard
            </Link>

            {/* Sections dropdown */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((o) => !o)}
                className="flex items-center gap-1 text-white hover:text-gray-200 text-sm font-medium px-3 py-2 rounded-md"
              >
                Secciones
                <svg
                  className={`w-4 h-4 transition-transform ${menuOpen ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {menuOpen && (
                <div className="absolute left-0 top-full mt-1 w-52 bg-white rounded-md shadow-lg z-50 py-1">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
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
