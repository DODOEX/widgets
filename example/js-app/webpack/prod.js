const HtmlWebpackPlugin = require('html-webpack-plugin');
const { resolve, join } = require('path');

module.exports = {
  entry: './src/main.js',
  mode: 'production',
  output: {
    path: resolve(__dirname, '../dist'),
    filename: 'bundle.js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: resolve(__dirname, '../src/index.html'),
      filename: 'index.html',
    }),
  ],
};
