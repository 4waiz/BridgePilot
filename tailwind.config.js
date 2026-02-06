/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"]
      },
      colors: {
        pilot: {
          night: "#0b1020",
          deep: "#141a31",
          ocean: "#0bb5ff",
          neon: "#23f0c7",
          sun: "#ffb703",
          coral: "#ff6b6b",
          magenta: "#ff3d8f",
          lavender: "#9d7bff",
          mint: "#c8f9d8"
        }
      },
      boxShadow: {
        glow: "0 0 25px rgba(35, 240, 199, 0.35)",
        card: "0 20px 60px rgba(4, 10, 40, 0.35)"
      },
      backgroundImage: {
        "pilot-gradient": "radial-gradient(circle at top, rgba(35, 240, 199, 0.35), transparent 55%), linear-gradient(135deg, #0b1020 0%, #14213d 45%, #2f2d69 100%)",
        "card-gradient": "linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02))"
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" }
        },
        pulseRing: {
          "0%": { transform: "scale(0.9)", opacity: "0.7" },
          "100%": { transform: "scale(1.4)", opacity: "0" }
        }
      },
      animation: {
        float: "float 4s ease-in-out infinite",
        pulseRing: "pulseRing 1.8s ease-out infinite"
      }
    }
  },
  plugins: []
};
