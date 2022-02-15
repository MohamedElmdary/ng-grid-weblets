import { Configuration } from 'webpack';

export default {
  resolve: {
    fallback: {
      crypto: require.resolve('crypto-browserify'),
      os: require.resolve('os-browserify/browser'),
      path: require.resolve('path-browserify'),
      stream: require.resolve('stream-browserify'),
      util: require.resolve('util'),
      http: require.resolve('stream-http'),
      https: require.resolve('https-browserify'),
      url: require.resolve('url'),
      fs: require.resolve('browserify-fs'),
    },
  },
} as Configuration;
