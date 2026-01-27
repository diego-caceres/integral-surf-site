import Link from "next/link";
import { Trip } from "@/types/trip";
import { bebasNeuelFont } from "@/styles/fonts";

const TripCard = ({ trip }: { trip: Trip }) => {
  return (
    <Link href={`/viajes/${trip.slug}`} passHref>
      <div className="bg-red-500 p-3 mb-4 uppercase text-white transition-all duration-300 hover:scale-105 cursor-pointer hover:shadow-lg">
        <div
          className={`${bebasNeuelFont.className} tracking-[0.1rem] text-white grid md:grid-cols-[18%_82%] md:gap-10 md:items-center text-left px-5 md:px-10 py-1`}
        >
          <div className="flex md:block center gap-2 md:gap-0 md:leading-tight">
            <p className="text-sm md:text-md">{trip.date_month}</p>
            <p className="text-sm md:text-md">{trip.date_days}</p>
            {trip.date_days_2 && trip.date_month_2 && (
              <>
                <p className="text-sm md:text-md md:mt-1">{trip.date_month_2}</p>
                <p className="text-sm md:text-md">{trip.date_days_2}</p>
              </>
            )}
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
