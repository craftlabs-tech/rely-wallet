/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  plugins: [
    [
      'module-resolver',
      {
        alias: {
          '@': './src',
          fs: '@dr.pogodin/react-native-fs',
          crypto: 'react-native-quick-crypto',
          stream: 'stream-browserify',
          buffer: '@craftzdog/react-native-buffer',
        },
        extensions: ['.js', '.json'],
        root: ['./src'],
      },
    ],
    'inline-dotenv',
    'react-native-reanimated/plugin', // needs to be last
  ],
  presets: ['module:@react-native/babel-preset'],
};
