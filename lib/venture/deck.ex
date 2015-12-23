defmodule Venture.Deck do
  @default_stories_dir Application.get_env(:venture, :stories)

  use GenServer

  ## Client API

  def start_link(stories_dir \\ @default_stories_dir) do
    GenServer.start_link(__MODULE__, stories_dir, name: __MODULE__)
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

  def init(stories_dir) do
    {
      :ok,
      %{
        stories_dir: stories_dir,
        stories: Venture.Stories.load(stories_dir)
      }
    }
  end

  def handle_call({:slide_at, location}, _from, state) do
    slide = Dict.get(state.stories, location.story, [])
            |> Enum.at(location.index)
    { :reply, slide, state }
  end

  def handle_call({:slide_at?, location}, _from, state) do
    slide = Dict.get(state.stories, location.story, [])
            |> Enum.at(location.index)
    { :reply, !!slide, state }
  end

  def handle_call({:reload}, _from, state) do
    {
      :reply,
      :ok,
      %{ state | stories: Venture.Stories.load(state.stories_dir) }
    }
  end

end
