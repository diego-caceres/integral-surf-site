"use client";
import { GoogleTagManager } from "@next/third-parties/google";
import "../styles/globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { libreFranklinFont } from "@/styles/fonts";
import ToastProvider from "@/components/ui/ToastProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body
        className={`${libreFranklinFont.className} flex flex-col min-h-screen bg-background text-textPrimary font-librefranklin`}
      >
        <Navbar />
        <ToastProvider>
          <main>{children}</main>
        </ToastProvider>
        <Footer />
      </body>
      <GoogleTagManager gtmId="GTM-P874N777" />
    </html>
  );
}
