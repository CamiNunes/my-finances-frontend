// tailwind.config.js
module.exports = {
  darkMode: 'media', // ou 'class' se preferir usar classes para modo escuro
  content: [
    "./src/**/*.{js,ts,jsx,tsx}", // Ajuste de acordo com a estrutura do seu projeto
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background-start-rgb)',
        foreground: 'var(--foreground-rgb)',
      },
    },
  },
  plugins: [],
};
