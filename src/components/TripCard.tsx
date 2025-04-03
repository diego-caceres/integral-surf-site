import Link from "next/link";
import { Trip } from "@/types/trip";
import { bebasNeuelFont } from "@/styles/fonts";

const TripCard = ({ trip }: { trip: Trip }) => {
  return (
    <Link href={`/viajes/${trip.slug}`} passHref>
      <div className="bg-red-500 p-3 mb-4 uppercase text-white transition-all duration-300 hover:scale-105 cursor-pointer hover:shadow-lg">
        <div
          className={`${bebasNeuelFont.className} tracking-[0.1rem] text-white grid md:grid-cols-[18%_82%] md:gap-10 text-left px-5 md:px-10 py-1 `}
        >
          <div className="flex md:block justify-start gap-2">
            <p className="text-sm md:text-md">{trip.date_days}</p>
            <p className="text-sm md:text-md">{trip.date_month}</p>
          </div>
          <div>
            <p className="font-semibold text-3xl md:text-5xl">{trip.destiny}</p>
            <p className="text-xs">{trip.coaching_subtitle}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default TripCard;
