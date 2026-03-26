import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#FEF2F2",
          100: "#FEE2E2",
          200: "#FECACA",
          300: "#F09092",
          400: "#E25A5E",
          500: "#D93338",
          600: "#C1292E",
          700: "#A81F24",
          800: "#8B1A1E",
          900: "#6B1215",
          950: "#450C0E",
        },
        bauhaus: {
          red: "#C1292E",
          black: "#1A1A1A",
          yellow: "#F5C518",
          salmon: "#BC8279",
        },
      },
      fontFamily: {
        oswald: ['var(--font-oswald)', '"Oswald"', 'sans-serif'],
        grotesk: ['var(--font-grotesk)', '"Space Grotesk"', 'sans-serif'],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
