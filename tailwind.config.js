/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./lib/**/*.{js,jsx}"
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        asphalt: "#0a0a0a",
        graphite: "#121212",
        steel: "#d6d8dc",
        volt: "#d7ff38",
        ember: "#ff6a3d"
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Arial", "sans-serif"]
      },
      boxShadow: {
        premium: "0 24px 80px rgba(0, 0, 0, 0.35)",
        glow: "0 0 60px rgba(215, 255, 56, 0.18)"
      },
      animation: {
        "fade-up": "fadeUp 0.65s ease both",
        "soft-pulse": "softPulse 4s ease-in-out infinite"
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(18px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        softPulse: {
          "0%, 100%": { opacity: "0.68" },
          "50%": { opacity: "1" }
        }
      }
    }
  },
  plugins: []
};
