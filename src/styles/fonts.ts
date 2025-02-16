import { Bebas_Neue } from "next/font/google";
import { Libre_Franklin } from "next/font/google";

export const libreFranklinFont = Libre_Franklin({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-libre-franklin",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const bebasNeuelFont = Bebas_Neue({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-bebas-neue",
  weight: ["400"],
});
