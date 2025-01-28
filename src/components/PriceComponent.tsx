interface PriceProps {
  promotionalPrice: number;
  finalPrice: number;
  promotionalPriceValidUntil: string;
}

const PriceComponent: React.FC<PriceProps> = ({
  promotionalPrice,
  finalPrice,
  promotionalPriceValidUntil,
}) => {
  return (
    <>
      <div className="flex flex-col sm:flex-row sm:justify-evenly sm:items-center text-center font-bold">
        {/* Precio Promocional */}
        <div>
          <div className="border rounded-[2vw] p-4 bg-white">
            <div className="text-black uppercase font-bold">
              Precio Promocional
            </div>
            <div className="bg-yellow-300 text-black p-2 rounded mt-2  ">
              USD {promotionalPrice}
            </div>
            <div className="text-black m-2 ">
              Válido hasta {promotionalPriceValidUntil}
            </div>
          </div>
          {/* Información de reserva */}
          <div className="bg-yellow-300 text-black p-4 rounded-[2vw] font-bold mt-5">
            Reserva 50% USD {promotionalPrice / 2}
          </div>
        </div>

        {/* Precio Final */}
        <div className="mt-4 sm:mt-0">
          <div className="border rounded-[2vw] p-4 bg-white">
            <div className="text-black uppercase font-bold">Precio Final</div>
            <div className="bg-yellow-300 text-black p-2 rounded mt-2 font-bold">
              ${finalPrice}
            </div>
            <div className="text-black m-2">A partir del día siguiente</div>
          </div>
          {/* Información de reserva */}
          <div className="bg-yellow-300 text-black p-4 rounded-[2vw] font-bold mt-5">
            Reserva 50% USD {finalPrice / 2}
          </div>
        </div>
      </div>
      {/* Aviso de Mercado Pago */}
      <div className="bg-red-300 text-black p-4 rounded-[2vw] mt-10 text-center">
        Mercado pago hasta 12 cuotas sin interés (Considerar comisión de Mercado
        Pago 10% adicional)
      </div>
    </>
  );
};

export default PriceComponent;
