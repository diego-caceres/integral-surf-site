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

// Adjust to not expect title prop
const SectionHeader: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeImages, setActiveImages] =
    useState<SectionImage[]>(defaultSectionImages);
  const [webImages, setWebImages] = useState<SectionImage[]>([]);
  const [mobileImages, setMobileImages] = useState<SectionImage[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Combined loading state for images and title
  const [headerTitle, setHeaderTitle] = useState<string>(""); // State for the title
  const [error, setError] = useState<string | null>(null);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Effect for fetching images and title
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
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
        setWebImages(imageData.web || []);
        setMobileImages(imageData.mobile || []);

        // Fetch Title
        const titleResponse = await fetch(
          "/api/config/section_header_main_title"
        );
        if (!titleResponse.ok) {
          // If title is not found (404) or other error, we can set a default or leave it empty
          if (titleResponse.status === 404) {
            console.warn(
              "Main title configuration not found, using empty title."
            );
            setHeaderTitle(""); // Or a default title like "Welcome"
          } else {
            throw new Error(
              `Failed to fetch title: ${titleResponse.statusText} (${titleResponse.status})`
            );
          }
        } else {
          const titleData = await titleResponse.json();
          setHeaderTitle(titleData.value || ""); // Ensure value exists
        }
      } catch (e) {
        const errorMessage =
          e instanceof Error ? e.message : "An unknown error occurred";
        console.error("Error fetching section header data:", errorMessage);
        setError(errorMessage);
        // Keep webImages and mobileImages empty on error, resize effect will handle it
        // Also, headerTitle will remain its initial value or the value from a partially successful fetch
      } finally {
        setIsLoading(false); // Fetch attempt is complete
      }
    };
    fetchData();
  }, []);

  // Effect for determining and setting active images based on screen size and fetched data
  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");

    const handleResize = () => {
      let imagesToSet: SectionImage[];

      if (isLoading) {
        // Data is still fetching, ensure defaults are shown.
        // (activeImages is already initialized to defaultSectionImages)
        imagesToSet = defaultSectionImages;
      } else {
        // Fetching is complete, use fetched images or fall back appropriately.
        const currentWeb = webImages;
        const currentMobile = mobileImages;

        if (mediaQuery.matches) {
          // Mobile view
          if (currentMobile.length > 0) {
            imagesToSet = currentMobile;
          } else if (currentWeb.length > 0) {
            imagesToSet = currentWeb; // Fallback to web images on mobile if no mobile images
          } else {
            imagesToSet = []; // No fetched images for mobile or web
          }
        } else {
          // Desktop view
          if (currentWeb.length > 0) {
            imagesToSet = currentWeb;
          } else if (currentMobile.length > 0) {
            imagesToSet = currentMobile; // Fallback to mobile images on desktop if no web images
          } else {
            imagesToSet = []; // No fetched images for web or mobile
          }
        }
      }

      setActiveImages(imagesToSet);
      // Only reset currentIndex if the actual image set content changes to avoid unnecessary flicker
      // This requires comparing imagesToSet with previous activeImages, which can be complex.
      // For simplicity, resetting index is safer if image set *might* have changed.
      if (activeImages !== imagesToSet) {
        // Basic check, might need deep comparison for stability
        setCurrentIndex(0);
      }
    };

    handleResize(); // Initial check
    mediaQuery.addEventListener("change", handleResize);

    return () => {
      mediaQuery.removeEventListener("change", handleResize);
    };
    // Rerun when fetched image data changes, or loading state transitions
  }, [webImages, mobileImages, isLoading, activeImages]); // isLoading here refers to the combined loading state

  // Effect for slideshow interval
  useEffect(() => {
    // Do not start slideshow if images are effectively empty or still in initial loading phase (handled by activeImages content)
    if (activeImages.length === 0) return;
    // if (isLoading && activeImages === defaultSectionImages) return; // More explicit check if needed

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % activeImages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [activeImages]); // Depend on activeImages directly

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
        setCurrentIndex((prevIndex) => (prevIndex + 1) % activeImages.length);
      } else if (deltaX < -50) {
        setCurrentIndex(
          (prevIndex) =>
            (prevIndex - 1 + activeImages.length) % activeImages.length
        );
      }
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  // No longer show "Loading images..." text directly, as default images are shown.
  // if (isLoading) { ... }

  if (error) {
    return (
      <section className="relative w-full h-[75vh] flex items-center justify-center bg-gray-100">
        <p className="text-red-500 text-xl">Error: {error}</p>
        <div className="absolute inset-0 flex items-end md:items-center justify-center">
          <h1 className="uppercase text-gray-700 text-7xl drop-shadow-lg font-[Eckmannpsych] mb-20 md:mb-0">
            {/* Display fetched title or a fallback if error specifically affected title and not images */}
            {headerTitle || "Error Loading Title"}
          </h1>
        </div>
      </section>
    );
  }

  // Show if there are no images to display AFTER loading/fetching attempt and no error
  // This condition might need adjustment if title is critical for display
  if (activeImages.length === 0 && !isLoading && !error) {
    return (
      <section className="relative w-full h-[75vh] flex items-center justify-center bg-gray-300">
        <p className="text-gray-800 text-xl">No images to display.</p>
        <div className="absolute inset-0 flex items-end md:items-center justify-center">
          <h1 className="uppercase text-gray-700 text-7xl drop-shadow-lg font-[Eckmannpsych] mb-20 md:mb-0">
            {/* Display fetched title or a fallback */}
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
      {activeImages.map((image, index) => (
        <Image
          key={`${image.image_url}-${index}`}
          src={image.image_url}
          alt={image.alt_text || "Viajes al Mar"}
          fill
          priority={index === 0}
          className={`absolute inset-0 object-cover transition-opacity duration-1000 ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }
          }`}
        />
      ))}

      <div className="absolute inset-0 flex items-end md:items-center justify-center">
        <h1 className="uppercase text-white text-7xl drop-shadow-2xl font-[Eckmannpsych] mb-20 md:mb-0">
          {headerTitle}
        </h1>
      </div>

      {activeImages.length > 1 && (
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {activeImages.map((_, index) => (
            <button
              key={`dot-${index}`}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex ? "bg-white scale-125" : "bg-gray-400"
              }
              }`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default SectionHeader;
