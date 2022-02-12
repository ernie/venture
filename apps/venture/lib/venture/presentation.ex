defmodule Venture.Presentation do
  use GenServer
  use Venture.Slide
  alias Venture.Deck

  @entry %{ story: "main", index: 0 }

  ## Client API

  def start_link(table) do
    GenServer.start_link(__MODULE__, table, name: __MODULE__)
  end

  def current_slide do
    GenServer.call(__MODULE__, {:current_slide})
  end

  def next do
    GenServer.call(__MODULE__, {:next})
  end

  def prev do
    GenServer.call(__MODULE__, {:prev})
  end

  def reset do
    GenServer.call(__MODULE__, {:reset})
  end

  def go(location) do
    GenServer.call(__MODULE__, {:go, location})
  end

  def reset_selections do
    GenServer.call(__MODULE__, {:reset_selections})
  end

  ## Server Callbacks

  def init(table) do
    saved = :ets.foldl(
              fn { key, value }, acc ->
                Map.put(acc, key, value)
              end,
              %{current: @entry, history: []},
              table
            )
    case Enum.all?([saved.current | saved.history], &Deck.slide_at?(&1)) do
      true ->
        {
          :ok,
          %{
            table: table,
            current: saved.current,
            history: saved.history
          }
        }
      false ->
        {
          :ok,
          %{
            table: table,
            current: @entry,
            history: []
          }
        }
    end
  end

  def handle_call({:current_slide}, _from, state) do
    {:reply, Deck.slide_at(state.current), state}
  end

  def handle_call({:next}, _from, state) do
    current_slide = Deck.slide_at(state.current)
    case current_slide.next do
      nil -> {:reply, nil, state}
      next_slide ->
        reset_selections_for_slide(next_slide)
        {
          :reply,
          Deck.slide_at(next_slide.location),
          next_slide_state(current_slide, next_slide, state)
        }
    end
  end

  def handle_call({:prev}, _from, state = %{history: []}) do
    {:reply, nil, state}
  end

  def handle_call({:prev}, _from, state) do
    [head | tail] = state.history
    prev_slide = Deck.slide_at(head)
    reset_selections_for_slide(prev_slide)
    {:reply, prev_slide, %{state | current: prev_slide.location, history: tail}}
  end

  def handle_call({:reset}, _from, state) do
    {
      :reply,
      Deck.slide_at(@entry),
      %{ state | history: [], current: @entry }
    }
  end

  def handle_call({:go, location}, _from, state) do
    [story, index] = case String.split(location, ":", trim: true) do
                       [s, i] ->
                         {idx, _rem} = Integer.parse(i)
                         [s, idx]
                       [s] -> [s, 0]
                     end
    next_slide = Deck.slide_at(%{story: story, index: index})
    reset_selections_for_slide(next_slide)
    current_slide = Deck.slide_at(state.current)
    {
      :reply,
      next_slide || current_slide,
      next_slide_state(current_slide, next_slide, state)
    }
  end

  def handle_call({:reset_selections}, _from, state) do
    reset_selections_for_slide(Deck.slide_at(state.current))
    { :reply, :ok, state }
  end

  def terminate(_reason, state) do
    :ets.insert(state.table, {:current, state.current})
    :ets.insert(state.table, {:history, state.history})
  end

  defp next_slide_state(_current, nil, state) do
    state
  end

  defp next_slide_state(current, next, state) when current == next do
    state
  end

  defp next_slide_state(current, next, state) do
    %{ state |
       current: next.location,
       history: [current.location | state.history] }
  end

  defp reset_selections_for_slide(slide) do
    case slide do
      %Fork{} ->
        Venture.Selections.reset(Enum.map(slide.paths, fn o -> o.location end))
      %Poll{} ->
        Venture.Selections.reset(slide.options)
      _ -> nil
    end
  end


end
