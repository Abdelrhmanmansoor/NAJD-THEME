module.exports = {
  content: ['./src/views/**/*.twig', './src/assets/js/**/*.js'],
  theme: {
    extend: {
      colors: {
        najd: { accent: '#C9A96E', 'accent-light': '#E8D5A8' },
      },
      fontFamily: { tajawal: ['Tajawal', 'sans-serif'] },
    },
  },
  plugins: [],
};
