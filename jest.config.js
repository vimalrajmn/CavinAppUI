module.exports = {
  preset: 'react-native',
  // transformIgnorePatterns: [
  //   'node_modules/(?!((jest-)?react-native(-.*)?|@react-native(-community)?|@react-navigation|@rneui)/)'
  // ],
  // moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  // transformIgnorePatterns: [
  //   "node_modules/(?!(react-native"
  //     + "|react-navigation-tabs"
  //     + "|react-native-splash-screen"
  //     + "|react-native-screens"
  //     + "|react-native-reanimated"
  //   + ")/)",
  // ],
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|svg)$": "<rootDir>/__mocks__/fileMock.js",
    '@react-native-async-storage/async-storage': '<rootDir>/__mocks__/@react-native-async-storage/async-storage.js',
  },
}; 
