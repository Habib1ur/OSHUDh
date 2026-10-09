/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#ecfdf5",
          100: "#d1fae5",
          500: "#0b7a5b",
          600: "#0b6e52",
          700: "#075c46",
        },
      },
      boxShadow: {
        soft: "0 20px 45px -22px rgba(15, 23, 42, 0.24)",
      },
      backgroundImage: {
        grid: "radial-gradient(circle at center, rgba(11,122,91,0.08) 0, rgba(11,122,91,0.08) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};
