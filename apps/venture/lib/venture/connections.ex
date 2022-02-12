defmodule Venture.Connections do
  use GenServer

  ## Client API

  def start_link(_opts \\ []) do
    GenServer.start_link(__MODULE__, :ok, name: __MODULE__)
  end

  def reset do
    GenServer.call(__MODULE__, {:reset})
  end

  def current do
    GenServer.call(__MODULE__, {:current})
  end

  def connect(socket) do
    GenServer.call(__MODULE__, {:connect, socket})
  end

  def disconnect(socket) do
    GenServer.call(__MODULE__, {:disconnect, socket})
  end

  ## Server Callbacks

  def init(:ok) do
    {
      :ok,
      %{ presenters: 0, attendees: 0 }
    }
  end

  def handle_call({:reset}, _from, _state) do
    {:reply, :ok, %{ presenters: 0, attendees: 0 }}
  end

  def handle_call({:current}, _from, state) do
    {:reply, state, state}
  end

  def handle_call({:connect, %{assigns: %{presenter: true}}}, _from, state) do
    new_state = %{ state | presenters: state.presenters + 1 }
    broadcast!(new_state)
    {:reply, new_state, new_state}
  end

  def handle_call({:connect, _socket}, _from, state) do
    new_state = %{ state | attendees: state.attendees + 1 }
    broadcast!(new_state)
    {:reply, new_state, new_state}
  end

  def handle_call(
    {:disconnect, %{assigns: %{presenter: true}}}, _from, state
  ) do
    new_state = %{ state | presenters: state.presenters - 1 }
    broadcast!(new_state)
    {:reply, new_state, new_state}
  end

  def handle_call({:disconnect, _socket}, _from, state) do
    new_state = %{ state | attendees: state.attendees - 1 }
    broadcast!(new_state)
    {:reply, new_state, new_state}
  end

  defp broadcast!(connections) do
    VentureWeb.Endpoint.broadcast!(
      "presentation:presenter", "connections", connections
    )
  end

end
