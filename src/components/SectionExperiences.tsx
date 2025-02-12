import Image from "next/image";

export default function SectionExperiences() {
  return (
    <div className="relative w-full h-[700px] md:h-screen overflow-hidden ">
      {/* Background Image */}
      <Image
        src="/images/home/experiences-background.jpg"
        alt="Background"
        fill
        style={{ objectFit: "cover" }}
        priority
      />

      {/* Content Overlay */}
      <div className="absolute inset-0 flex items-start justify-center p-6 pt-20">
        <div className="flex flex-col md:grid md:grid-cols-[30%_70%] md:pl-[100px] w-full h-full gap-6 md:items-start">
          {/* Left Column (Shown below on mobile) */}
          <div className="flex flex-col md:gap-8 justify-center  ">
            <h2 className="uppercase font-[Eckmannpsych] md:text-left">
              Experiencias <br />
              Integrales
            </h2>
            <p className="md:text-left text-xl ">
              En este ciclo de entrevistas a <br />
              viajeros, Federico García nos <br />
              cuenta sobre su experiencia <br />
              aprendiendo a surfear con Integral <br />
              en Perú
            </p>
          </div>

          {/* Right Column (Shown first on mobile) */}
          <div className="mt-10 md:mt-0 flex flex-col items-center md:items-start self-center justify-center ">
            <div className="relative w-screen min-h-[270px] md:w-[800px] md:h-[450px] overflow-hidden rounded-xl">
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src={`https://www.youtube.com/embed/EDKX-i1_yMI?si=CLg0ghvuidtUVpG9&autoplay=1&mute=1`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
