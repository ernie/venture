defmodule Venture.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    ets = :ets.new(Venture.Presentation, [:set, :public, :named_table, {:read_concurrency, true}])

    children = [
      %{
        id: Venture.TaskSupervisor,
        start: {Task.Supervisor, :start_link, [[name: Venture.TaskSupervisor]]},
        type: :supervisor
      },
      {Venture.Deck, Application.get_env(:venture, :presentation)},
      {Venture.Presentation, ets},
      Venture.Selections,
      Venture.Connections,
      Venture.Nicks
    ]

    Supervisor.start_link(children, strategy: :one_for_one, name: Venture.Supervisor)
  end
end
