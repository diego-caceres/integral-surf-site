"use client";
import { GoogleTagManager } from "@next/third-parties/google";
import "../styles/globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { libreFranklinFont } from "@/styles/fonts";
import ToastProvider from "@/lib/react-toastify/ToastProvider";

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
