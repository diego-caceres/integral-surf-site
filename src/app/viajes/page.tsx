import { NextSeo } from "next-seo";

const trips = [
  { id: 1, title: "Bali Surf Trip", date: "Julio 2025" },
  { id: 2, title: "Costa Rica Adventure", date: "Agosto 2025" },
];

export default function Viajes() {
  return (
    <>
      <NextSeo
        title="Viajes de Surf - Explora destinos"
        description="Los mejores destinos para tu próxima aventura de surf."
        openGraph={{
          url: "https://my-surf-site.vercel.app/viajes",
          title: "Viajes de Surf",
          description: "Descubre nuestros increíbles destinos.",
        }}
      />
      <div>
        <h1 className="text-3xl font-bold mb-4">Nuestros Viajes</h1>
        <ul>
          {trips.map((trip) => (
            <li
              key={trip.id}
              className="mb-2 p-4 bg-white shadow-md rounded-lg"
            >
              <h2 className="text-xl font-bold">{trip.title}</h2>
              <p className="text-gray-600">Fecha: {trip.date}</p>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
