defmodule Venture.Slide.Chat do

  defstruct location: %{story: "", index: 0}, next: nil, content: "", notes: "",
            background: nil, class: nil, attribution: nil, align: ""

  defimpl Jason.Encoder, for: __MODULE__ do

    def encode(chat, options) do
      Jason.Encode.map(
        Map.from_struct(chat) |> Map.put(:type, "chat"), options
      )
    end

  end

end
