import Link from "next/link";
import { Trip } from "@/types/trip";
import { bebasNeuelFont } from "@/styles/fonts";

const TripCard = ({ trip }: { trip: Trip }) => {
  return (
    <Link href={`/viajes/${trip.slug}`} passHref className="block h-full">
      <div className="bg-red-500 p-3 h-full uppercase text-white transition-all duration-300 hover:scale-105 cursor-pointer hover:shadow-lg">
        <div
          className={`${bebasNeuelFont.className} tracking-[0.1rem] text-white grid min-[1190px]:grid-cols-[18%_82%] min-[1190px]:gap-10 min-[1190px]:items-center text-left px-5 min-[1190px]:px-10 py-1 h-full`}
        >
          <div className="flex min-[1190px]:block center gap-2 min-[1190px]:gap-0 min-[1190px]:leading-tight">
            <p className="text-sm min-[1190px]:text-base">{trip.date_month}</p>
            <p className="text-sm min-[1190px]:text-base">{trip.date_days}</p>
            {trip.date_days_2 && trip.date_month_2 && (
              <>
                <p className="text-sm min-[1190px]:text-base min-[1190px]:mt-1">{trip.date_month_2}</p>
                <p className="text-sm min-[1190px]:text-base">{trip.date_days_2}</p>
              </>
            )}
          </div>
          <div>
            <p className="font-semibold text-3xl min-[1190px]:text-5xl">{trip.destiny}</p>
            <p className="text-xs">{trip.coaching_subtitle}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default TripCard;
