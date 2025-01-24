"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center py-6 px-6">
      <Link href="/" className="text-2xl font-serif tracking-wide">
        <span className="text-primary">Integral Surf</span>
      </Link>
      <ul className="flex gap-6 text-lg">
        <li>
          <Link href="/viajes" className="hover:text-accent">
            Viajes
          </Link>
        </li>
        <li>
          <Link href="/productos" className="hover:text-accent">
            Tienda
          </Link>
        </li>
        <li>
          <Link href="/blog" className="hover:text-accent">
            Blog
          </Link>
        </li>
        <li>
          <Link href="/about" className="hover:text-accent">
            Nosotros
          </Link>
        </li>
      </ul>
    </nav>
  );
}
