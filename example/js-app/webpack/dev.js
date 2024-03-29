const HtmlWebpackPlugin = require('html-webpack-plugin');
const { resolve, join } = require('path');

module.exports = {
  entry: './src/main.js',
  mode: 'development',
  output: {
    path: __dirname + '/dist',
    filename: 'bundle.js',
  },
  devServer: {
    hot: true,
    historyApiFallback: true,
    client: {
      overlay: {
        errors: true,
        warnings: false,
      },
    },
    open: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: resolve(__dirname, '../src/index.html'),
      filename: 'index.html',
    }),
  ],
};
