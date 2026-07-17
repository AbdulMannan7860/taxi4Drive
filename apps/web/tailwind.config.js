/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#101522",
        night: "#071426",
        navy: "#0b1d33",
        gold: "#ffc107",
        amberline: "#f0ad00",
        mist: "#f1f3f6",
        canvas: "#f7f7f4",
        body: "#121826",
        muted: "#4b5563",
        subtle: "#667085",
        slate: "#60666d",
        line: "#d9ded6",
        softline: "#eef0ec",
        panel: "#f1f3ef",
        field: "#f5f6f2",
        steel: "#b8c1cc"
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
