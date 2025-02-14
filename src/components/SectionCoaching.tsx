import Image from "next/image";
import Button from "@/components/ui/Button";

export default function SectionCoaching() {
  return (
    <div className="relative w-full h-screen overflow-hidden pt-20">
      {/* Content Overlay */}
      <div className="absolute inset-0 flex items-center justify-center p-6 pb-10">
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
          <div className="mt-10 md:mt-0 md:max-w-[450px] flex flex-col items-center md:items-start justify-center gap-4 order-1 md:order-2 ">
            <h2 className="uppercase font-[Eckmannpsych] md:text-left text-3xl md:text-5xl">
              La importancia del coaching
            </h2>
            <p className=" md:text-left text-lg md:text-xl">
              surf coachs profesionales y experientes <br />
              nos acompañan compartiéndonos este <br />
              deporte desde sus raíces. buscamos <br />
              aprender la técnica y teoría del surf en <br />
              profundidad.
            </p>
            <Button className="mt-4 text-lg md:text-xl">Descubre más</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
