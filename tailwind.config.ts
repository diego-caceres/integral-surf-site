import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0E1A1B", // Verde oscuro, estilo vintage
        secondary: "#EAD9C9", // Beige suave
        accent: "#E4572E", // Naranja terroso
        background: "#FFFFFF", // Fondo claro "#F9F6F1",
        textPrimary: "#0E1A1B", // Texto principal
        redColor: "#FF3131", // Rojo
      },
      fontFamily: {
        serif: ['"Playfair Display"', "serif"],
        poppins: ["var(--font-poppins)"],
        librefranklin: ["var(--font-libre-franklin)"],
        bebasNeue: ["var(--font-bebas-neue)"],
      },
      spacing: {
        18: "4.5rem",
      },
    },
  },
  plugins: [],
} satisfies Config;
