// "use client";
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Botón de menú para móviles */}
      <div className="md:hidden p-4">
        <button onClick={toggleMenu} aria-label="Abrir menú">
          <Bars3Icon className="h-8 w-8 text-primary" />
        </button>
      </div>

      {/* Menú lateral deslizante */}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: isOpen ? "0%" : "-100%" }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className={`fixed inset-0 z-50 bg-background text-primary w-64 shadow-lg flex flex-col p-6 ${
          isOpen ? "block" : "hidden"
        } md:hidden`}
      >
        <button
          onClick={toggleMenu}
          className="self-end mb-8"
          aria-label="Cerrar menú"
        >
          <XMarkIcon className="h-8 w-8 text-primary" />
        </button>

        <nav className="flex flex-col gap-6 items-start">
          <Link
            href="/"
            className="text-xl font-semibold hover:text-accent transition"
            onClick={toggleMenu}
            prefetch
          >
            Integral Surf
          </Link>
          <Link
            href="/viajes"
            className="text-xl font-semibold hover:text-accent transition"
            onClick={toggleMenu}
            prefetch
          >
            Viajes
          </Link>
          <Link
            href="/productos"
            className="text-xl font-semibold hover:text-accent transition"
            onClick={toggleMenu}
            prefetch
          >
            Productos
          </Link>
          <Link
            href="/blog"
            className="text-xl font-semibold hover:text-accent transition"
            onClick={toggleMenu}
            prefetch
          >
            Blog
          </Link>
          <Link
            href="/about"
            className="text-xl font-semibold hover:text-accent transition"
            onClick={toggleMenu}
            prefetch
          >
            Quiénes Somos
          </Link>
        </nav>
      </motion.div>

      {/* Navbar para desktop */}
      <nav className="hidden md:flex justify-between items-center py-6 px-6">
        <Link href="/" className="text-2xl font-serif tracking-wide">
          <span className="text-primary">Integral Surf</span>
        </Link>
        <ul className="flex gap-6 text-lg">
          <li>
            <Link href="/viajes" className="hover:text-accent">
              Viajes
            </Link>
          </li>
          <li>
            <Link href="/productos" className="hover:text-accent">
              Tienda
            </Link>
          </li>
          <li>
            <Link href="/blog" className="hover:text-accent">
              Blog
            </Link>
          </li>
          <li>
            <Link href="/about" className="hover:text-accent">
              Nosotros
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
}
