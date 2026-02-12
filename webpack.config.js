const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { TwilightWatcherPlugin } = require('@aspect/twilight-watcher');

module.exports = {
  entry: {
    app: ['./src/assets/js/app.js', './src/assets/styles/app.scss'],
  },
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'js/[name].js',
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-config', 'sass-loader'],
      },
      {
        test: /\.(png|jpg|gif|svg|woff|woff2)$/,
        type: 'asset/resource',
        generator: { filename: 'images/[name][ext]' },
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({ filename: 'css/[name].css' }),
    new TwilightWatcherPlugin(),
  ],
  mode: 'production',
  devtool: 'source-map',
};
