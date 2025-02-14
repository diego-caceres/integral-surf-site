// "use client";
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import Image from "next/image";

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Botón de menú para móviles */}
      <div className="md:hidden p-4  items-center grid grid-cols-[15%_70%_15%]">
        <button onClick={toggleMenu} aria-label="Abrir menú">
          <Bars3Icon className="h-8 w-8 text-primary" />
        </button>

        <span className="text-primary font-[Eckmannpsych] text-2xl text-center">
          INTEGRAL SURF
        </span>

        <Image
          src="/images/icons/logo.png"
          alt="Logo Integral Surf"
          width={65}
          height={65}
          className="self-end"
        />
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
        <div className="absolute left-2.5 top-2.5">
          <Image
            src="/images/icons/logo.png"
            alt="Logo Integral Surf"
            width={65}
            height={65}
          />
        </div>
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
            className="text-3xl font-serif tracking-wide"
            onClick={toggleMenu}
            prefetch
          >
            <span className="text-primary font-[Eckmannpsych] font-size">
              INTEGRAL SURF
            </span>
          </Link>

          <Link
            href="/viajes"
            prefetch
            className="text-xl font-semibold hover:text-accent transition"
          >
            VIAJES AL MAR
          </Link>
          <Link
            href="/productos"
            className="text-xl font-semibold hover:text-accent transition"
            prefetch
          >
            TIENDA
          </Link>
          <Link
            href="/blog"
            className="text-xl font-semibold hover:text-accent transition"
            prefetch
          >
            BLOG
          </Link>
          <Link
            href="/about"
            className="text-xl font-semibold hover:text-accent transition"
            onClick={toggleMenu}
            prefetch
          >
            NOSOTROS
          </Link>
        </nav>
      </motion.div>

      {/* Navbar para desktop */}
      <nav className="hidden md:flex justify-between items-center py-10 px-10">
        <Link href="/" className="text-4xl font-serif tracking-wide">
          <span className="text-primary font-[Eckmannpsych] font-size">
            INTEGRAL SURF
          </span>
        </Link>
        <div className="absolute left-1/2">
          <Image
            src="/images/icons/logo.png"
            alt="Logo Integral Surf"
            width={100}
            height={100}
            className="pos"
          />
        </div>
        <ul className="flex gap-6 text-xl">
          <li>
            <Link href="/viajes" className="hover:text-accent">
              VIAJES AL MAR
            </Link>
          </li>
          <li>
            <Link href="/productos" className="hover:text-accent">
              TIENDA
            </Link>
          </li>
          <li>
            <Link href="/blog" className="hover:text-accent">
              BLOG
            </Link>
          </li>
          <li>
            <Link href="/about" className="hover:text-accent">
              NOSOTROS
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
}
