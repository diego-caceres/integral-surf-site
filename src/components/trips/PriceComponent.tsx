import { libreFranklinFont } from "@/styles/fonts";
import Link from "next/link";

interface PriceProps {
  promotionalPrice: number;
  finalPrice: number;
  promoEndMessage?: string;
  finalPriceMessage?: string;
}

const PriceComponent: React.FC<PriceProps> = ({
  promotionalPrice,
  finalPrice,
  promoEndMessage,
  finalPriceMessage,
}) => {
  const phoneNumber = "+59899748323";
  const message = "¡Hola! Estoy interesado en saber más sobre tus servicios."; // Mensaje predeterminado

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    message
  )}`;

  return (
    <div className="flex flex-col gap-8 items-center px-10 py-20">
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
