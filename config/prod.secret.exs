use Mix.Config

# We're checking this into version control, so only environment variables should
# be used here. They'll be used at build-time.

config :venture, Venture.Endpoint,
  secret_key_base: System.get_env("SECRET_KEY_BASE")

config :venture, :presenter_token, System.get_env("PRESENTER_TOKEN")
