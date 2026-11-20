import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: "#FDFBF7",
          100: "#FAF7F2", // Asosiy qaymoq fon
          200: "#F4EFE6", // Kartalar va maydonlar
          300: "#EAE3D2", // Nozik hoshiyalar
          400: "#D8CEBC", // Bo'rttirilgan hoshiya
          500: "#B8A990",
          600: "#8C7A60",
          700: "#5C4E3C",
          800: "#382F24",
          900: "#1E1A14", // To'q espresso matn
        },
        caramel: {
          DEFAULT: "#9A6B3A",
          hover: "#845A2E",
          light: "#F7EFE6",
        },
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Display",
          "Inter",
          "sans-serif",
        ],
      },
      boxShadow: {
        cream: "0 6px 20px -3px rgba(60, 45, 30, 0.06)",
        "cream-lg": "0 12px 30px -4px rgba(60, 45, 30, 0.1)",
      },
    },
  },
  plugins: [],
};

export default config;
