/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 🎨 Brand
        primary: { light: "#2563eb", dark: "#3b82f6" },   // Navbar, buttons, links
        secondary: { light: "#facc15", dark: "#fcd34d" }, // Highlights, CTAs
        accent: { light: "#10b981", dark: "#34d399" },    // Success states, active

        // 🎨 Functional
        info: { light: "#0ea5e9", dark: "#38bdf8" },      // Info messages, alerts
        warning: { light: "#f97316", dark: "#fb923c" },   // Warnings, alerts
        danger: { light: "#ef4444", dark: "#f87171" },    // Errors, delete
        neutral: { light: "#9ca3af", dark: "#6b7280" },   // Disabled, borders

        // 🎨 Backgrounds & Surfaces
        background: { light: "#f9fafb", dark: "#111827" }, // Page background
        surface: { light: "#ffffff", dark: "#1f2937" },    // Cards, modals
        surfaceAlt: { light: "#f3f4f6", dark: "#374151" }, // Alternate sections

        // 🎨 Text
        text: {
          primaryLight: "#1f2937",    // Headings, main text
          secondaryLight: "#4b5563",  // Paragraphs, details
          mutedLight: "#6b7280",      // Captions, notes
          primaryDark: "#f9fafb",     // Headings, main text
          secondaryDark: "#d1d5db",   // Paragraphs, details
          mutedDark: "#9ca3af",       // Captions, notes
        },

        // 🌸 Extra Palette with Light & Dark Shades

        pink: {
          light: "#ec4899",  // Hot Pink 500
          dark: "#be185d"    // Deep Pink 700
        },

        blue: {
          light: "#3b82f6",  // Blue 500
          dark: "#1e40af"    // Navy Blue 800
        },

        red: {
          light: "#f87171",  // Red 400
          dark: "#991b1b"    // Dark Red 800
        },

        green: {
          light: "#22c55e",  // Emerald Green 500
          dark: "#166534"    // Dark Green 800
        },

        white: {
          light: "#ffffff",  // Pure White
          dark: "#f9fafb"    // Off White / Light Gray
        },

        black: {
          light: "#111827",  // Very Dark Gray (almost black)
          dark: "#000000"    // True Black
        },
      },
    },
  },
  // Add this to your theme.extend section
animation: {
  shimmer: 'shimmer 2s linear infinite',
  pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
},
keyframes: {
  shimmer: {
    '0%': { transform: 'translateX(-100%)' },
    '100%': { transform: 'translateX(100%)' },
  },
},
  plugins: [],
}
