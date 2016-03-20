var path = require('path');
var util = require('util');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var webpack = require('webpack');
var pkg = require('../package.json');

var DEBUG = process.env.NODE_ENV === 'development';
var TEST = process.env.NODE_ENV === 'test';

var appconfig = require('./appconfig');

var cssBundle = path.join('css', util.format('[name].%s.css', pkg.version));

var plugins = [
  new webpack.optimize.OccurenceOrderPlugin()
];
if (DEBUG) {
  plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      __PROTOCOL__: JSON.stringify(appconfig.PROTOCOL),
      __HOSTNAME__: JSON.stringify(appconfig.HOSTNAME),
      __ROOT__: JSON.stringify(appconfig.ROOT)
    })
  );
} else if (TEST) {
  plugins.push(
    new webpack.DefinePlugin({
      __PROTOCOL__: JSON.stringify(appconfig.PROTOCOL),
      __HOSTNAME__: JSON.stringify(appconfig.HOSTNAME),
      __ROOT__: JSON.stringify(appconfig.ROOT)
    })
  );
} else if (!TEST) {
  plugins.push(
    new ExtractTextPlugin(cssBundle, {
      allChunks: true
    }),
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      },
      __PROTOCOL__: JSON.stringify(appconfig.PROTOCOL),
      __HOSTNAME__: JSON.stringify(appconfig.HOSTNAME),
      __ROOT__: JSON.stringify(appconfig.ROOT)
    }),
    new webpack.NoErrorsPlugin()
  );
}

module.exports = plugins;
