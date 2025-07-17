export default {
  darkMode: "class",
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],

  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", ...fontFamily.sans],
      },
    },
  },

  variants: {
    extend: {
      cursor: ["disabled"],
    },
  },

  plugins: [require("tailwindcss-animate")],
};
