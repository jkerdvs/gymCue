/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#0F172A",
        surface: "#1E293B",
        textMain: "#F1F5F9",
        textMuted: "#94A3B8",

        primary: "#3B82F6",    // Electric Blue
        secondary: "#F97316",  // Coral Orange
        accent: "#8B5CF6",     // Vibrant Purple (your favorite)
        success: "#10B981",    // Fresh Green
        warning: "#F59E0B",    // Amber
        destructive: "#EF4444",// Bold Red

        // chart palette
        chartBlue: "#3B82F6",
        chartGreen: "#10B981",
        chartCoral: "#F87171",
        chartPurple: "#A855F7",
        chartYellow: "#EAB308",
        chartMagenta: "#EC4899",
        chartCyan: "#06B6D4",
        chartLime: "#84CC16",
      },
    },
  },
  plugins: [],
};




