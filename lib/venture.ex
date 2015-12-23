defmodule Venture do
  use Application

  # See http://elixir-lang.org/docs/stable/elixir/Application.html
  # for more information on OTP Applications
  def start(_type, _args) do
    import Supervisor.Spec, warn: false
    ets = :ets.new(Venture.Presentation,
                 [:set, :public, :named_table, {:read_concurrency, true}])

    children = [
      supervisor(Venture.Endpoint, []),
      worker(Venture.Deck, []),
      worker(Venture.Presentation, [ets]),
      worker(Venture.Selections, []),
      worker(Venture.Connections, []),
      worker(Venture.Nicks, [])
    ]

    # See http://elixir-lang.org/docs/stable/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: Venture.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  def config_change(changed, _new, removed) do
    Venture.Endpoint.config_change(changed, removed)
    :ok
  end
end
