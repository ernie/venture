# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.
use Mix.Config

# Configures the endpoint
config :venture, Venture.Endpoint,
  url: [host: "localhost"],
  root: Path.dirname(__DIR__),
  # This isn't used in production. Feel free to regenerate it, though!
  secret_key_base: "jGpFYn3RysaGT5E3DnYcFQ57gdN4841/+EIuPUu4CUpzhSiA29oVpH1mRD92XkXY",
  render_errors: [accepts: ~w(json)],
  pubsub: [name: Venture.PubSub,
           adapter: Phoenix.PubSub.PG2]

# If you want to change the development mode presenter token, do it here. Again,
# this isn't used in production.
config :venture, :presenter_token, "abc123"

config :venture, stories: "priv/stories"

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env}.exs"
