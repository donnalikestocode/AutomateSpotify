const webpack = require('webpack');
const path = require('path');

const config = {
  entry: './src/create_playlist.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'bundle.js'
  },
  mode: 'development'
};

module.exports = config;