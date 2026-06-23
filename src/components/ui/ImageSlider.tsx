"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";

export interface SliderImage {
  id: string;
  image_url: string;
  alt_text?: string | null;
  order_number: number;
}

interface ImageSliderProps {
  images: SliderImage[];
  alt: string;
  className?: string;
  fallbackUrl?: string;
  sizes?: string;
  /**
   * Mark the first slide as high priority (preloaded, eager). Only enable this
   * for an above-the-fold/LCP slider — otherwise these images compete with the
   * real LCP. Off by default so below-the-fold sliders lazy-load.
   */
  priority?: boolean;
}

export default function ImageSlider({
  images,
  alt,
  className = "relative w-full h-full overflow-hidden",
  fallbackUrl,
  sizes = "100vw",
  priority = false,
}: ImageSliderProps) {
  const validImages = images.filter((img) => img.image_url);
  const effectiveImages: SliderImage[] =
    validImages.length > 0
      ? validImages
      : fallbackUrl
      ? [{ id: "fallback", image_url: fallbackUrl, order_number: 0 }]
      : [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  useEffect(() => {
    if (effectiveImages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % effectiveImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [effectiveImages.length]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = () => {
    if (effectiveImages.length <= 1) return;
    if (touchStartX.current !== null && touchEndX.current !== null) {
      const deltaX = touchStartX.current - touchEndX.current;
      if (deltaX > 50)
        setCurrentIndex((prev) => (prev + 1) % effectiveImages.length);
      else if (deltaX < -50)
        setCurrentIndex(
          (prev) => (prev - 1 + effectiveImages.length) % effectiveImages.length
        );
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  if (effectiveImages.length === 0) return null;

  return (
    <div
      className={className}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {effectiveImages.map((image, index) => (
        <Image
          key={`${image.id}-${index}`}
          src={image.image_url}
          alt={image.alt_text || alt}
          fill
          priority={priority && index === 0}
          loading={priority && index === 0 ? "eager" : "lazy"}
          sizes={sizes}
          className={`absolute inset-0 object-cover transition-opacity duration-1000 ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      {effectiveImages.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
          {effectiveImages.map((_, index) => (
            <button
              key={`dot-${index}`}
              aria-label={`Ir a imagen ${index + 1}`}
              aria-current={index === currentIndex ? "true" : undefined}
              className={`w-3 h-3 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-1 ${
                index === currentIndex ? "bg-white scale-125" : "bg-gray-400"
              }`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
