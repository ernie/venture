defmodule Venture.Selections do
  use GenServer

  ## Client API

  def start_link(_opts \\ []) do
    GenServer.start_link(__MODULE__, :ok, name: __MODULE__)
  end

  def current do
    GenServer.call(__MODULE__, {:current})
  end

  def reset(options) do
    GenServer.call(__MODULE__, {:reset, options})
  end

  def selection(socket, option) do
    GenServer.call(__MODULE__, {:selection, socket, option})
  end

  def deregister(socket) do
    GenServer.call(__MODULE__, {:deregister, socket})
  end

  ## Server Callbacks

  def init(:ok) do
    {
      :ok,
      %{ counts: %{}, selections: %{} }
    }
  end

  def handle_call(
    {:reset, options = [%{story: _story, index: _index} | _rest]},
    _from, _state)
  do
    new_counts = Enum.into(
      options, %{},
      fn o -> {"#{o.story}:#{o.index}", 0} end
    )
    {
      :reply,
      new_counts,
      %{ counts: new_counts, selections: %{} }
    }
  end

  def handle_call({:reset, options}, _from, _state) do
    new_counts = Enum.into(options, %{}, fn o -> {o, 0} end)
    {
      :reply,
      new_counts,
      %{ counts: new_counts, selections: %{} }
    }
  end

  def handle_call({:current}, _from, state) do
    {:reply, state.counts, state}
  end

  def handle_call({:selection, socket, option}, _from, state) do
    case Map.fetch(state.selections, socket.id) do
      {:ok, ^option} -> {:reply, {:nochange, state.counts}, state}
      _ ->
        new_selections = Map.put(state.selections, socket.id, option)
        new_counts = count_selections(state.counts, new_selections)
        {
          :reply,
          {:ok, new_counts},
          %{counts: new_counts, selections: new_selections}
        }
    end
  end

  def handle_call({:deregister, socket}, _from, state) do
    new_selections = Map.drop(state.selections, [socket.id])
    new_counts = count_selections(state.counts, new_selections)
    {:reply, new_counts, %{counts: new_counts, selections: new_selections}}
  end

  defp count_selections(counts, selections) do
    Enum.reduce(
      selections,
      (for {l, _c} <- counts, into: %{}, do: {l, 0}),
      fn {_pid, option}, count ->
        case Map.has_key?(count, option) do
          true -> Map.put(count, option, count[option] + 1)
          false -> count
        end
      end
    )
  end

end
