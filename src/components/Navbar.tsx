import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between">
        <Link href="/" className="text-lg font-bold">Integral Surf</Link>
        <div className="space-x-4">
          <Link href="/viajes">Viajes</Link>
          <Link href="/productos">Productos</Link>
          <Link href="/about">Quiénes Somos</Link>
          <Link href="/blog">Blog</Link>
        </div>
      </div>
    </nav>
  );
}