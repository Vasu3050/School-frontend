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
        }
      }
    }
  },
  plugins: [],
}
