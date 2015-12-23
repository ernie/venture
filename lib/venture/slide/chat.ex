defmodule Venture.Slide.Chat do

  defstruct location: %{story: "", index: 0}, next: nil, content: "", notes: "",
            background: nil, class: nil, attribution: nil, align: ""

  defimpl Poison.Encoder, for: __MODULE__ do

    def encode(chat, options) do
      Poison.Encoder.Map.encode(
        Map.from_struct(chat) |> Dict.put(:type, "chat"), options
      )
    end

  end

end
