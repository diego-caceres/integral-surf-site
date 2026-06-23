"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { cloudinaryUrl, cloudinarySrcSet } from "@/lib/cloudinary";

interface SectionImage {
  image_url: string;
  alt_text: string | null;
}

interface ApiImageData {
  web: SectionImage[];
  mobile: SectionImage[];
}

interface HeaderCache {
  web: SectionImage[];
  mobile: SectionImage[];
  title: string;
}

interface Slide {
  web: SectionImage;
  mobile?: SectionImage;
}

export interface SectionHeaderProps {
  initialWebImages?: SectionImage[];
  initialMobileImages?: SectionImage[];
  initialTitle?: string;
}

const HEADER_CACHE_KEY = "integral_section_header";

function loadHeaderCache(): HeaderCache | null {
  if (typeof window === "undefined") return null;
  try {
    const cached = localStorage.getItem(HEADER_CACHE_KEY);
    if (cached) return JSON.parse(cached);
  } catch {
    /* ignore */
  }
  return null;
}

const defaultImageUrls = [
  "/images/home/header1.jpg",
  "/images/home/header2.jpg",
  "/images/home/header3.jpg",
  "/images/home/header4.jpg",
];

const defaultSectionImages: SectionImage[] = defaultImageUrls.map(
  (url, index) => ({
    image_url: url,
    alt_text: `Integral Surf — imagen ${index + 1}`,
  })
);

// Pair each web image with its matching mobile crop (by order) so every slide
// can be rendered as an art-directed <picture>: the browser downloads only the
// source that matches the viewport, with no JS device detection.
function buildSlides(web: SectionImage[], mobile: SectionImage[]): Slide[] {
  const base = web.length > 0 ? web : mobile;
  return base.map((img, i) => ({
    web: web[i] ?? mobile[i] ?? img,
    mobile: mobile[i],
  }));
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  initialWebImages,
  initialMobileImages,
  initialTitle,
}) => {
  const hasServerData = Boolean(initialWebImages?.length);

  // Seed from server data (or local defaults) so the first slide is present in
  // the initial SSR HTML and the browser can start the LCP download right away.
  const [webImages, setWebImages] = useState<SectionImage[]>(
    hasServerData ? initialWebImages! : defaultSectionImages
  );
  const [mobileImages, setMobileImages] = useState<SectionImage[]>(
    initialMobileImages ?? []
  );
  const [headerTitle, setHeaderTitle] = useState<string>(
    initialTitle ?? "Viajes al Mar"
  );

  const slides = useMemo(
    () => buildSlides(webImages, mobileImages),
    [webImages, mobileImages]
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Background refresh from the API (and localStorage cache when there's no
  // server data) so admin edits show up without a redeploy.
  useEffect(() => {
    if (!hasServerData) {
      const cached = loadHeaderCache();
      if (cached) {
        if (cached.web?.length) setWebImages(cached.web);
        setMobileImages(cached.mobile ?? []);
        setHeaderTitle(cached.title);
      }
    }

    const fetchData = async () => {
      try {
        const [imageResponse, titleResponse] = await Promise.all([
          fetch("/api/section-header-images"),
          fetch("/api/config/section_header_main_title"),
        ]);

        if (!imageResponse.ok) {
          throw new Error(`Failed to fetch images: ${imageResponse.status}`);
        }
        const imageData: ApiImageData = await imageResponse.json();

        let freshTitle = headerTitle;
        if (titleResponse.ok) {
          const titleData = await titleResponse.json();
          freshTitle = titleData.value || "";
        } else if (titleResponse.status !== 404) {
          throw new Error(`Failed to fetch title: ${titleResponse.status}`);
        }

        const freshCache: HeaderCache = {
          web: imageData.web || [],
          mobile: imageData.mobile || [],
          title: freshTitle,
        };
        const existing = localStorage.getItem(HEADER_CACHE_KEY);
        if (JSON.stringify(freshCache) !== existing) {
          localStorage.setItem(HEADER_CACHE_KEY, JSON.stringify(freshCache));
          if (freshCache.web.length) setWebImages(freshCache.web);
          setMobileImages(freshCache.mobile);
          setHeaderTitle(freshTitle);
        }
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Unknown error";
        if (process.env.NODE_ENV !== "production") {
          console.error("Error fetching section header data:", msg);
        }
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep the active index in bounds if the slide count changes on refresh.
  useEffect(() => {
    setCurrentIndex((cur) => (cur < slides.length ? cur : 0));
    setPrevIndex(null);
  }, [slides.length]);

  // Slideshow interval
  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((cur) => {
        setPrevIndex(cur);
        return (cur + 1) % slides.length;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = () => {
    if (slides.length <= 1) return;
    if (touchStartX.current !== null && touchEndX.current !== null) {
      const deltaX = touchStartX.current - touchEndX.current;
      if (deltaX > 50) {
        setPrevIndex(currentIndex);
        setCurrentIndex((cur) => (cur + 1) % slides.length);
      } else if (deltaX < -50) {
        setPrevIndex(currentIndex);
        setCurrentIndex((cur) => (cur - 1 + slides.length) % slides.length);
      }
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  if (slides.length === 0) {
    return (
      <section className="relative w-full h-[75vh] flex items-center justify-center bg-secondary/30">
        <div className="absolute inset-0 flex items-end md:items-center justify-center">
          <h1 className="uppercase text-primary text-4xl md:text-7xl drop-shadow-lg font-[Eckmannpsych] mb-20 md:mb-0">
            {headerTitle || "Viajes al Mar"}
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
      {slides.map((slide, index) => {
        if (index !== currentIndex && index !== prevIndex) return null;
        const isFirst = index === 0;
        return (
          <picture key={`${slide.web.image_url}-${index}`}>
            {slide.mobile && (
              <source
                media="(max-width: 768px)"
                srcSet={
                  cloudinarySrcSet(slide.mobile.image_url, [480, 640, 768, 1024]) ||
                  slide.mobile.image_url
                }
                sizes="100vw"
              />
            )}
            <img
              src={cloudinaryUrl(
                slide.web.image_url,
                "f_auto,q_auto,c_limit,w_1920"
              )}
              srcSet={
                cloudinarySrcSet(slide.web.image_url, [768, 1280, 1920, 2560]) ||
                undefined
              }
              sizes="100vw"
              alt={slide.web.alt_text || slide.mobile?.alt_text || "Viajes al Mar"}
              fetchPriority={isFirst ? "high" : undefined}
              loading={isFirst ? "eager" : "lazy"}
              decoding="async"
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                index === currentIndex ? "opacity-100" : "opacity-0"
              }`}
            />
          </picture>
        );
      })}

      <div className="absolute inset-0 flex items-end md:items-center justify-center">
        <h1 className="uppercase text-white text-4xl md:text-7xl drop-shadow-2xl font-[Eckmannpsych] mb-20 md:mb-0">
          {headerTitle}
        </h1>
      </div>

      {slides.length > 1 && (
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {slides.map((_, index) => (
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
