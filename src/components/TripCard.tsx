import Link from "next/link";
import { Bebas_Neue } from "next/font/google";
import { Trip } from "@/types/trip";

const bebasNeuelFont = Bebas_Neue({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-bebas-neue",
  weight: ["400"],
});

const TripCard = ({ trip }: { trip: Trip }) => {
  return (
    <Link href={`/viajes/${trip.slug}`} passHref>
      <div
        className={`${bebasNeuelFont.className} tracking-[0.1rem] grid md:grid-cols-[18%_82%] md:gap-10 text-left px-5 md:px-10`}
      >
        <div className="flex md:block justify-start gap-2">
          <p className="text-sm md:text-md">{trip.date}</p>
          <p className="text-sm md:text-md">{trip.date2}</p>
        </div>
        <div>
          <p className="font-semibold text-3xl md:text-5xl">{trip.destiny}</p>
          <p className="text-xs">{trip.coachingSubtitle}</p>
        </div>
      </div>
    </Link>
  );
};

export default TripCard;
