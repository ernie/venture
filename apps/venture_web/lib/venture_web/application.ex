defmodule VentureWeb.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    children = [
      # Start the PubSub system
      {Phoenix.PubSub, name: VentureWeb.PubSub},
      # Start the Telemetry supervisor
      VentureWeb.Telemetry,
      # Start Presence
      VentureWeb.Presence,
      # Start the Endpoint (http/https)
      VentureWeb.Endpoint,
      # Start a worker by calling: VentureWeb.Worker.start_link(arg)
      # {VentureWeb.Worker, arg}
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: VentureWeb.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  @impl true
  def config_change(changed, _new, removed) do
    VentureWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
