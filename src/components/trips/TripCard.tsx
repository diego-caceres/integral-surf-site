import Link from "next/link";
import { Trip } from "@/types/trip";
import { bebasNeuelFont } from "@/styles/fonts";

const TripCard = ({ trip }: { trip: Trip }) => {
  return (
    <Link href={`/viajes/${trip.slug}`} passHref className="block h-full">
      <div className="bg-redColor p-3 h-full uppercase text-white transition-all duration-300 hover:scale-105 cursor-pointer hover:shadow-lg">
        <div
          className={`${bebasNeuelFont.className} tracking-[0.1rem] text-white grid xl-surf:grid-cols-[18%_82%] xl-surf:gap-10 xl-surf:items-center text-left px-5 xl-surf:px-10 py-1 h-full`}
        >
          <div className="flex xl-surf:block center gap-2 xl-surf:gap-0 xl-surf:leading-tight">
            <p className="text-sm xl-surf:text-base">{trip.date_month}</p>
            <p className="text-sm xl-surf:text-base">{trip.date_days}</p>
            {trip.date_days_2 && trip.date_month_2 && (
              <>
                <p className="text-sm xl-surf:text-base xl-surf:mt-1">{trip.date_month_2}</p>
                <p className="text-sm xl-surf:text-base">{trip.date_days_2}</p>
              </>
            )}
          </div>
          <div>
            <p className="font-semibold text-3xl xl-surf:text-5xl">{trip.destiny}</p>
            <p className="text-xs">{trip.coaching_subtitle}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default TripCard;
