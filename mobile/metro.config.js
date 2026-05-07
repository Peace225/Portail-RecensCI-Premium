const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Assure la résolution de react-native-worklets depuis node_modules
config.resolver.extraNodeModules = {
  'react-native-worklets': require.resolve('react-native-worklets'),
};

module.exports = config;
