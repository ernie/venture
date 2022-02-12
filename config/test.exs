import Config

# We don't run a server during test. If one is required,
# you can enable the server option below.
config :venture_web, VentureWeb.Endpoint,
  http: [ip: {127, 0, 0, 1}, port: 4002],
  secret_key_base: "I5unublaO0HO0tUmSbtqimEI0+yP20ELJsJ2LV2RUalnZk/AJ8UFTNAti+gn7sVy",
  server: false

# Print only warnings and errors during test
config :logger, level: :warn

# In test we don't send emails.
config :venture, Venture.Mailer, adapter: Swoosh.Adapters.Test

# Initialize plugs at runtime for faster test compilation
config :phoenix, :plug_init_mode, :runtime

config :venture, :stories, "priv/test_stories"
