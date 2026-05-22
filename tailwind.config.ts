// tailwind.config.js
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: "#f1f5f9", // bg-surface
          muted: "#f8fafc", // bg-surface-muted
          border: "#e2e8f0", // border-surface-border
        },
        navy: {
          DEFAULT: "#1e3a5f", // bg-navy
          light: "#2d5a8e", // bg-navy-light
          dark: "#0f1f35", // text-navy-dark
        },
        accent: "#3b82f6",
        danger: {
          DEFAULT: "#dc2626",
          bg: "#fee2e2",
          text: "#991b1b",
        },
        success: {
          bg: "#dcfce7",
          text: "#166534",
        },
        warn: {
          bg: "#fef9c3",
          text: "#854d0e",
        },
      },
      boxShadow: {
        card: "0 1px 3px 0 rgb(0 0 0 / .07), 0 1px 2px -1px rgb(0 0 0 / .07)",
        navy: "0 4px 14px 0 rgb(30 58 95 / .35)",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};
