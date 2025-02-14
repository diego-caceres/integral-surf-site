import Image from "next/image";
import Button from "@/components/ui/Button";

export default function SectionCoaching() {
  return (
    <div className="relative w-full min-h-screen overflow-hidden pt-20">
      {/* Content Overlay */}
      <div className="absolute inset-0 flex items-start justify-center p-6 pb-10">
        <div className="flex flex-col md:grid md:grid-cols-2 md:pl-[100px] w-full gap-6 ">
          {/* Left Column (Shown below on mobile) */}
          <div className="flex flex-col gap-4 md:gap-8 justify-center order-2 md:order-1 ">
            <Image
              src="/images/home/coaching.jpg"
              alt="Left Image 1"
              width={488}
              height={594}
              style={{ objectFit: "cover" }}
              className="max-w-full"
            />
          </div>

          {/* Right Column (Shown first on mobile) */}
          <div className="md:max-w-[450px] flex flex-col items-center md:items-start justify-center gap-4 order-1 md:order-2 py-10 md:py-20 text-left">
            <h2 className="uppercase font-[Eckmannpsych]  text-3xl md:text-5xl">
              La importancia del coaching
            </h2>
            <p className="text-lg md:text-xl">
              surf coachs profesionales y experientes nos acompañan
              compartiéndonos este deporte desde sus raíces. buscamos aprender
              la técnica y teoría del surf en profundidad.
            </p>
            <Button className="mt-4 text-lg md:text-xl">Descubre más</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
