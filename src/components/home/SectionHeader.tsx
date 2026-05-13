"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";

// Type for individual image objects
interface SectionImage {
  image_url: string;
  alt_text: string | null;
}

// Type for the API response structure
interface ApiImageData {
  web: SectionImage[];
  mobile: SectionImage[];
}

interface HeaderCache {
  web: SectionImage[];
  mobile: SectionImage[];
  title: string;
}

const HEADER_CACHE_KEY = "integral_section_header";

function loadHeaderCache(): HeaderCache | null {
  if (typeof window === "undefined") return null;
  try {
    const cached = localStorage.getItem(HEADER_CACHE_KEY);
    if (cached) return JSON.parse(cached);
  } catch { /* ignore */ }
  return null;
}

// Define default images to display while loading
const defaultImageUrls = [
  "/images/home/header1.jpg",
  "/images/home/header2.jpg",
  "/images/home/header3.jpg",
  "/images/home/header4.jpg",
];

const defaultSectionImages: SectionImage[] = defaultImageUrls.map(
  (url, index) => ({
    image_url: url,
    alt_text: `Default Header Image ${index + 1}`,
  })
);

const SectionHeader: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  const [activeImages, setActiveImages] =
    useState<SectionImage[]>(defaultSectionImages);
  const [webImages, setWebImages] = useState<SectionImage[]>([]);
  const [mobileImages, setMobileImages] = useState<SectionImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [headerTitle, setHeaderTitle] = useState<string>("Viajes al Mar");
  const [error, setError] = useState<string | null>(null);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const prevActiveImagesRef = useRef<SectionImage[]>(defaultSectionImages);

  // Effect for fetching images and title
  useEffect(() => {
    // Load from cache immediately to avoid showing defaults
    const cached = loadHeaderCache();
    if (cached) {
      setWebImages(cached.web);
      setMobileImages(cached.mobile);
      setHeaderTitle(cached.title);
      setIsLoading(false);
    }

    const fetchData = async () => {
      setError(null);
      try {
        // Fetch Images
        const imageResponse = await fetch("/api/section-header-images");
        if (!imageResponse.ok) {
          throw new Error(
            `Failed to fetch images: ${imageResponse.statusText} (${imageResponse.status})`
          );
        }
        const imageData: ApiImageData = await imageResponse.json();

        // Fetch Title
        let freshTitle = headerTitle;
        const titleResponse = await fetch(
          "/api/config/section_header_main_title"
        );
        if (!titleResponse.ok) {
          if (titleResponse.status === 404) {
            freshTitle = "";
          } else {
            throw new Error(
              `Failed to fetch title: ${titleResponse.statusText} (${titleResponse.status})`
            );
          }
        } else {
          const titleData = await titleResponse.json();
          freshTitle = titleData.value || "";
        }

        // Compare with cache; only update state and cache if data changed
        const freshCache: HeaderCache = {
          web: imageData.web || [],
          mobile: imageData.mobile || [],
          title: freshTitle,
        };
        const cached = localStorage.getItem(HEADER_CACHE_KEY);
        if (JSON.stringify(freshCache) !== cached) {
          localStorage.setItem(HEADER_CACHE_KEY, JSON.stringify(freshCache));
          setWebImages(freshCache.web);
          setMobileImages(freshCache.mobile);
          setHeaderTitle(freshCache.title);
        }
      } catch (e) {
        const errorMessage =
          e instanceof Error ? e.message : "An unknown error occurred";
        if (process.env.NODE_ENV !== "production") {
          console.error("Error fetching section header data:", errorMessage);
        }
        // Only show error state if we have no cached data to display
        if (!loadHeaderCache()) {
          setError(errorMessage);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Effect for determining and setting active images based on screen size and fetched data
  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");

    const handleResize = () => {
      let imagesToSet: SectionImage[];

      if (isLoading) {
        imagesToSet = defaultSectionImages;
      } else {
        const currentWeb = webImages;
        const currentMobile = mobileImages;

        if (mediaQuery.matches) {
          if (currentMobile.length > 0) {
            imagesToSet = currentMobile;
          } else if (currentWeb.length > 0) {
            imagesToSet = currentWeb;
          } else {
            imagesToSet = [];
          }
        } else {
          if (currentWeb.length > 0) {
            imagesToSet = currentWeb;
          } else if (currentMobile.length > 0) {
            imagesToSet = currentMobile;
          } else {
            imagesToSet = [];
          }
        }
      }

      setActiveImages(imagesToSet);
      if (prevActiveImagesRef.current !== imagesToSet) {
        setCurrentIndex(0);
        setPrevIndex(null);
        prevActiveImagesRef.current = imagesToSet;
      }
    };

    handleResize(); // Initial check
    mediaQuery.addEventListener("change", handleResize);

    return () => {
      mediaQuery.removeEventListener("change", handleResize);
    };
  }, [webImages, mobileImages, isLoading]);

  // Effect for slideshow interval
  useEffect(() => {
    if (activeImages.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((cur) => {
        const next = (cur + 1) % activeImages.length;
        setPrevIndex(cur);
        return next;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [activeImages]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (activeImages.length === 0) return;
    if (touchStartX.current !== null && touchEndX.current !== null) {
      const deltaX = touchStartX.current - touchEndX.current;
      if (deltaX > 50) {
        setPrevIndex(currentIndex);
        setCurrentIndex((cur) => (cur + 1) % activeImages.length);
      } else if (deltaX < -50) {
        setPrevIndex(currentIndex);
        setCurrentIndex(
          (cur) => (cur - 1 + activeImages.length) % activeImages.length
        );
      }
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  if (error) {
    return (
      <section className="relative w-full h-[75vh] flex items-center justify-center bg-gray-100">
        <p className="text-red-500 text-xl">Error: {error}</p>
        <div className="absolute inset-0 flex items-end md:items-center justify-center">
          <h1 className="uppercase text-gray-700 text-4xl md:text-7xl drop-shadow-lg font-[Eckmannpsych] mb-20 md:mb-0">
            {headerTitle || "Error Loading Title"}
          </h1>
        </div>
      </section>
    );
  }

  if (activeImages.length === 0 && !isLoading && !error) {
    return (
      <section className="relative w-full h-[75vh] flex items-center justify-center bg-gray-300">
        <p className="text-gray-800 text-xl">No images to display.</p>
        <div className="absolute inset-0 flex items-end md:items-center justify-center">
          <h1 className="uppercase text-gray-700 text-4xl md:text-7xl drop-shadow-lg font-[Eckmannpsych] mb-20 md:mb-0">
            {headerTitle || " "}
          </h1>
        </div>
      </section>
    );
  }

  return (
    <section
      className="relative w-full h-[75vh] overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {activeImages.map((image, index) => {
        if (index !== currentIndex && index !== prevIndex) return null;
        return (
          <Image
            key={`${image.image_url}-${index}`}
            src={image.image_url}
            alt={image.alt_text || "Viajes al Mar"}
            fill
            priority={index === currentIndex}
            sizes="100vw"
            className={`absolute inset-0 object-cover transition-opacity duration-1000 ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          />
        );
      })}

      <div className="absolute inset-0 flex items-end md:items-center justify-center">
        <h1 className="uppercase text-white text-4xl md:text-7xl drop-shadow-2xl font-[Eckmannpsych] mb-20 md:mb-0">
          {headerTitle}
        </h1>
      </div>

      {activeImages.length > 1 && (
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {activeImages.map((_, index) => (
            <button
              key={`dot-${index}`}
              aria-label={`Ir a imagen ${index + 1}`}
              aria-current={index === currentIndex ? true : undefined}
              className={`w-3 h-3 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-1 ${
                index === currentIndex ? "bg-white scale-125" : "bg-gray-400"
              }`}
              onClick={() => {
                setPrevIndex(currentIndex);
                setCurrentIndex(index);
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default SectionHeader;
