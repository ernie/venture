defmodule Venture.Slide do
  alias Venture.Slide.Fork
  alias Venture.Slide.Poll
  alias Venture.Slide.Chat
  alias Venture.Slide.Title

  @derive {Jason.Encoder, except: [:next, :notes]}
  defstruct type: "slide", location: %{story: "", index: 0}, next: nil, content: "", notes: "",
            background: nil, class: nil, attribution: nil, align: ""

  defmacro __using__(_opts) do
    quote do
      alias unquote(__MODULE__)
      alias Venture.Slide.Fork
      alias Venture.Slide.Poll
      alias Venture.Slide.Chat
      alias Venture.Slide.Title
    end
  end

  def with_presenter_data(slide) do
    Map.from_struct(slide)
  end

  def for(%{type: "fork"} = map) do
    struct(Fork, map)
  end

  def for(%{type: "poll"} = map) do
    struct(Poll, map)
  end

  def for(%{type: "chat"} = map) do
    struct(Chat, map)
  end

  def for(%{type: "title"} = map) do
    struct(Title, map)
  end

  def for(%{} = map) do
    struct(__MODULE__, map)
  end

end
