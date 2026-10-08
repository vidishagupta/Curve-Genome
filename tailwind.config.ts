import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#08090d",
        surface: {
          50: "#181a24",
          100: "#12141c",
          200: "#0d0f16",
          300: "#090a0f",
          border: "#232738",
          borderLight: "#333950",
        },
        brand: {
          cyan: "#00F5D4",
          teal: "#00BBF9",
          purple: "#9B5DE5",
          pink: "#F15BB5",
          yellow: "#FEE440",
          orange: "#FF8800",
          green: "#10B981",
          rose: "#F43F5E",
        },
      },
      fontFamily: {
        mono: [
          "JetBrains Mono",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "monospace",
        ],
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "sans-serif",
        ],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "grid-pattern":
          "radial-gradient(circle, rgba(255, 255, 255, 0.05) 1px, transparent 1px)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        glow: {
          "0%": { boxShadow: "0 0 10px rgba(0, 245, 212, 0.2)" },
          "100%": { boxShadow: "0 0 25px rgba(0, 245, 212, 0.6)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
