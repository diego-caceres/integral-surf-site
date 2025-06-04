import { useState, ReactNode, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface MegaMenuItemProps {
  title: string;
  href: string;
  children?: ReactNode; // Content for the dropdown's main section
  images?: { url: string; alt: string }[]; // Array of image objects for the dropdown
  disabled?: boolean;
  className?: string;
}

const MegaMenuItem = ({
  title,
  href,
  children,
  images,
  disabled,
  className,
}: MegaMenuItemProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const liRef = useRef<HTMLLIElement>(null);
  const [dynamicXOffset, setDynamicXOffset] = useState(0);

  const dropdownVariants = {
    hidden: { opacity: 0, y: 0, display: "none" },
    visible: {
      opacity: 1,
      y: 0,
      display: "block",
      transition: { duration: 0.2 },
    },
    exit: {
      opacity: 0,
      y: 0,
      transition: { duration: 0.15 },
      transitionEnd: { display: "none" },
    },
  };

  const handleMouseEnter = () => {
    if (!disabled) {
      if (liRef.current) {
        // Calculate the offset needed to align the dropdown's left edge with the viewport's left edge
        const rect = liRef.current.getBoundingClientRect();
        setDynamicXOffset(-rect.left);
      }
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    if (!disabled) {
      setIsHovered(false);
    }
  };

  return (
    <li
      ref={liRef}
      className={`relative py-2 ${className || ""}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link
        href={href}
        className={`transition-colors duration-200 pb-1 ${
          disabled
            ? "pointer-events-none text-gray-400"
            : isHovered
            ? "text-primary border-b-2 border-black cursor-default"
            : "text-primary hover:text-accent"
        }`}
        aria-disabled={disabled}
      >
        {title}
      </Link>
      <AnimatePresence>
        {isHovered && !disabled && (
          <motion.div
            style={{ x: dynamicXOffset }} // Apply the dynamic horizontal offset
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={dropdownVariants}
            className="absolute top-full left-0 mt-0 p-6 bg-white shadow-xl z-30 text-sm text-primary w-screen min-h-[250px]" // Full width and min height
          >
            <div
              className={`flex ${
                children ? "gap-x-6" : "justify-center"
              } mx-auto w-full`}
            >
              {images && images.length > 0 && (
                <div className="flex gap-x-4 w-[60%] flex-shrink-0">
                  {images.slice(0, 3).map((image, index) => (
                    <div key={index} className="w-1/3">
                      <Image
                        src={image.url}
                        alt={image.alt}
                        width={200}
                        height={150}
                        className="object-cover rounded-md w-full h-40"
                      />
                    </div>
                  ))}
                </div>
              )}
              {children && (
                <div className="flex-1 min-w-0 pl-16">{children}</div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
};

export default MegaMenuItem;
