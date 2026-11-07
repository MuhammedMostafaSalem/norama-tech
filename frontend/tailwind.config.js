/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        "primary-hover": "var(--color-primary-hover)",

        secondary: "var(--color-secondary)",

        accent: "var(--color-accent)",

        success: "var(--color-success)",

        error: "var(--color-error)",

        danger: "var(--color-danger)",

        warning: "var(--color-warning)",

        background: "var(--color-background)",

        "background-alt": "var(--color-background-alt)",

        surface: "var(--color-surface)",

        card: "var(--color-card)",

        "card-hover": "var(--color-card-hover)",

        border: "var(--color-border)",

        text: {
          primary: "var(--color-text-primary)",
          secondary: "var(--color-text-secondary)",
          muted: "var(--color-text-muted)"
        },

        glow: {
          blue: "var(--color-glow-blue)",
          purple: "var(--color-glow-purple)",
          cyan: "var(--color-glow-cyan)"
        }
      },
      container: {
        center: true,
        padding: "1rem",

        screens: {
          xl: "1280px",
        },
      },
      borderRadius: {
        // button: "12px",
        // input: "12px",
        // card: "20px",
        // image: "24px",
        button: "14px",
        input: "14px",
        card: "22px",
        image: "24px",
        fullCard: "32px",
      },
      boxShadow: {
        // card: "0 10px 30px rgba(15,23,42,.08)",

        card: "0 12px 35px rgba(0,0,0,.35)",

        purple: "0 0 25px rgba(122,92,255,.45)",

        blue: "0 0 25px rgba(51,185,255,.35)",

        neon: "0 0 45px rgba(108,92,255,.35)", 
      },
      transitionDuration: {
        300: "300ms",
      },
    },
  },
  plugins: [],
}

