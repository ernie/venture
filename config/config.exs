# This file is responsible for configuring your umbrella
# and **all applications** and their dependencies with the
# help of the Config module.
#
# Note that all applications in your umbrella share the
# same configuration and dependencies, which is why they
# all use the same configuration file. If you want different
# configurations or dependencies per app, it is best to
# move said applications out of the umbrella.
import Config

# This default presenter key is overridden in runtime.exs for production use
config :venture, :presenter_key, "presenter"
config :venture, :attendee_key, ":attendee"

config :venture, :stories, "priv/stories"

# Configures the mailer
#
# By default it uses the "Local" adapter which stores the emails
# locally. You can see the emails in your browser, at "/dev/mailbox".
#
# For production it's recommended to configure a different adapter
# at the `config/runtime.exs`.
config :venture, Venture.Mailer, adapter: Swoosh.Adapters.Local

# Swoosh API client is needed for adapters other than SMTP.
config :swoosh, :api_client, false

config :venture_web,
  generators: [context_app: :venture]

# Configures the endpoint
config :venture_web, VentureWeb.Endpoint,
  url: [host: "localhost"],
  render_errors: [view: VentureWeb.ErrorView, accepts: ~w(html json), layout: false],
  pubsub_server: VentureWeb.PubSub,
  live_view: [signing_salt: "K4bwc2jv"]

# Configure esbuild (the version is required)
config :esbuild,
  version: "0.14.0",
  default: [
    args:
      ~w(js/root.tsx --bundle --target=es2017 --outdir=../priv/static/assets --external:/fonts/* --external:/images/* --external:/audio/* --external:/backgrounds/*),
    cd: Path.expand("../apps/venture_web/assets", __DIR__),
    env: %{"NODE_PATH" => Path.expand("../deps", __DIR__)}
  ]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Use Jason for JSON parsing in Phoenix
config :phoenix, :json_library, Jason

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{config_env()}.exs"
