import Image from "next/image";

export default function Footer() {
  return (
    <footer className="py-4 bg-primary text-white mt-auto">
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
    </footer>
  );
}
