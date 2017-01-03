var PRODUCTION = process.env.NODE_ENV === 'production';

var appconfig = {
  // Look, you're going to be getting on a stage in front of a bunch of people
  // and controlling your presentation over a websocket connection. Trust me,
  // you want WSS here.
  PROTOCOL: PRODUCTION ? 'ws://' : 'ws://',
  // Production hostname is determined during server-side build.
  // You'll want to change "venture.local.devel" to something like
  // "localhost:3000" if you aren't running https://github.com/ernie/the_setup
  HOSTNAME: PRODUCTION ? null : 'localhost:3000',
  // If you're hosting your production site inside a subdirectory, you can
  // change the first "/" to something else. It worked for me, but I wouldn't
  // recommend it if you can avoid it.
  ROOT: PRODUCTION ? '/' : '/'
}

module.exports = appconfig;
