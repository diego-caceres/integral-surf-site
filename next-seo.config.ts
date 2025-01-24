import { DefaultSeoProps } from "next-seo";

const seoConfig: DefaultSeoProps = {
  title: "Integral Surf - Viajes al mar",
  description: "Descubre los mejores viajes de surf y productos exclusivos.",
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "https://integralsurf.com/integralsurf",
    site_name: "Integral Surf",
    images: [
      {
        url: "https://my-surf-site.vercel.app/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Surf Trips Banner",
      },
    ],
  },
  twitter: {
    handle: "@integralsurf",
    site: "@integralsurf",
    cardType: "summary_large_image",
  },
};

export default seoConfig;
