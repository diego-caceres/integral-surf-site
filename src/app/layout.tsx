import { GoogleTagManager } from "@next/third-parties/google";
import { DefaultSeo } from 'next-seo';
import seoConfig from '../../next-seo.config';
import "../styles/globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <DefaultSeo {...seoConfig} />
      <body className="bg-gray-100 text-gray-900">        
        <Navbar />
        <main className="container mx-auto p-4">{children}</main>
        <Footer />
      </body>
      <GoogleTagManager gtmId="GTM-P874N777" /> 
    </html>
  );
}