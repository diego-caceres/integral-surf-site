// "use client";

// import Image from "next/image";

// interface SectionHeaderProps {
//   title: string;
// }

// const SectionHeader: React.FC<SectionHeaderProps> = ({ title }) => {
//   return (
//     <section className="relative w-full h-[75vh]">
//       {/* Desktop */}
//       <Image
//         src="/images/home/header.jpg"
//         alt="Viajes al Mar"
//         fill
//         className="hidden md:flex absolute inset-0"
//       />
//       {/* Mobile */}
//       <Image
//         src="/images/home/header-mobile.png"
//         alt="Viajes al Mar"
//         fill
//         style={{ objectFit: "cover" }}
//         className="md:hidden md:flex absolute inset-0"
//       />
//       <div className="absolute inset-0 flex items-end md:items-center justify-center">
//         <h1 className="uppercase text-white text-7xl drop-shadow-lg font-[Eckmannpsych] mb-20 md:mb-0">
//           {title}
//         </h1>
//       </div>
//     </section>
//   );
// };

// export default SectionHeader;

"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full h-[75vh] overflow-hidden">
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
