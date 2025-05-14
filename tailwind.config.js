import { heroui } from "@heroui/react";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Modern professional color palette
        primary: {
          DEFAULT: "#0EA5E9",  // Vibrant blue
          50: "#F0F9FF",
          100: "#E0F2FE",
          200: "#BAE6FD",
          300: "#7DD3FC",
          400: "#38BDF8",
          500: "#0EA5E9",
          600: "#0284C7",
          700: "#0369A1",
          800: "#075985",
          900: "#0C4A6E",
        },
        secondary: {
          DEFAULT: "#6366F1",  // Indigo
          50: "#EEF2FF",
          100: "#E0E7FF",
          200: "#C7D2FE",
          300: "#A5B4FC",
          400: "#818CF8",
          500: "#6366F1",
          600: "#4F46E5",
          700: "#4338CA",
          800: "#3730A3",
          900: "#312E81",
        },
        accent: {
          DEFAULT: "#8B5CF6",  // Purple
          50: "#F5F3FF",
          100: "#EDE9FE",
          200: "#DDD6FE",
          300: "#C4B5FD",
          400: "#A78BFA",
          500: "#8B5CF6",
          600: "#7C3AED",
          700: "#6D28D9",
          800: "#5B21B6",
          900: "#4C1D95",
        },
        success: {
          DEFAULT: "#10B981",  // Emerald
          50: "#ECFDF5",
          100: "#D1FAE5",
          200: "#A7F3D0",
          300: "#6EE7B7",
          400: "#34D399",
          500: "#10B981",
          600: "#059669",
          700: "#047857",
          800: "#065F46",
          900: "#064E3B",
        },
        warning: {
          DEFAULT: "#F59E0B",  // Amber
          50: "#FFFBEB",
          100: "#FEF3C7",
          200: "#FDE68A",
          300: "#FCD34D",
          400: "#FBBF24",
          500: "#F59E0B",
          600: "#D97706",
          700: "#B45309",
          800: "#92400E",
          900: "#78350F",
        },
        danger: {
          DEFAULT: "#EF4444",  // Red
          50: "#FEF2F2",
          100: "#FEE2E2",
          200: "#FECACA",
          300: "#FCA5A5",
          400: "#F87171",
          500: "#EF4444",
          600: "#DC2626",
          700: "#B91C1C",
          800: "#991B1B",
          900: "#7F1D1D",
        },
        gray: {
          50: "#F9FAFB",
          100: "#F3F4F6",
          200: "#E5E7EB",
          300: "#D1D5DB",
          400: "#9CA3AF",
          500: "#6B7280",
          600: "#4B5563",
          700: "#374151",
          800: "#1F2937",
          900: "#111827",
        },
      },
    },
  },
  darkMode: "class",
  plugins: [
    heroui({
      layout: {
        dividerWeight: "1px",
        disabledOpacity: 0.45,
        fontSize: {
          tiny: "0.75rem",
          small: "0.875rem",
          medium: "0.9375rem",
          large: "1.125rem",
        },
        lineHeight: {
          tiny: "1rem",
          small: "1.25rem",
          medium: "1.5rem",
          large: "1.75rem",
        },
        radius: {
          small: "0.375rem",
          medium: "0.5rem",
          large: "0.75rem",
        },
        borderWidth: {
          small: "1px",
          medium: "1px",
          large: "2px",
        },
      },
      themes: {
        light: {
          colors: {
            default: {
              DEFAULT: "#F3F4F6",
              foreground: "#111827",
            },
            primary: {
              DEFAULT: "#0EA5E9",
              foreground: "#FFFFFF",
            },
            secondary: {
              DEFAULT: "#6366F1",
              foreground: "#FFFFFF",
            },
            success: {
              DEFAULT: "#10B981",
              foreground: "#FFFFFF",
            },
            warning: {
              DEFAULT: "#F59E0B",
              foreground: "#FFFFFF",
            },
            danger: {
              DEFAULT: "#EF4444",
              foreground: "#FFFFFF",
            },
            background: "#FFFFFF",
            foreground: "#111827",
            focus: "#0EA5E9",
            overlay: "rgba(17, 24, 39, 0.4)",
          },
        },
        dark: {
          colors: {
            default: {
              DEFAULT: "#374151",
              foreground: "#F9FAFB",
            },
            primary: {
              DEFAULT: "#0EA5E9",
              foreground: "#F9FAFB",
            },
            secondary: {
              DEFAULT: "#6366F1",
              foreground: "#F9FAFB",
            },
            success: {
              DEFAULT: "#10B981",
              foreground: "#F9FAFB",
            },
            warning: {
              DEFAULT: "#F59E0B",
              foreground: "#111827",
            },
            danger: {
              DEFAULT: "#EF4444",
              foreground: "#F9FAFB",
            },
            background: "#111827",
            foreground: "#F9FAFB",
            content1: {
              DEFAULT: "#1F2937",
              foreground: "#F9FAFB",
            },
            content2: {
              DEFAULT: "#374151",
              foreground: "#F9FAFB",
            },
            content3: {
              DEFAULT: "#4B5563",
              foreground: "#F9FAFB",
            },
            content4: {
              DEFAULT: "#6B7280",
              foreground: "#F9FAFB",
            },
            focus: "#0EA5E9",
            overlay: "rgba(249, 250, 251, 0.4)",
          },
        },
      },
    }),
  ],
};
