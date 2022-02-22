defmodule Venture.Deck do
  use GenServer

  ## Client API

  def start_link(presentation_dir) do
    GenServer.start_link(__MODULE__, presentation_dir, name: __MODULE__)
  end

  def slide_at(location) do
    GenServer.call(__MODULE__, {:slide_at, location})
  end

  def slide_at?(location) do
    GenServer.call(__MODULE__, {:slide_at?, location})
  end

  def reload do
    GenServer.call(__MODULE__, {:reload})
  end

  ## Server Callbacks

  def init(presentation_dir) do
    {
      :ok,
      %{
        presentation_dir: presentation_dir,
        stories: Venture.Stories.load(presentation_dir)
      }
    }
  end

  def handle_call({:slide_at, location}, _from, state) do
    slide = Map.get(state.stories, location.story, [])
            |> Enum.at(location.index)
    { :reply, slide, state }
  end

  def handle_call({:slide_at?, location}, _from, state) do
    slide = Map.get(state.stories, location.story, [])
            |> Enum.at(location.index)
    { :reply, !!slide, state }
  end

  def handle_call({:reload}, _from, state) do
    {
      :reply,
      :ok,
      %{ state | stories: Venture.Stories.load(state.presentation_dir) }
    }
  end

end
