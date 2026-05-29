/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          base: '#0A0A0F',
          card: '#111118',
        },
        f1: {
          red: '#E8002D',
        },
        team: {
          mercedes: '#00D2BE',
          redbull: '#3671C6',
          ferrari: '#E8002D',
          mclaren: '#FF8000',
          astonmartin: '#358C75',
          alpine: '#FF87BC',
          williams: '#64C4FF',
          rb: '#6692FF',
          haas: '#B6BABD',
          sauber: '#52E252',
        },
        accent: {
          primary: '#E8002D',
          secondary: '#00D2BE',
          tertiary: '#FF8000',
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#9CA3AF',
        }
      },
      fontFamily: {
        heading: ['Formula1 Display', 'Rajdhani', 'sans-serif'],
        mono: ['JetBrains Mono', 'Space Mono', 'monospace'],
        body: ['Inter', 'sans-serif'],
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scanline': 'scanline 8s linear infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: 1, boxShadow: '0 0 20px rgba(232,0,45,0.4)' },
          '50%': { opacity: .5, boxShadow: '0 0 10px rgba(232,0,45,0.2)' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        }
      }
    },
  },
  plugins: [],
}
