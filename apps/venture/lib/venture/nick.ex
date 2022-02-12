defmodule Venture.Nick do

  defstruct id: nil, name: nil

  defimpl Jason.Encoder, for: __MODULE__ do

    def encode(nick, options) do
      Jason.Encode.map(
        Map.from_struct(nick), options
      )
    end

  end

end
