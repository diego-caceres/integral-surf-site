import Image from "next/image";
import { format } from "date-fns";
import { Trip } from "@/types/trip";
import PriceComponent from "@/components/PriceComponent";
import WhatsAppButton from "@/components/WhatsAppButton";

function extractVideoId(url: string): string {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : "";
}

const TripDetail = ({ trip }: { trip: Trip }) => {
  if (!trip) {
    return <p className="text-center text-gray-500">Viaje no encontrado.</p>;
  }

  const promoEndDate = trip.promoEndDate
    ? format(new Date(trip.promoEndDate), "dd MMMM yyyy")
    : null;

  return (
    <div>
      {/* Header Section */}
      <header className="relative w-full h-[80vh]">
        {trip.headerVideo ? (
          <div className="relative w-full h-[80vh] overflow-hidden">
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src={`https://www.youtube.com/embed/${extractVideoId(
                trip.headerVideo
              )}?autoplay=1&mute=1`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          </div>
        ) : (
          <div className="relative w-full h-[80vh]">
            <Image
              src={trip.headerImage || "/images/placeholder.jpg"}
              alt={`${trip.title} - Header`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
              priority
            />
          </div>
        )}
      </header>

      {/* Main Content */}
      <div className="p-6 sm:p-8 max-w-7xl mx-auto">
        <div className="text-primary flex items-center justify-center">
          <h1 className="text-5xl font-bold">{trip.title}</h1>
        </div>
        {/* Description */}
        <section className="mb-8">
          <p className="text-gray-700 leading-relaxed my-20">
            {trip.shortDescription}
          </p>
        </section>

        {/* Image Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {trip.images.map((image, index) => (
            <div
              key={index}
              className="relative w-full h-64 rounded-lg overflow-hidden shadow-md"
            >
              <Image
                src={image}
                alt={`${trip.title} - Imagen ${index + 1}`}
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
        </div>

        {/* Extra Info */}
        <section className="bg-secondary text-black p-6 rounded-lg shadow-md mb-8">
          <p className="text-lg">
            <span className="font-bold">Cupos disponibles:</span> {trip.seats}
          </p>
        </section>

        {/* Pricing Section */}
        <div className="bg-gray-900 p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-white">Precios</h2>
          <PriceComponent
            promotionalPrice={trip.promoPrice}
            finalPrice={trip.finalPrice}
            promotionalPriceValidUntil={promoEndDate || ""}
          />
        </div>

        {/* Google Map Section */}
        <div className="bg-gray-100 p-6 rounded-lg shadow-md ">
          <h2 className="text-2xl font-semibold mb-4">Ubicación</h2>
          <div className="aspect-video w-full rounded-lg overflow-hidden ">
            <iframe
              src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBTWdILmwVSH43ZeMTYUk6msxuTwruo65I&q=${trip.location.lat},${trip.location.lng}&zoom=13`}
              width="100%"
              height="100%"
              allowFullScreen
              loading="lazy"
              className="border-0"
            />
          </div>
        </div>

        {/* Contact Button */}
        <div className="m-auto max-w-[400px] mt-10">
          <WhatsAppButton />
        </div>
      </div>
    </div>
  );
};

export default TripDetail;
