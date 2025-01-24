"use client";
import { GoogleTagManager } from "@next/third-parties/google";
import "../styles/globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="flex flex-col min-h-screen bg-background text-textPrimary font-sans">
        <Navbar />
        <main className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
          {children}
        </main>
        <Footer />
      </body>
      <GoogleTagManager gtmId="GTM-P874N777" />
    </html>
  );
}
