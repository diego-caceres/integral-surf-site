"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import Image from "next/image";
import MegaMenuItem from "./MegaMenuItem";

// Define the expected structure for image objects
interface MenuItemImage {
  url: string;
  alt: string;
}

// Define the structure for the fetched data: an object where keys are menu titles
interface MenuImagesData {
  [key: string]: MenuItemImage[];
}

// Define the structure for trip menu items
interface MenuTripItem {
  name: string;
  id: string;
  url: string;
}

// Define the structure for trips from API
interface TripData {
  slug: string;
  title: string;
  title_2: string;
  is_deleted?: boolean;
}

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [menuItemImages, setMenuItemImages] = useState<MenuImagesData>({});
  const [menuTripItems, setMenuTripItems] = useState<MenuTripItem[]>([]);
  const [destinosTitle, setDestinosTitle] = useState("DESTINOS 2026");

  const toggleMenu = () => setIsOpen(!isOpen);

  const storeDisabled = false;
  const blogDisabled = false;

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await fetch("/api/menu-images");
        if (!response.ok) {
          throw new Error("Failed to fetch menu images");
        }
        const data: MenuImagesData = await response.json();
        setMenuItemImages(data);
      } catch (error) {
        console.error("Error fetching menu images:", error);
      }
    };

    const fetchTrips = async () => {
      try {
        const response = await fetch("/api/trips");
        if (!response.ok) {
          throw new Error("Failed to fetch trips");
        }
        const trips: TripData[] = await response.json();
        const activeTrips = trips
          .filter((trip) => !trip.is_deleted)
          .map((trip) => ({
            name: trip.title + (trip.title_2 ? ", " + trip.title_2 : ""),
            id: trip.slug,
            url: `/viajes/${trip.slug}`,
          }));
        setMenuTripItems(activeTrips);
      } catch (error) {
        console.error("Error fetching trips:", error);
      }
    };

    const fetchDestinosTitle = async () => {
      try {
        const response = await fetch("/api/config/menu_destinos_title");
        if (response.ok) {
          const data = await response.json();
          if (data.value) {
            setDestinosTitle(data.value);
          }
        }
      } catch (error) {
        console.error("Error fetching destinos title:", error);
      }
    };

    fetchMenuItems();
    fetchTrips();
    fetchDestinosTitle();
  }, []);

  return (
    <>
      {/* Botón de menú para móviles */}
      <div className="md:hidden p-4  items-center grid grid-cols-[15%_70%_15%]">
        <button onClick={toggleMenu} aria-label="Abrir menú">
          <Bars3Icon className="h-8 w-8 text-primary" />
        </button>

        <Link href="/" className="flex justify-center">
          <Image
            src="/images/icons/logo.png"
            alt="Logo Integral Surf"
            width={65}
            height={65}
            className="self-end"
          />
          {/* <span className="text-primary font-[Eckmannpsych] text-2xl">
            INTEGRAL SURF
          </span> */}
        </Link>
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
            onClick={toggleMenu}
            prefetch
            className="text-xl font-semibold hover:text-accent transition"
          >
            VIAJES AL MAR
          </Link>
          <Link
            href="/productos"
            prefetch
            onClick={toggleMenu}
            className={`text-xl font-semibold hover:text-accent transition ${
              storeDisabled ? "pointer-events-none" : ""
            }`}
            aria-disabled={storeDisabled}
          >
            TIENDA
          </Link>
          <Link
            href="/blog"
            className={`text-xl font-semibold hover:text-accent transition ${
              blogDisabled ? "pointer-events-none" : ""
            }`}
            aria-disabled={blogDisabled}
            prefetch
            onClick={toggleMenu}
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
          {/* <Link
            href="/admin/trips"
            className="text-xl font-semibold hover:text-accent transition"
            onClick={toggleMenu}
            prefetch
          >
            ADMIN
          </Link> */}
        </nav>
      </motion.div>

      {/* Navbar para desktop */}
      <nav className="hidden md:flex justify-between items-center py-8 px-10 relative">
        <Link href="/" className="text-4xl font-serif tracking-wide">
          <span className="text-primary font-[Eckmannpsych] font-size">
            INTEGRAL SURF
          </span>
        </Link>
        <div className="absolute left-1/2 transform -translate-x-1/2 z-40">
          <Image
            src="/images/icons/logo.png"
            alt="Logo Integral Surf"
            width={100}
            height={100}
            className="pos z-40"
          />
        </div>
        <ul className="flex gap-x-8 text-xl items-center">
          <MegaMenuItem
            title="VIAJES AL MAR"
            href="/viajes"
            images={menuItemImages["VIAJES AL MAR"]}
          >
            <div className="grid grid-cols-2 gap-x-8">
              <div>
                <h3 className="font-semibold text-lg mb-3 text-primary">
                  {destinosTitle}
                </h3>
                <ul className="space-y-2">
                  {menuTripItems.map((destino, index) => (
                    <li key={`${destino.id}-${index}`}>
                      <Link
                        href={destino.url}
                        className="hover:text-accent text-sm"
                      >
                        {destino.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-3 text-primary">
                  QUÉ APRENDERÁS
                </h3>
                <ul className="space-y-2">
                  {["Coaching", "Yoga", "Naturaleza"].map((item) => (
                    <li key={item}>
                      <Link
                        href="/fundamentos"
                        className="hover:text-accent text-sm"
                      >
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </MegaMenuItem>

          {/* <MegaMenuItem
            title="TIENDA"
            href="/productos"
            images={menuItemImages["TIENDA"]}
          >
            <p className="text-primary">Próximamente...</p>
          </MegaMenuItem>

          <MegaMenuItem
            title="BLOG"
            href="/blog"
            images={menuItemImages["BLOG"]}
          >
            <p className="text-primary">Próximamente...</p>
          </MegaMenuItem> */}

          <MegaMenuItem
            title="NOSOTROS"
            href="/about"
            images={menuItemImages["NOSOTROS"]}
          ></MegaMenuItem>

          {/* <li>
            <Link href="/admin/trips" className="hover:text-accent">
              ADMIN
            </Link>
          </li> */}
        </ul>
      </nav>
    </>
  );
}
