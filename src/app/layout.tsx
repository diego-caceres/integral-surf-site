import type { Metadata, Viewport } from "next";
import "../styles/globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ClientGTM from "@/components/layout/ClientGTM";
import { libreFranklinFont } from "@/styles/fonts";
import ToastProvider from "@/components/ui/ToastProvider";
import {
  SITE_URL,
  SITE_NAME,
  DEFAULT_OG_IMAGE,
  CONTACT_EMAIL,
  SOCIAL_PROFILES,
  absoluteUrl,
} from "@/lib/site";

const DEFAULT_DESCRIPTION =
  "Viajes de surf, yoga y naturaleza en destinos únicos. Coaching profesional en un entorno auténtico.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    template: `%s | ${SITE_NAME}`,
    default: "Integral Surf — Viajes al Mar",
  },
  description: DEFAULT_DESCRIPTION,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    siteName: SITE_NAME,
    locale: "es_UY",
    type: "website",
    url: SITE_URL,
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    images: [DEFAULT_OG_IMAGE],
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "SportsActivityLocation",
  name: SITE_NAME,
  description: DEFAULT_DESCRIPTION,
  url: SITE_URL,
  logo: `${SITE_URL}/icon.png`,
  image: absoluteUrl(DEFAULT_OG_IMAGE),
  email: CONTACT_EMAIL,
  sameAs: SOCIAL_PROFILES,
  sport: "Surfing",
  areaServed: "Uruguay",
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
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
