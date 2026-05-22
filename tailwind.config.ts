import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#1e3a5f",
          light: "#2d5a8e",
          dark: "#0f1f35",
          faint: "#e8eef5",
        },
        accent: { DEFAULT: "#4DA6FF", light: "#93c5fd", dark: "#1d6db5" },
        success: { DEFAULT: "#16a34a", bg: "#dcfce7", text: "#166534" },
        danger: { DEFAULT: "#dc2626", bg: "#fee2e2", text: "#991b1b" },
        warn: { DEFAULT: "#d97706", bg: "#fef3c7", text: "#92400e" },
        surface: {
          DEFAULT: "#f0f4f8",
          card: "#ffffff",
          border: "#e2e8f0",
          muted: "#f8fafc",
        },
      },
      fontFamily: {
        sans: ['"IBM Plex Sans"', "system-ui", "sans-serif"],
        mono: ['"IBM Plex Mono"', "monospace"],
      },
      boxShadow: {
        card: "0 1px 3px 0 rgb(0 0 0 / .06), 0 1px 2px -1px rgb(0 0 0 / .04)",
        "card-md":
          "0 4px 12px 0 rgb(0 0 0 / .08), 0 2px 4px -2px rgb(0 0 0 / .04)",
        navy: "0 4px 14px 0 rgb(30 58 95 / .25)",
      },
    },
  },
  plugins: [],
} satisfies Config;
