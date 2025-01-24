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
        background: "#F9F6F1", // Fondo claro
        textPrimary: "#0E1A1B", // Texto principal
      },
      fontFamily: {
        sans: ['"Poppins"', "sans-serif"],
        serif: ['"Playfair Display"', "serif"],
      },
      spacing: {
        18: "4.5rem",
      },
    },
  },
  plugins: [],
} satisfies Config;
