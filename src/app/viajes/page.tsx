"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

import SectionCalendar from "@/components/SectionCalendar";

export default function Viajes() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [viajes, setViajes] = useState<any[]>([]);

  useEffect(() => {
    const fetchViajes = async () => {
      const { data, error } = await supabase
        .from("trips")
        .select("*, trip_contents(*)")
        .order("order", { ascending: true });

      if (error) {
        console.error("Error obteniendo los viajes:", error);
      } else {
        setViajes(data || []);
      }
    };

    fetchViajes();
  }, []);

  return (
    <>
      <div className="mx-auto md:px-12 lg:px-20 text-center">
        {viajes.map((viaje) => (
          <div
            key={viaje.id}
            className="bg-red-500 p-3 mb-4 uppercase text-white"
          >
            <h2>{viaje.title}</h2>
            <p>{viaje.description}</p>
          </div>
        ))}
        <SectionCalendar />
      </div>
    </>
  );
}
