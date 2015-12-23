defmodule Venture.Slide do
  alias Venture.Slide.Fork
  alias Venture.Slide.Poll
  alias Venture.Slide.Chat
  alias Venture.Slide.Title

  defstruct location: %{story: "", index: 0}, next: nil, content: "", notes: "",
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

  defimpl Poison.Encoder, for: __MODULE__ do

    def encode(fork, options) do
      Poison.Encoder.Map.encode(
        Map.from_struct(fork) |> Dict.put(:type, "slide"), options
      )
    end

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
