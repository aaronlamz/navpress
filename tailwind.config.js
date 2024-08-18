const path = require("path");
module.exports = {
  content: [
    path.resolve(__dirname, "./src/**/*.{vue,js,ts,jsx,tsx}"),
    path.resolve(__dirname, "./index.html"),
  ],
  darkMode: "class",
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
