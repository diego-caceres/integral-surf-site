"use client";
import Button from "@/components/ui/Button";
import Image from "next/image";

const SectionOurPurpose: React.FC = () => {
  return (
    <section
      className="w-full md:h-[90vh] md:px-20 md:py-20 grid grid-cols-1 md:grid-cols-2 md:gap-10"
      style={{ boxShadow: "0 1px 2px -2px #7f807e" }}
    >
      <div className="max-w-[660px] px-10 md:px-20 py-10 md:py-20 text-left">
        <h2 className="font-[Eckmannpsych]">Nuestro proposito</h2>
        <p className="mt-6 text-xl tracking-[0.2rem]">
          es ayudarte a lograr tus objetivos de manera consciente, ya sea
          conectar por primera vez con el surf o a mejorar tu performance sobre
          las olas.
        </p>
        <p className="mt-10 text-xl tracking-[0.2rem]">
          “Elegimos la naturaleza para interpretar lo más profundo de nuestro
          ser. El surfing, el yoga y el arte son las experiencias que nos
          permiten reencontrarnos”.
        </p>
        <Button className="mt-8">Sobre Nosotros</Button>
      </div>
      <div className="flex flex-row justify-center items-start md:items-center">
        <Image
          src="/images/home/image1.png"
          alt="Nuestro propósito"
          className="max-h-[500px]"
          width={402}
          height={500}
        />
      </div>
    </section>
  );
};

export default SectionOurPurpose;
