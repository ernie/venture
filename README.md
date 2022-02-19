# Venture

An application built for hosting interactive, choose-your-own-adventure-style
presentations, originally built for the sole purpose of running a
[single conference talk at Keep Ruby Weird 2015](http://confreaks.tv/videos/keeprubyweird2015-choices).

It's built with Elixir, Phoenix, and React.

If you'd like to learn more about how to create presentations with Venture, then
follow the steps in the next section, and view the default presentation, which
explains and demonstrates available features.

## Building/Running Locally

**Frontend: /apps/venture_web/assets**

    $ pnpm install

**Backend: /**

    $ mix phx.server

You can then connect to the Venture app at `http://localhost:4000`. In dev mode
mode, the presenter key is `presenter` by default. You can change this in
`config/config.exs`, if you'd like. **If you plan to host your presentation
from your laptop running in dev mode, you most certainly should change it.**

In production, the presenter key is read from the `PRESENTER_KEY`
environment variable.

## Creating Your Presentation

The updated version of Venture is an umbrella app. The static assets for your
presentation live in
`apps/venture_web/priv/static` and the story files themselves live in
`apps/venture/priv/stories`.

## Running Tests

**Backend: /**

    $ mix test

**Frontend: /apps/venture_web/assets**

Test bankruptcy declared. Will be rewriting all of these tests (and the FE code
itself) as a learning exercise in the future.

## Deploying

There's a very good chance, given the typical reliability of conference wifi,
that you'll want to host your presentation on a server accessible via mobile
phones and tethered devices.

If you have a VPS (or, I suppose, a non-virtual server -- some folks still have
those, right?) you can take a look at the files in `support` for a post-receive
hook and a simple start/restart script for a git-based deploy setup. Tweak as
necessary.

You'll need Elixir and node.js on the server, just as you did locally.
