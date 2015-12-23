defmodule Venture.Slide.Title do

  defstruct location: %{story: "", index: 0}, next: nil, content: "", notes: "",
            background: nil, class: nil, attribution: nil, align: ""

  defimpl Poison.Encoder, for: __MODULE__ do

    def encode(fork, options) do
      Poison.Encoder.Map.encode(
        Map.from_struct(fork) |> Dict.put(:type, "title"), options
      )
    end

  end

end
