import type { Metadata, Viewport } from "next";
import "../styles/globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ClientGTM from "@/components/layout/ClientGTM";
import { libreFranklinFont } from "@/styles/fonts";
import ToastProvider from "@/components/ui/ToastProvider";

export const metadata: Metadata = {
  title: {
    template: "%s | Integral Surf",
    default: "Integral Surf — Viajes al Mar",
  },
  description:
    "Viajes de surf, yoga y naturaleza en destinos únicos. Coaching profesional en un entorno auténtico.",
  openGraph: {
    siteName: "Integral Surf",
    locale: "es_UY",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

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
      <ClientGTM />
    </html>
  );
}
