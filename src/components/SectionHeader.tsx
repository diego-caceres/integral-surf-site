"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";

interface SectionHeaderProps {
  title: string;
}

const images = [
  "/images/home/header1.jpg",
  "/images/home/header2.jpg",
  "/images/home/header3.jpg",
  "/images/home/header4.jpg",
];

const SectionHeader: React.FC<SectionHeaderProps> = ({ title }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current !== null && touchEndX.current !== null) {
      const deltaX = touchStartX.current - touchEndX.current;
      if (deltaX > 50) {
        // Swipe left
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      } else if (deltaX < -50) {
        // Swipe right
        setCurrentIndex(
          (prevIndex) => (prevIndex - 1 + images.length) % images.length
        );
      }
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <section
      className="relative w-full h-[75vh] overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background Images */}
      {images.map((src, index) => (
        <Image
          key={index}
          src={src}
          alt="Viajes al Mar"
          fill
          className={`absolute inset-0 object-cover transition-opacity duration-1000 ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      {/* Title */}
      <div className="absolute inset-0 flex items-end md:items-center justify-center">
        <h1 className="uppercase text-white text-7xl drop-shadow-2xl font-[Eckmannpsych] mb-20 md:mb-0">
          {title}
        </h1>
      </div>

      {/* Dots Navigation */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex ? "bg-white scale-125" : "bg-gray-400"
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </section>
  );
};

export default SectionHeader;
