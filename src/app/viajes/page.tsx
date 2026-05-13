import type { Metadata } from "next";
import SectionCalendar from "@/components/home/SectionCalendar";

export const metadata: Metadata = {
  title: "Viajes al Mar",
  description: "Descubrí nuestros destinos de surf, yoga y naturaleza para 2026. Viajes en grupo con coaching profesional.",
};

export default function Viajes() {
  return (
    <div className="mx-auto md:px-12 lg:px-20 text-center">
      <SectionCalendar />
    </div>
  );
}
