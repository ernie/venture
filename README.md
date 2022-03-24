# Venture

A "choose-your-own-presentation" app. It was created for the purpose of giving
such a presentation at [Keep Ruby Weird 2015](https://www.youtube.com/watch?v=_5D0rBIEsZc),
and used again at [Ruby on Ales 2016](https://www.youtube.com/watch?v=kJkJ_dRAAzQ).
My hope is that you'll use it to give a fun, interactive presentation at some
conference I attend in the future!

It's built with Elixir, Phoenix, and React.

If you'd like to learn more about how to create presentations with Venture, then
follow the steps in the next section, and view the default presentation, which
explains and demonstrates available features.

## Building/Running Locally

**Frontend: /apps/venture_web/assets**

    $ pnpm install

**Backend: /**

    $ mix phx.server

You can then connect to the Venture app at `http://localhost:4000`. In dev
mode, the presenter key is `presenter` by default. You can change this in
`config/config.exs`, if you'd like. **If you plan to host your presentation
from your laptop running in dev mode, you most certainly should change it.**

In production, the presenter key is read from the `PRESENTER_KEY`
environment variable.

## Creating Your Presentation

Venture is an umbrella app. Your presentation files live in `/presentation`,
and you can check out the slides for the tutorial presentation there.

## Running Tests

    $ mix test.all

This will run all backend and frontend tests.

## Deploying

There's a very good chance, given the typical reliability of conference wifi,
that you'll want to host your presentation on a server accessible via mobile
phones and tethered devices.

If you have a VPS (or, I suppose, a non-virtual server -- some folks still have
those, right?) you can take a look at the files in `support` for a post-receive
hook and a simple start/restart script for a git-based deploy setup. Tweak as
necessary.

You'll also find a sample nginx configuration snippet to get you started.

You'll need Elixir and node.js on the server, just as you did locally.
