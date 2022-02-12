defmodule Venture.Slide.Fork do

  defstruct location: %{story: "", index: 0}, next: nil, content: "", notes: "",
            paths: [], background: nil, class: nil, attribution: nil, align: ""

  defimpl Jason.Encoder, for: __MODULE__ do

    def encode(fork, options) do
      Jason.Encode.map(
        Map.from_struct(fork) |> Map.put(:type, "fork"), options
      )
    end

  end

end
