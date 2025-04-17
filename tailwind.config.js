import { heroui } from "@heroui/theme";

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        border: '#D1D5DB', // slightly lighter than before
        hover: '#E5E7EB',  // soft hover
        primary: '#00E0CA', // Aqua Glow from the image
        secondary: '#64748B', // blue-gray tone
        muted: '#F1F5F9', // card backgrounds
        danger: '#EF4444',
        success: '#10B981',
        warning: '#F59E0B',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        mono: ['Menlo', 'monospace'],
      },
      boxShadow: {
        glass: '0 4px 30px rgba(0, 0, 0, 0.1)',
        glow: '0 0 10px rgba(0, 224, 202, 0.6)', // matches the accent
      },
      backdropBlur: {
        md: '8px',
      },
    },
  },
  plugins: [
    heroui({
      themes: {
        light: {
          colors: {
            background: { DEFAULT: '#F9FAFB', foreground: '#0F172A' }, // light gray with deep navy text
            content1: '#FFFFFF', // true white cards
            primary: { DEFAULT: '#00E0CA' }, // glowing aqua
            secondary: { DEFAULT: '#64748B' }, // subtle blue-gray
            border: '#D1D5DB',
            hover: '#E2E8F0',
            danger: { DEFAULT: '#EF4444' },
            success: { DEFAULT: '#10B981' },
            warning: { DEFAULT: '#F59E0B' },
          },
        },
        dark: {
          colors: {
            background: { DEFAULT: '#111827', foreground: '#F3F4F6' }, // charcoal canvas
            content1: '#1F2937', // subtle dark panels
            primary: { DEFAULT: '#00E0CA' },
            secondary: { DEFAULT: '#9CA3AF' },
            border: '#334155',
            hover: '#1E293B',
            danger: { DEFAULT: '#EF4444' },
            success: { DEFAULT: '#10B981' },
            warning: { DEFAULT: '#F59E0B' },
          },
        },
      },
      layout: {
        fontSize: {
          tiny: '0.75rem',
          small: '0.875rem',
          medium: '1rem',
          large: '1.125rem',
        },
        lineHeight: {
          tiny: '1.2rem',
          small: '1.4rem',
          medium: '1.6rem',
          large: '1.8rem',
        },
        radius: {
          small: '0.25rem',
          medium: '0.5rem',
          large: '1rem', // more rounded (matches image card style)
        },
        borderWidth: {
          small: '1px',
          medium: '1.5px',
          large: '2px',
        },
        disabledOpacity: '0.3',
        dividerWeight: '1',
        hoverOpacity: '0.9',
      },
    }),
  ],
};

export default config;
