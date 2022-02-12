defmodule Venture.Slide.Poll do

  defstruct location: %{story: "", index: 0}, next: nil, content: "", notes: "",
            options: [], background: nil, class: nil, attribution: nil,
            align: ""

  defimpl Jason.Encoder, for: __MODULE__ do

    def encode(poll, options) do
      Jason.Encode.map(
        Map.from_struct(poll) |> Map.put(:type, "poll"), options
      )
    end

  end

end
