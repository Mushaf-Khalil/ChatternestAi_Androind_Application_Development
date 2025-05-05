// babel.config.js
module.exports = function(api) {
    api.cache(true);
    return {
      presets: ['babel-preset-expo'], // Standard Expo preset
      plugins: [
        // Plugin for react-native-dotenv to load .env variables
        ["module:react-native-dotenv", {
          "moduleName": "@env",
          "path": ".env",
          "blacklist": null,
          "whitelist": null,
          "safe": false,
          "allowUndefined": true
        }],
        // IMPORTANT: Add 'react-native-reanimated/plugin' if you use Reanimated,
        // and it MUST be the last plugin listed.
        'react-native-reanimated/plugin',
      ]
    };
  };