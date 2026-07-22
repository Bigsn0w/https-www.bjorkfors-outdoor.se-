/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './*.html',
    './de/*.html',
    './en/*.html',
    './nl/*.html',
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          950: '#0F2417',
          900: '#14301F',
          800: '#1F4A30',
          700: '#2B5E3E',
        },
        sage: '#9DA971',
        cream: '#F7F4ED',
        accent: {
          DEFAULT: '#801818',
          hover: '#5E1111',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(28px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.9s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'marquee': 'marquee 36s linear infinite',
      },
    },
  },
};
