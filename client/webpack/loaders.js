var path = require('path');
var pkg = require('../package.json');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var DEBUG = process.env.NODE_ENV === 'development';
var TEST = process.env.NODE_ENV === 'test';

var sassLoader;
var cssLoader;
var assetPath = path.join(__dirname, '../app/assets')
var assetLoader = 'file-loader?context=' + assetPath + '&name=[path][name].[ext]';
var htmlLoader = [
  'file-loader?name=[path][name].[ext]',
  'template-html-loader?' + [
    'raw=true',
    'engine=lodash',
    'version=' + pkg.version,
    'title=' + pkg.name,
    'debug=' + DEBUG
  ].join('&')
].join('!');
var jsonLoader = ['json-loader'];

var sassParams = [
  'outputStyle=expanded',
  'includePaths[]=' + path.resolve(__dirname, '../app/scss'),
  'includePaths[]=' + path.resolve(__dirname, '../node_modules')
];

if (DEBUG || TEST) {
  sassParams.push('sourceMap', 'sourceMapContents=true');
  sassLoader = [
    'style-loader',
    'css-loader?modules&localIdentName=[name]__[local]___[hash:base64:5]',
    'postcss-loader',
    'sass-loader?' + sassParams.join('&')
  ].join('!');
  cssLoader = [
    'style-loader',
    'css-loader?modules&localIdentName=[name]__[local]___[hash:base64:5]',
    'postcss-loader'
  ].join('!');
  moduleSassLoader = [
    'style-loader',
    'css-loader?localIdentName=[name]__[local]___[hash:base64:5]',
    'postcss-loader',
    'sass-loader?' + sassParams.join('&')
  ].join('!');
  moduleCssLoader = [
    'style-loader',
    'css-loader?localIdentName=[name]__[local]___[hash:base64:5]',
    'postcss-loader'
  ].join('!');
} else {
  sassLoader = ExtractTextPlugin.extract('style-loader', [
    'css-loader?modules&localIdentName=[hash:base64:5]',
    'postcss-loader',
    'sass-loader?' + sassParams.join('&')
  ].join('!'));
  cssLoader = ExtractTextPlugin.extract('style-loader', [
    'css-loader?modules&localIdentName=[hash:base64:5]',
    'postcss-loader'
  ].join('!'));
  moduleSassLoader = ExtractTextPlugin.extract('style-loader', [
    'css-loader?localIdentName=[hash:base64:5]',
    'postcss-loader',
    'sass-loader?' + sassParams.join('&')
  ].join('!'));
  moduleCssLoader = ExtractTextPlugin.extract('style-loader', [
    'css-loader?localIdentName=[hash:base64:5]',
    'postcss-loader'
  ].join('!'));
}

var loaders = [
  {
    test: /\.jsx?$/,
    exclude: /node_modules/,
    loader: 'babel-loader'
  },
  {
    test: /\.css$/,
    exclude: /node_modules/,
    loader: cssLoader
  },
  {
    test: /\.css$/,
    include: /node_modules/,
    loader: moduleCssLoader
  },
  {
    test: /\.jpe?g$|\.gif$|\.png$|\.ico|\.eot$|\.svg$|\.woff2?$|\.ttf$|\.mp3$/,
    loader: assetLoader
  },
  {
    test: /\.json$/,
    exclude: /node_modules/,
    loaders: jsonLoader
  },
  {
    test: /\.html$/,
    loader: htmlLoader
  },
  {
    test: /\.scss$/,
    exclude: /node_modules/,
    loader: sassLoader
  },
  {
    test: /\.scss$/,
    include: /node_modules/,
    loader: moduleSassLoader
  }
];

module.exports = loaders;
