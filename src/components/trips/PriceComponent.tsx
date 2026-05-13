"use client";

import { useEffect, useState } from "react";
import { libreFranklinFont } from "@/styles/fonts";
import Link from "next/link";

interface PriceProps {
  promotionalPrice: number;
  finalPrice: number;
  promoEndMessage?: string;
  finalPriceMessage?: string;
  phoneNumber?: string;
}

const message = "¡Hola! Estoy interesado en saber más sobre tus servicios.";

const PriceComponent: React.FC<PriceProps> = ({
  promotionalPrice,
  finalPrice,
  promoEndMessage,
  finalPriceMessage,
  phoneNumber: initialPhoneNumber,
}) => {
  const [phoneNumber, setPhoneNumber] = useState(initialPhoneNumber ?? "+59899748323");

  useEffect(() => {
    if (initialPhoneNumber) return;
    fetch("/api/config/whatsapp_phone_number")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.value) setPhoneNumber(data.value);
      })
      .catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <div className="flex flex-col gap-8 items-center px-6 py-10 md:px-10 md:py-20">
      <h2 className="font-[Eckmannpsych] tracking-[0.1rem] uppercase text-redColor text-3xl font-bold mb-4">
        Reserva tu lugar
      </h2>
      <div
        className={`${libreFranklinFont.className} flex flex-col sm:flex-row justify-center gap-8 sm:items-center justify-center text-center`}
      >
        {/* Precio Promocional */}
        <Link href={whatsappUrl} target="_blank" rel="noopener noreferrer">
          <div className="border rounded-3xl p-5 bg-redColor text-white flex flex-col">
            <span className="uppercase font-bold text-xl ">Promo</span>
            <span className="uppercase font-bold text-xl">Reserva con 50%</span>
            <div className="font-bold p-2 rounded mt-2 text-5xl ">
              USD {promotionalPrice}
            </div>
            <div className=" ">{promoEndMessage}</div>
          </div>
        </Link>
        <Link href={whatsappUrl} target="_blank" rel="noopener noreferrer">
          <div className="border rounded-3xl p-5 bg-redColor text-white flex flex-col">
            <span className=" uppercase font-bold text-xl">Precio Final</span>
            <span className=" uppercase font-bold text-xl">
              Reserva con 50%
            </span>
            <div className="font-bold p-2 rounded mt-2 text-5xl  ">
              USD {finalPrice}
            </div>
            <div className="">{finalPriceMessage}</div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default PriceComponent;
