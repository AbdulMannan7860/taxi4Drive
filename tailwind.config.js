/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#071426",
        night: "#06111f",
        navy: "#0b1d33",
        gold: "#ffc107",
        amberline: "#f0ad00",
        mist: "#f4f6f9"
      },
      fontFamily: {
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"]
      },
      boxShadow: {
        premium: "0 24px 80px rgba(4, 12, 24, 0.34)",
        soft: "0 18px 48px rgba(15, 23, 42, 0.14)"
      }
    }
  },
  plugins: []
};
