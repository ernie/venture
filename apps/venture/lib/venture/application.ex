defmodule Venture.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false
  @default_stories_dir Application.get_env(:venture, :stories)

  use Application

  @impl true
  def start(_type, _args) do
    ets = :ets.new(Venture.Presentation, [:set, :public, :named_table, {:read_concurrency, true}])

    children = [
      # Start the PubSub system
      {Phoenix.PubSub, name: Venture.PubSub},
      %{
        id: Venture.TaskSupervisor,
        start: {Task.Supervisor, :start_link, [[name: Venture.TaskSupervisor]]},
        type: :supervisor
      },
      %{
        id: :presentation_monitor,
        start: {Venture.ChannelMonitor, :start_link, [:presentation]}
      },
      %{
        id: :chat_monitor,
        start: {Venture.ChannelMonitor, :start_link, [:chat]}
      },
      {Venture.Deck, @default_stories_dir},
      {Venture.Presentation, ets},
      Venture.Selections,
      Venture.Connections,
      Venture.Nicks
    ]

    Supervisor.start_link(children, strategy: :one_for_one, name: Venture.Supervisor)
  end
end
