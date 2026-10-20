import type { Config } from "tailwindcss";

/**
 * Design tokens. Colours are defined as CSS variables in app/globals.css so
 * they can be re-themed in one place; Tailwind only maps names to them.
 */
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./content/**/*.{ts,tsx}"],
  theme: {
    container: { center: true, padding: { DEFAULT: "1.25rem", md: "2rem" }, screens: { "2xl": "1200px" } },
    extend: {
      colors: {
        navy: { DEFAULT: "rgb(var(--navy) / <alpha-value>)", 800: "rgb(var(--navy-800) / <alpha-value>)", 700: "rgb(var(--navy-700) / <alpha-value>)" },
        slate: { DEFAULT: "rgb(var(--slate) / <alpha-value>)", soft: "rgb(var(--slate-soft) / <alpha-value>)" },
        paper: "rgb(var(--paper) / <alpha-value>)",
        canvas: "rgb(var(--canvas) / <alpha-value>)",
        ink: { DEFAULT: "rgb(var(--ink) / <alpha-value>)", muted: "rgb(var(--ink-muted) / <alpha-value>)" },
        bronze: { DEFAULT: "rgb(var(--bronze) / <alpha-value>)", soft: "rgb(var(--bronze-soft) / <alpha-value>)" },
        line: "rgb(var(--line) / <alpha-value>)",
        danger: "rgb(var(--danger) / <alpha-value>)",
        success: "rgb(var(--success) / <alpha-value>)",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      borderRadius: { sm: "2px", DEFAULT: "4px", md: "6px" },
      boxShadow: {
        card: "0 1px 2px rgb(16 27 46 / 0.04), 0 8px 24px -12px rgb(16 27 46 / 0.12)",
        lift: "0 2px 4px rgb(16 27 46 / 0.05), 0 18px 40px -18px rgb(16 27 46 / 0.25)",
      },
      maxWidth: { prose: "68ch" },
      letterSpacing: { eyebrow: "0.14em" },
    },
  },
  plugins: [],
};

export default config;
