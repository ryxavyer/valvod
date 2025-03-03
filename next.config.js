const path = require('path');

module.exports = {
  reactStrictMode: false,
  webpack: (config, { isServer }) => {
    config.resolve.alias['@src/'] = path.resolve(__dirname, 'src');
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
};
