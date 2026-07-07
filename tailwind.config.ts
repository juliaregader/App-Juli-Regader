import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          950: "var(--color-brand-950)",
          900: "var(--color-brand-900)",
          800: "var(--color-brand-800)",
          700: "var(--color-brand-700)",
          500: "var(--color-brand-500)",
          300: "var(--color-brand-300)",
          100: "var(--color-brand-100)",
        },
        surface: {
          DEFAULT: "var(--color-surface)",
          subtle: "var(--color-surface-subtle)",
          raised: "var(--color-surface-raised)",
        },
        border: {
          DEFAULT: "var(--color-border)",
        },
        content: {
          DEFAULT: "var(--color-content)",
          muted: "var(--color-content-muted)",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Inter", "system-ui", "sans-serif"],
      },
      fontFeatureSettings: {
        tabular: '"tnum" 1',
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1.25rem",
      },
      boxShadow: {
        soft: "0 1px 2px 0 rgb(14 42 71 / 0.04), 0 4px 16px -4px rgb(14 42 71 / 0.08)",
      },
    },
  },
  plugins: [],
} satisfies Config;
