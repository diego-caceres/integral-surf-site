"use client";
import Link from "next/link";
import { trips } from "@/constants";

export default function Viajes() {
  return (
    <>
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        <h1 className="text-3xl font-bold mb-6">Nuestros Viajes</h1>
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip) => (
            <li
              key={trip.id}
              className="p-6 bg-white shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300"
            >
              <Link href={`/viajes/${trip.id}`} passHref>
                <div className="mb-4 flex items-center justify-center bg-secondary text-black text-xl font-semibold rounded-lg py-2 px-4 mx-auto">
                  {trip.date}
                </div>
                <h2 className="text-2xl font-semibold text-primary mb-2">
                  {trip.title}
                </h2>
                <p className="text-gray-600 text-sm mb-4">
                  Fecha: {trip.date} {trip.date2}
                </p>
                <p className="text-gray-700 mb-4">{trip.shortDescription}</p>
                <p className="bg-red-600 text-white uppercase p-2 rounded-md text-sm">
                  {trip.seats} cupos disponibles
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
