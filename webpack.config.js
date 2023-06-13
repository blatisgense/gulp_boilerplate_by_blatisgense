// import path from 'path';
// import { fileURLToPath } from 'url';
import {paths} from "./gulpfile.babel.js";

//
// const __filename = fileURLToPath(import.meta.url);
// const srcFolder = 'src';
// const buildFolder = 'dist';
//
// const paths = {
//   root: path.dirname(__filename),
//   src: path.resolve(srcFolder),
//   build: path.resolve(buildFolder),
// };

export const webpackConfig = (isMode) => ({
  entry: ['@babel/polyfill', paths.scripts.src],

  mode: isMode ? 'development' : 'production',

  // cache: {
  //   type: 'filesystem', // По умолчанию 'memory'
  //   cacheDirectory: `${paths.root}/.temporary_cache`,
  // },
  cache: false,

  output: {
    path: paths.scripts.dest,
    filename: '[name].js',
    // publicPath: '/',
  },

  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,

        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },

        resolve: {
          fullySpecified: false,
        },
      },
    ],
  },
});
