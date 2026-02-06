import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        garden: {
          bg: "#2400B0",
          "bg-dark": "#1A0080",
          cream: "#FFFDF5",
          "cream-dark": "#F5F0E0",
          accent: "#3300FF",
          "accent-light": "#5533FF",
          ink: "#1A1A4E",
          dot: "#6B6BAA",
          "dot-empty": "#4A4A8A",
          "dot-future": "#3A3A6A",
        },
      },
      fontFamily: {
        display: ['"Anonymous Pro"', "monospace"],
        body: ['"Anonymous Pro"', "monospace"],
      },
      gridTemplateColumns: {
        "garden-sm": "repeat(14, minmax(0, 1fr))",
        "garden-md": "repeat(17, minmax(0, 1fr))",
        "garden-lg": "repeat(19, minmax(0, 1fr))",
      },
      animation: {
        "grow-in": "growIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
        "fade-in": "fadeIn 0.3s ease-out forwards",
        "pulse-dot": "pulseDot 2s ease-in-out infinite",
      },
      keyframes: {
        growIn: {
          "0%": { transform: "scale(0)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        pulseDot: {
          "0%, 100%": { transform: "scale(1)", opacity: "0.7" },
          "50%": { transform: "scale(1.3)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
