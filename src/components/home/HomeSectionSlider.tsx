"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import type { HomeSectionImage } from "@/types/homeSections";

interface HomeSectionSliderProps {
  images: HomeSectionImage[];
  fallbackUrl: string;
  alt?: string;
}

export default function HomeSectionSlider({
  images,
  fallbackUrl,
  alt = "",
}: HomeSectionSliderProps) {
  const effectiveImages: HomeSectionImage[] =
    images.length > 0
      ? images
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
      if (deltaX > 50) setCurrentIndex((prev) => (prev + 1) % effectiveImages.length);
      else if (deltaX < -50)
        setCurrentIndex((prev) => (prev - 1 + effectiveImages.length) % effectiveImages.length);
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  if (effectiveImages.length === 0) return null;

  return (
    <div
      className="relative w-full max-w-[500px] aspect-[5/6] overflow-hidden"
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
          priority={index === 0}
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
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
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
