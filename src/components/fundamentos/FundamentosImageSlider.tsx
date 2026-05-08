"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import type { FundamentosSectionImage } from "@/types/fundamentos";

interface FundamentosImageSliderProps {
  images: FundamentosSectionImage[];
  alt: string;
}

export default function FundamentosImageSlider({
  images,
  alt,
}: FundamentosImageSliderProps) {
  const validImages = images.filter((img) => img.image_url);
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  useEffect(() => {
    if (validImages.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % validImages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [validImages.length]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (validImages.length <= 1) return;
    if (touchStartX.current !== null && touchEndX.current !== null) {
      const deltaX = touchStartX.current - touchEndX.current;
      if (deltaX > 50) {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % validImages.length);
      } else if (deltaX < -50) {
        setCurrentIndex(
          (prevIndex) => (prevIndex - 1 + validImages.length) % validImages.length
        );
      }
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  if (validImages.length === 0) {
    return (
      <div className="relative h-[500px] rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center">
        <p className="text-gray-500">No images available</p>
      </div>
    );
  }

  return (
    <div
      className="relative h-[500px] rounded-lg overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {validImages.map((image, index) => (
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

      {validImages.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {validImages.map((_, index) => (
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
