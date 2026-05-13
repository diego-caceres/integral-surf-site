import Image from "next/image";

export default function Footer() {
  return (
    <footer aria-label="Pie de página" className="py-16 bg-primary text-white mt-auto">
      <div className="max-w-7xl mx-auto flex flex-row flex-wrap gap-4 justify-between items-center px-10">
        <h2 className="uppercase font-[Eckmannpsych] text-white">
          Integral Surf
        </h2>
        <Image
          src="/images/icons/white-logo.png"
          alt="Logo Integral Surf"
          width={65}
          height={65}
        />
      </div>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start px-10 mt-6 space-y-6 md:space-y-0 md:space-x-6">
        {/* Column 1: Comunidad */}
        <div className="flex flex-col space-y-2">
          <h3 className="font-bold text-xl text-white font-librefranklin">
            Comunidad
          </h3>
          <a
            href="https://www.instagram.com/integralsurf/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            Instagram{" "}
            <span aria-hidden="true">↗</span>
            <span className="sr-only">(abre en nueva pestaña)</span>
          </a>
          <a
            href="https://www.youtube.com/@integralsurf"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            YouTube{" "}
            <span aria-hidden="true">↗</span>
            <span className="sr-only">(abre en nueva pestaña)</span>
          </a>
        </div>

        {/* Column 2: Nuestro contacto */}
        <div className="flex flex-col space-y-2">
          <h3 className="font-bold text-xl text-white font-librefranklin">
            Nuestro contacto
          </h3>
          <a href="mailto:integralsurfuy@gmail.com" className="hover:underline">
            integralsurfuy@gmail.com
          </a>
          <a href="tel:+59898449641" className="hover:underline">
            +598 98449641
          </a>
        </div>
      </div>
      <p className="text-center text-sm text-white/60 mt-10 px-10">
        © 2026 Integral Surf
      </p>
    </footer>
  );
}
