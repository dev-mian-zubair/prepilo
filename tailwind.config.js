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
        border: '#e5e7eb', // neutral border color
        hover: '#f3f4f6', // subtle hover bg
        primary: '#242629', // main accent
        secondary: '#575759', // secondary accent
        danger: '#EB154E',
        success: '#00D184',
        warning: '#FF6A00',
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        mono: ['var(--font-mono)'],
      },
    },
  },
  plugins: [
    heroui({
      themes: {
        light: {
          colors: {
            background: { DEFAULT: '#FAF9F7', foreground: '#242629' },
            content1: '#ffffff',
            primary: { DEFAULT: '#242629' },
            secondary: { DEFAULT: '#575759' },
            border: '#e5e7eb',
            hover: '#f3f4f6',
            danger: { DEFAULT: '#EB154E' },
            success: { DEFAULT: '#00D184' },
            warning: { DEFAULT: '#FF6A00' },
          },
        },
        dark: {
          colors: {
            background: { DEFAULT: '#202124', foreground: '#f9fafa' },
            content1: '#36383a',
            primary: { DEFAULT: '#36383a' },
            secondary: { DEFAULT: '#c7c7c7' },
            border: '#3f3f46',
            hover: '#2c2c2c',
            danger: { DEFAULT: '#EB154E' },
            success: { DEFAULT: '#00D184' },
            warning: { DEFAULT: '#FF6A00' },
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
          tiny: '1rem',
          small: '1.25rem',
          medium: '1.5rem',
          large: '1.75rem',
        },
        radius: {
          small: '0.5rem',
          medium: '0.75rem',
          large: '0.875rem',
        },
        borderWidth: {
          small: '1px',
          medium: '2px',
          large: '3px',
        },
        disabledOpacity: '0.5',
        dividerWeight: '1',
        hoverOpacity: '0.9',
      },
    }),
  ],
};

export default config;
