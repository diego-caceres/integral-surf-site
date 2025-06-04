import Image from "next/image";

export default function Footer() {
  return (
    <footer className="py-16 bg-primary text-white mt-auto">
      <div className="flex flex-row justify-between items-center mx-auto px-10">
        <h2 className="uppercase font-[Eckmannpsych] text-white">
          Integral Surf
        </h2>
        {/* © {new Date().getFullYear()} Dado */}
        <Image
          src="/images/icons/white-logo.png"
          alt="Logo Integral Surf"
          width={65}
          height={65}
        />
      </div>
      <div className="flex flex-col md:flex-row justify-between items-start mx-auto px-10 mt-6 space-y-6 md:space-y-0 md:space-x-6">
        {/* Column 1: Siguenos en */}
        <div className="flex flex-col space-y-2 ">
          <h3 className="font-semibold text-lg text-white">Siguenos en</h3>
          <a
            href="https://www.instagram.com/integralsurf/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            Instagram
          </a>
          <a
            href="https://www.youtube.com/@integralsurf"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            YouTube
          </a>
        </div>

        {/* Column 2: Nuestro contacto */}
        <div className="flex flex-col space-y-2">
          <h3 className="font-semibold text-lg text-white">Nuestro contacto</h3>
          <a href="mailto:integralsurfuy@gmail.com" className="hover:underline">
            integralsurfuy@gmail.com
          </a>
          <a href="tel:+59898449641" className="hover:underline">
            +598 98449641
          </a>
        </div>
      </div>
    </footer>
  );
}
