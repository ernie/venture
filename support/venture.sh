#!/bin/bash
# This is an extremely simple start script to kick off a launch/re-launch of a
# Venture server. Intended to be used after a post-receive hook has run to
# handle the build process. Tested on Ubuntu 20.04.

export MIX_ENV=prod
export PORT=3000

# Point this at your checked-out copy of Venture.
cd /var/www/<your-domain>/apps/venture

pid=$(lsof -i tcp:$PORT | grep LISTEN | cut -d ' ' -f 2)

if [ $pid ]; then
  kill $pid
fi

mix phx.server > stdout.log 2> stderr.log &

echo "Server started on port $PORT."
