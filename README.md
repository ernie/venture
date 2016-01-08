# Venture

An application built for hosting interactive, choose-your-own-adventure-style
presentations, originally built for the sole purpose of running a
[single conference talk at Keep Ruby Weird 2015](http://confreaks.tv/videos/keeprubyweird2015-choices).

It's built with Elixir, Phoenix, and React with ES6+ (thanks, Babel!).

If you'd like to learn more about how to create presentations with Venture, then
follow the steps in the next section, and view the default presentation, which
explains and demonstrates available features.

## Building/Running Locally

The app consists of two components when running locally: the Phoenix application
serving the slides and handling user interactions, and a
[webpack-dev-server](https://github.com/webpack/webpack-dev-server) hosting the
frontend. You'll need a recent version of Elixir (developed/tested on 1.2.0) and
node.js (5.3.0 is what I'm currently using) to get going.

**Backend: /**

    $ mix deps.get
    $ mix deps.compile
    $ mix phoenix.server

**Frontend: /client**

You may want to check out a few configurable items in `webpack/appconfig.js`.
Then:

    $ npm start

You can then connect to your frontend app at `http://localhost:8000`. In dev
mode, the presenter token is `abc123` by default. You can change this in
`config/config.exs`, if you'd like. **If you plan to host your presentation from
your laptop running in dev mode, you most certainly should change it.**

## Running Tests

**Backend: /**

    $ mix test

**Frontend: /client**

    $ npm test

## Deploying

There's a very good chance, given the typical reliability of conference wifi,
that you'll want to host your presentation on a server accessible via mobile
phones and tethered devices.

If you have a VPS (or, I suppose, a non-virtual server -- some folks still have
those, right?) you can take a look at the files in `support` for a post-receive
hook and a simple start/restart script for a git-based deploy setup. Tweak as
necessary.

You'll need Elixir and node.js on the server, just as you did locally.
