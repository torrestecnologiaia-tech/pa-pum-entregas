/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#6c5a00",
        "primary-fixed": "#ffd709",
        surface: "#f6f6f6",
        "surface-container": "#e8e8e8",
        "surface-container-low": "#f0f0f0",
        "surface-container-lowest": "#ffffff",
        "on-surface": "#2f2f2f",
        outline: "#adadad",
        tertiary: "#1d6d45", // Sophisticated green for status
        "tertiary-container": "#d0f1e1",
      },
      fontFamily: {
        jakarta: ["PlusJakartaSans_400Regular", "PlusJakartaSans_700Bold"],
        inter: ["Inter_400Regular", "Inter_700Bold"],
      },
    },
  },
  plugins: [],
};
