"use client";
// import { useEffect, useState } from "react"; // No longer needed

import SectionCalendar from "@/components/SectionCalendar";

export default function Viajes() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // const [viajes, setViajes] = useState<any[]>([]); // No longer needed

  // useEffect(() => { // No longer needed
  //   const fetchViajes = async () => {
  //     const res = await fetch("/api/trips");
  //     const data = await res.json();
  //     setViajes(data);
  //   };
  //   fetchViajes();
  // }, []);

  // console.log("Viajes en el servidor", viajes); // No longer needed

  return (
    <>
      <div className="mx-auto md:px-12 lg:px-20 text-center">
        {/* {viajes.map((viaje) => (
          <div
            key={viaje.id}
            className="bg-red-500 p-3 mb-4 uppercase text-white"
          >
            <h2>{viaje.title}</h2>
            <p>{viaje.description}</p>
          </div>
        ))} */}
        <SectionCalendar />
      </div>
    </>
  );
}
