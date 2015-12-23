module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['source-map-support', 'mocha', 'sinon'],
    files: [
      'karma.polyfill.js',
      'app/app.tests.js',
      'lib/lib.tests.js'
    ],
    exclude: [],
    preprocessors: {
      'karma.polyfill.js': ['webpack', 'sourcemap'],
      'app/app.tests.js': ['webpack', 'sourcemap'],
      'lib/lib.tests.js': ['webpack', 'sourcemap']
    },
    reporters: ['mocha'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: [/*'Chrome', */'PhantomJS'],
    singleRun: false,
    webpack: require('./webpack/config.test'),
    webpackMiddleware: {
      noInfo: true
    }
  });
};
