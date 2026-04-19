import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", "Inter", "system-ui", "sans-serif"],
      },
      colors: {
        background: "#f8fafc",
        surface: "#ffffff",
        surfaceSoft: "#f2f4f8",
        foreground: "#0f172a",
        muted: "#64748b",
        border: "rgba(15, 23, 42, 0.08)",
        primary: {
          50: "#f5f3ff",
          100: "#ede9fe",
          300: "#c4b5fd",
          500: "#7c3aed",
          600: "#6d28d9",
          700: "#5b21b6",
        },
        secondary: {
          50: "#ecfdf5",
          100: "#d1fae5",
          300: "#6ee7b7",
          500: "#22c55e",
          600: "#16a34a",
        },
        accent: {
          50: "#eff6ff",
          100: "#dbeafe",
          300: "#93c5fd",
          500: "#3b82f6",
        },
      },
      boxShadow: {
        soft: "0 24px 80px rgba(15, 23, 42, 0.1)",
        card: "0 18px 50px rgba(15, 23, 42, 0.08)",
      },
      backgroundImage: {
        "hero-glow": "radial-gradient(circle at top right, rgba(124, 58, 237, 0.22), transparent 35%), radial-gradient(circle at left center, rgba(56, 189, 248, 0.16), transparent 22%)",
      },
      borderRadius: {
        xl: "1rem",
        '2xl': "1.5rem",
      },
    },
  },
  plugins: [],
};

export default config;
