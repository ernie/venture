defmodule Venture.Slide.Chat do

  @derive {Jason.Encoder, except: [:next, :notes]}
  defstruct type: "chat", location: %{story: "", index: 0}, next: nil, content: "", notes: "",
            background: nil, class: nil, attribution: nil, align: ""

end
