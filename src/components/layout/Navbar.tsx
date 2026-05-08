"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  fetchTripsOnce,
  fetchDestinosTitleOnce,
  getTripsFromCache,
  getDestinosTitleFromCache,
} from "@/lib/tripsCache";
import { Bars3Icon, XMarkIcon, ChevronDownIcon } from "@heroicons/react/24/solid";
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
  title_2?: string;
  is_deleted?: boolean;
}

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [viajesOpen, setViajesOpen] = useState(true);
  const [menuItemImages, setMenuItemImages] = useState<MenuImagesData>({});
  const [menuTripItems, setMenuTripItems] = useState<MenuTripItem[]>([]);
  const [destinosTitle, setDestinosTitle] = useState("DESTINOS 2026");
  const [showStickyNav, setShowStickyNav] = useState(false);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setIsOpen((prev) => !prev);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Focus trap + Escape key inside the mobile drawer
  useEffect(() => {
    if (!isOpen) return;

    const drawer = drawerRef.current;
    if (!drawer) return;

    const focusable = drawer.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    first?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeMenu();
        hamburgerRef.current?.focus();
        return;
      }
      if (e.key !== "Tab") return;
      if (focusable.length === 0) { e.preventDefault(); return; }
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeMenu]);

  function tripsToMenuItems(trips: TripData[]): MenuTripItem[] {
    return trips
      .filter((trip) => !trip.is_deleted)
      .map((trip) => ({
        name: trip.title + (trip.title_2 ? ", " + trip.title_2 : ""),
        id: trip.slug,
        url: `/viajes/${trip.slug}`,
      }));
  }

  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const currentY = window.scrollY;
          if (currentY < 80) {
            setShowStickyNav(false);
          } else if (currentY < lastY) {
            setShowStickyNav(true);
          } else if (currentY > lastY) {
            setShowStickyNav(false);
          }
          lastY = currentY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Populate from cache immediately after mount, then refresh in background
    const cachedTrips = getTripsFromCache();
    if (cachedTrips) setMenuTripItems(tripsToMenuItems(cachedTrips));
    const cachedTitle = getDestinosTitleFromCache();
    if (cachedTitle) setDestinosTitle(cachedTitle);

    const fetchMenuItems = async () => {
      try {
        const response = await fetch("/api/menu-images");
        if (!response.ok) throw new Error("Failed to fetch menu images");
        const data: MenuImagesData = await response.json();
        setMenuItemImages(data);
      } catch (error) {
        console.error("Error fetching menu images:", error);
      }
    };

    fetchMenuItems();

    fetchTripsOnce()
      .then((trips) => setMenuTripItems(tripsToMenuItems(trips)))
      .catch((err) => console.error("Error fetching trips:", err));

    fetchDestinosTitleOnce()
      .then((title) => setDestinosTitle(title))
      .catch((err) => console.error("Error fetching destinos title:", err));
  }, []);

  return (
    <>
      {/* Botón de menú para móviles */}
      <div className="md:hidden p-4  items-center grid grid-cols-[15%_70%_15%]">
        <button
          ref={hamburgerRef}
          onClick={toggleMenu}
          onPointerDown={(e) => e.preventDefault()}
          aria-label="Abrir menú"
          aria-expanded={isOpen}
          aria-controls="mobile-nav-drawer"
          className="rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
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
      <AnimatePresence>
      {isOpen && (
      <motion.div
        ref={drawerRef}
        id="mobile-nav-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Menú de navegación"
        initial={{ x: "-100%" }}
        animate={{ x: "0%" }}
        exit={{ x: "-100%" }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="fixed inset-0 z-50 bg-background text-primary w-64 shadow-lg flex flex-col p-6 md:hidden"
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
          onClick={closeMenu}
          onPointerDown={(e) => e.preventDefault()}
          className="self-end mb-8 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          aria-label="Cerrar menú"
        >
          <XMarkIcon className="h-8 w-8 text-primary" />
        </button>

        <nav className="flex flex-col gap-6 items-start">
          <Link
            href="/"
            className="text-3xl font-serif tracking-wide"
            onClick={closeMenu}
            prefetch
          >
            <span className="text-primary font-[Eckmannpsych]">
              INTEGRAL SURF
            </span>
          </Link>

          <div className="flex flex-col w-full">
            <button
              onClick={() => setViajesOpen((v) => !v)}
              className="flex items-center justify-between w-full text-xl font-semibold hover:text-accent transition rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              aria-expanded={viajesOpen}
            >
              <span>VIAJES AL MAR</span>
              <ChevronDownIcon
                className={`h-5 w-5 transition-transform duration-300 ${viajesOpen ? "rotate-180" : ""}`}
              />
            </button>

            <AnimatePresence initial={false}>
              {viajesOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="pl-3 pt-4 flex flex-col gap-4">
                    <div>
                      <p className="text-xs font-semibold text-primary/60 mb-2 tracking-widest">
                        {destinosTitle}
                      </p>
                      <ul className="flex flex-col gap-1.5">
                        {menuTripItems.map((destino, index) => (
                          <li key={`${destino.id}-${index}`}>
                            <Link
                              href={destino.url}
                              onClick={closeMenu}
                              className="text-sm hover:text-accent transition"
                            >
                              {destino.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-primary/60 mb-2 tracking-widest">
                        FUNDAMENTOS
                      </p>
                      <ul className="flex flex-col gap-1.5">
                        {["Surfing", "Yoga", "Naturaleza", "Arte"].map((item, index) => (
                          <li key={item}>
                            <Link
                              href={`/fundamentos#section-${index}`}
                              onClick={closeMenu}
                              className="text-sm hover:text-accent transition"
                            >
                              {item}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link
            href="/about"
            className="text-xl font-semibold hover:text-accent transition"
            onClick={closeMenu}
            prefetch
          >
            NOSOTROS
          </Link>
        </nav>
      </motion.div>
      )}
      </AnimatePresence>

      {/* Navbar para desktop */}
      <nav className="hidden md:flex justify-between items-center py-8 px-10 relative">
        <Link href="/" className="text-4xl font-serif tracking-wide">
          <span className="text-primary font-[Eckmannpsych]">
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
                  FUNDAMENTOS
                </h3>
                <ul className="space-y-2">
                  {["Surfing", "Yoga", "Naturaleza", "Arte"].map((item, index) => (
                    <li key={item}>
                      <Link
                        href={`/fundamentos#section-${index}`}
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

          <MegaMenuItem
            title="NOSOTROS"
            href="/about"
            images={menuItemImages["NOSOTROS"]}
          ></MegaMenuItem>
        </ul>
      </nav>

      {/* Sticky navbar — slides in from top when scrolling up, hidden at top */}
      <AnimatePresence>
        {showStickyNav && (
          <motion.div
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed top-0 left-0 right-0 z-40 bg-white shadow-md"
          >
            {/* Mobile sticky bar */}
            <div className="md:hidden p-4 items-center grid grid-cols-[15%_70%_15%]">
              <button
                onClick={toggleMenu}
                onPointerDown={(e) => e.preventDefault()}
                aria-label="Abrir menú"
                aria-expanded={isOpen}
                aria-controls="mobile-nav-drawer"
                className="rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                <Bars3Icon className="h-8 w-8 text-primary" />
              </button>
              <Link href="/" className="flex justify-center">
                <Image
                  src="/images/icons/logo.png"
                  alt="Logo Integral Surf"
                  width={55}
                  height={55}
                />
              </Link>
            </div>

            {/* Desktop sticky nav */}
            <nav className="hidden md:flex justify-between items-center py-4 px-10 relative">
              <Link href="/" className="text-3xl font-serif tracking-wide">
                <span className="text-primary font-[Eckmannpsych]">
                  INTEGRAL SURF
                </span>
              </Link>
              <div className="absolute left-1/2 transform -translate-x-1/2 z-40">
                <Image
                  src="/images/icons/logo.png"
                  alt="Logo Integral Surf"
                  width={80}
                  height={80}
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
                          <li key={`sticky-${destino.id}-${index}`}>
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
                        FUNDAMENTOS
                      </h3>
                      <ul className="space-y-2">
                        {["Surfing", "Yoga", "Naturaleza", "Arte"].map((item, index) => (
                          <li key={`sticky-fund-${item}`}>
                            <Link
                              href={`/fundamentos#section-${index}`}
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

                <MegaMenuItem
                  title="NOSOTROS"
                  href="/about"
                  images={menuItemImages["NOSOTROS"]}
                ></MegaMenuItem>
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
