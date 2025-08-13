module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        fadeOut: {
          '0%': { opacity: 1 },
          '100%': { opacity: 0 },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.3s ease-in-out',
        fadeOut: 'fadeOut 0.3s ease-in-out',
      },
      colors: {
        // primary: 'hsl(var(--primary) / <alpha-value>)',
        // accent: 'hsl(var(--accent) / <alpha-value>)',
        // primaryDark: 'var(--primaryDark)',
      },
    },
  },
  plugins: [],
};
