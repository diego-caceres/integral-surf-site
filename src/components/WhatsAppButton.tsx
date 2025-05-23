"use client";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";
import React, { useEffect, useState } from "react";

type WhatsAppButtonProps = {
  onlyBubble?: boolean;
};

const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  onlyBubble = false,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const phoneNumber = "+59899748323";
  const message = "¡Hola! Estoy interesado en saber más sobre tus servicios."; // Mensaje predeterminado

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    message
  )}`;

  useEffect(() => {
    const handleScroll = () => {
      if (onlyBubble) {
        return;
      }

      // Verifica si hemos llegado al final de la página
      const scrollPosition =
        window.innerHeight + document.documentElement.scrollTop;
      const bottomPosition = document.documentElement.offsetHeight;

      if (scrollPosition + 150 >= bottomPosition) {
        setIsVisible(false); // Oculta el botón si llegamos al final de la página
      } else {
        setIsVisible(true); // Muestra el botón cuando no estamos al final
      }
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {!onlyBubble && (
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center bg-[#4dc247] text-white font-semibold py-3 px-6 rounded-full shadow-md hover:bg-[#128C7E] focus:outline-none transition-all duration-300"
        >
          <svg viewBox="0 0 32 32" className="whatsapp-ico">
            <path
              d=" M19.11 17.205c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.315-.1c-.802-.402-1.504-.817-2.163-1.447-.545-.516-1.146-1.29-1.46-1.963a.426.426 0 0 1-.073-.215c0-.33.99-.945.99-1.49 0-.143-.73-2.09-.832-2.335-.143-.372-.214-.487-.6-.487-.187 0-.36-.043-.53-.043-.302 0-.53.115-.746.315-.688.645-1.032 1.318-1.06 2.264v.114c-.015.99.472 1.977 1.017 2.78 1.23 1.82 2.506 3.41 4.554 4.34.616.287 2.035.888 2.722.888.817 0 2.15-.515 2.478-1.318.13-.33.244-.73.244-1.088 0-.058 0-.144-.03-.215-.1-.172-2.434-1.39-2.678-1.39zm-2.908 7.593c-1.747 0-3.48-.53-4.942-1.49L7.793 24.41l1.132-3.337a8.955 8.955 0 0 1-1.72-5.272c0-4.955 4.04-8.995 8.997-8.995S25.2 10.845 25.2 15.8c0 4.958-4.04 8.998-8.998 8.998zm0-19.798c-5.96 0-10.8 4.842-10.8 10.8 0 1.964.53 3.898 1.546 5.574L5 27.176l5.974-1.92a10.807 10.807 0 0 0 16.03-9.455c0-5.958-4.842-10.8-10.802-10.8z"
              fillRule="evenodd"
            ></path>
          </svg>
          <span>Contactate para reservar tu lugar</span>
        </a>
      )}
      {isVisible && (
        <Link
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 md:bottom-8 md:right-8 bg-green-500 text-white p-4 md:p-5 rounded-full shadow-lg shadow-green-700/50 hover:bg-green-600 transition-transform transform hover:scale-110"
        >
          <FaWhatsapp className="w-6 h-6 md:w-8 md:h-8" />
        </Link>
        // <a
        //   href={whatsappUrl}
        //   target="_blank"
        //   rel="noopener noreferrer"
        //   className="flex items-center justify-center text-white hover:bg-[#128C7E] focus:outline-none transition-all duration-300"
        // >
        //   <svg viewBox="0 0 32 32" className="whatsapp-globe-ico">
        //     <path
        //       d=" M19.11 17.205c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.315-.1c-.802-.402-1.504-.817-2.163-1.447-.545-.516-1.146-1.29-1.46-1.963a.426.426 0 0 1-.073-.215c0-.33.99-.945.99-1.49 0-.143-.73-2.09-.832-2.335-.143-.372-.214-.487-.6-.487-.187 0-.36-.043-.53-.043-.302 0-.53.115-.746.315-.688.645-1.032 1.318-1.06 2.264v.114c-.015.99.472 1.977 1.017 2.78 1.23 1.82 2.506 3.41 4.554 4.34.616.287 2.035.888 2.722.888.817 0 2.15-.515 2.478-1.318.13-.33.244-.73.244-1.088 0-.058 0-.144-.03-.215-.1-.172-2.434-1.39-2.678-1.39zm-2.908 7.593c-1.747 0-3.48-.53-4.942-1.49L7.793 24.41l1.132-3.337a8.955 8.955 0 0 1-1.72-5.272c0-4.955 4.04-8.995 8.997-8.995S25.2 10.845 25.2 15.8c0 4.958-4.04 8.998-8.998 8.998zm0-19.798c-5.96 0-10.8 4.842-10.8 10.8 0 1.964.53 3.898 1.546 5.574L5 27.176l5.974-1.92a10.807 10.807 0 0 0 16.03-9.455c0-5.958-4.842-10.8-10.802-10.8z"
        //       fillRule="evenodd"
        //     ></path>
        //   </svg>
        // </a>
      )}
    </>
  );
};

export default WhatsAppButton;
