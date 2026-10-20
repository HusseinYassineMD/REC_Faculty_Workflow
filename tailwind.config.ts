import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        cpbh: {
          navy: "#1a2744",
          deep: "#243556",
          gold: "#ffc72c",
          "gold-soft": "#ffe08a",
          mist: "#e8ecf1",
          cardinal: "#990000",
          teal: "#2a7a7a",
        },
      },
      fontFamily: {
        sans: ["var(--font-source)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
      },
      boxShadow: {
        card: "0 4px 24px rgba(26, 39, 68, 0.07)",
        elevated:
          "0 12px 40px -12px rgba(26, 39, 68, 0.18), 0 4px 16px -4px rgba(26, 39, 68, 0.08)",
        glow: "0 0 0 1px rgba(255, 199, 44, 0.25), 0 8px 32px rgba(255, 199, 44, 0.12)",
        inset: "inset 0 1px 0 rgba(255,255,255,0.85)",
      },
      backgroundImage: {
        mesh:
          "radial-gradient(at 40% 20%, rgba(255,199,44,0.14) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(42,122,122,0.12) 0px, transparent 45%), radial-gradient(at 0% 50%, rgba(36,53,86,0.08) 0px, transparent 50%)",
        "hero-bar": "linear-gradient(135deg, #1a2744 0%, #243556 55%, #2d3a6e 100%)",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.25rem",
      },
    },
  },
  plugins: [],
};

export default config;
