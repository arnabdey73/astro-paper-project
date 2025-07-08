/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  darkMode: "class",
  theme: {
    extend: {
      textColor: {
        skin: {
          base: "var(--color-text-base)",
          accent: "var(--color-accent)",
          inverted: "var(--color-text-inverted)",
        },
        foreground: "var(--color-text-base)",
        accent: "var(--color-accent)",
        muted: "var(--color-text-base)",
      },
      backgroundColor: {
        skin: {
          fill: "var(--color-bg)",
          accent: "var(--color-accent)",
          inverted: "var(--color-text-base)",
          card: "var(--color-card)",
          "card-muted": "var(--color-card-muted)",
        },
        background: "var(--color-bg)",
        muted: "var(--color-card)",
      },
      outlineColor: {
        skin: {
          fill: "var(--color-accent)",
        },
      },
      borderColor: {
        skin: {
          line: "var(--color-border)",
          fill: "var(--color-text-base)",
          accent: "var(--color-accent)",
        },
        border: "var(--color-border)",
      },
      fill: {
        skin: {
          base: "var(--color-text-base)",
          accent: "var(--color-accent)",
        },
        transparent: "transparent",
      },
      strokeColor: {
        skin: {
          base: "var(--color-text-base)",
          accent: "var(--color-accent)",
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
