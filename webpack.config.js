var HtmlWebpackPlugin = require('html-webpack-plugin')
var autoprefixer = require('autoprefixer');
var cssnano = require('cssnano');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

var htmlMinifiedOptions = {
  collapseWhitespace: true,
  removeRedundantAttributes: true
};

var htmlWebpackOptions = {
  title: 'D3',
  minify: htmlMinifiedOptions,
  hash: true,
  template: 'src/index.html',
  inject: 'body'
};

module.exports = {
  entry: './src/main.js',
  output: {
    path: 'dist',
    filename: 'main.js'
  },
  plugins: [
    new HtmlWebpackPlugin(htmlWebpackOptions),
    new ExtractTextPlugin("main.css", {
      allChunks: true
    }),
    new CopyWebpackPlugin([{from: 'src/data', to: 'data'}], {})
  ],
  module: {
    loaders: [
      {
        test: /\.js?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader!sass-loader')
      }
    ]
  },
  postcss: function () {
    return [autoprefixer, cssnano];
  }
};
