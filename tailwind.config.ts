import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: "#FBF3EA",
          warm: "#FBF3EA",
          cream: "#FFF9F3",
          blush: "#F3E1DC",
          border: "#E8D7CC",
          borderWarm: "#EBD7CC",
        },
        rose: {
          dusty: "#D8A5A0",
          muted: "#B87873",
          deep: "#A25F5A",
        },
        brown: {
          deep: "#59413B",
          dark: "#302622",
          muted: "#88756D",
        },
        sage: {
          DEFAULT: "#A7B29E",
          light: "#CAD1C4",
          dark: "#849079",
        },
        night: {
          bg: "#231C1A",
          surface: "#2D2421",
          card: "#382D29",
          border: "#4A3D38",
          text: "#F7EEE9",
          muted: "#B5A49D",
        },
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Playfair Display", "Cormorant Garamond", "Georgia", "serif"],
        sans: ["var(--font-dm-sans)", "DM Sans", "system-ui", "sans-serif"],
        handwriting: ["var(--font-caveat)", "Caveat", "cursive"],
      },
      boxShadow: {
        scrapbook: "0 4px 20px -2px rgba(89, 65, 59, 0.08), 0 2px 6px -1px rgba(89, 65, 59, 0.04)",
        polaroid: "0 10px 25px -5px rgba(89, 65, 59, 0.15), 0 4px 10px -2px rgba(89, 65, 59, 0.08)",
        tape: "0 1px 3px rgba(89, 65, 59, 0.12)",
      },
      borderRadius: {
        scrapbook: "16px",
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
  ],
};

export default config;
