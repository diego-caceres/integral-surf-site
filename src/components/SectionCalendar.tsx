"use client";
import { trips } from "@/constants";
import TripCard from "@/components/TripCard";

const SectionCalendar: React.FC = () => {
  return (
    <section className="w-full md:h-[90vh] md:px-20 pt-10 md:py-20">
      <div className="px-10">
        <h2 className="font-[Eckmannpsych] text-redColor tracking-[0.1rem]">
          CALENDARIO 2025
        </h2>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4">
            {/* Left and right columns */}
            <div>
              {trips.slice(0, 4).map((trip) => (
                <div
                  key={trip.id}
                  className="bg-red-500 p-3 mb-4 uppercase text-white"
                >
                  <TripCard trip={trip} />
                </div>
              ))}
            </div>

            <div>
              {trips.slice(4, 8).map((trip) => (
                <div
                  key={trip.id}
                  className="bg-red-500 p-3 mb-4 uppercase text-white"
                >
                  <TripCard trip={trip} />
                </div>
              ))}
            </div>
          </div>

          {/* Last trip centered below the columns */}
          <div className="flex justify-center md:mt-4">
            {trips.slice(8, 9).map((trip) => (
              <div
                key={trip.id}
                className="bg-red-500 p-2 mb-4 w-full max-w-xl uppercase text-white"
              >
                <TripCard trip={trip} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SectionCalendar;
