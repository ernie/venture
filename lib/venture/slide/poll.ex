defmodule Venture.Slide.Poll do

  defstruct location: %{story: "", index: 0}, next: nil, content: "", notes: "",
            options: [], background: nil, class: nil, attribution: nil,
            align: ""

  defimpl Poison.Encoder, for: __MODULE__ do

    def encode(poll, options) do
      Poison.Encoder.Map.encode(
        Map.from_struct(poll) |> Dict.put(:type, "poll"), options
      )
    end

  end

end
