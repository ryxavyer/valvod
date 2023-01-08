module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: 'media',
  theme: {
      extend: {
        boxShadow: {
          'nav': '0px 0px 15px 5px rgba(0, 0, 0, 0.5)',
          'motivation': '0px 5px 5px 3px rgba(0, 0, 0, 0.4)',
        },
        colors: {
          'routyneGold': '#607d8b',
          'routyneGoldLight': '#c29b6e',
          'itemColor': '#37474f',
          'itemColorSelected': '#B68F61',
          'defaultBody': '#0A1929',
        },
        backgroundImage: {
          'online': 'url(./static/online.png)',
          'offline': 'url()',
          'working': 'url()',
        },
        animation: {
          'ping-slow': 'ping 1.5s linear infinite',
        },
      },
  },
  variants: {
      extend: {},
  },
  plugins: [],
};