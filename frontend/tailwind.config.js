/* eslint-disable no-undef */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      borderWidth: {
        b: "2px",
      },
      colors: {
        primary: {
          DEFAULT: "#842E66",
        },
        secondary: {
          light: "#3B4559",
          DEFAULT: "#505050",
        },
        grey: {
          light: "#E9E9E9",
          DEFAULT: "#707070",
        },
        fontColor: {
          light: "1e1e1e",
          DEFAULT: "#1e1e1e",
        },
      },
      fontFamily: {
        albertSans: ["Albert Sans", "sans-serif"],
      },
    },
  },
  corePlugins: {
    preflight: false,
  },
  plugins: [],
};
