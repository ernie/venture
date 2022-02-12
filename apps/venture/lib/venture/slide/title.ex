defmodule Venture.Slide.Title do

  defstruct location: %{story: "", index: 0}, next: nil, content: "", notes: "",
            background: nil, class: nil, attribution: nil, align: ""

  defimpl Jason.Encoder, for: __MODULE__ do

    def encode(title, options) do
      Jason.Encode.map(
        Map.from_struct(title) |> Map.put(:type, "title"), options
      )
    end

  end

end
