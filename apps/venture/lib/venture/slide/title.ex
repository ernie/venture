defmodule Venture.Slide.Title do

  @derive {Jason.Encoder, except: [:next, :notes]}
  defstruct type: "title", location: %{story: "", index: 0}, next: nil, content: "", notes: "",
            background: nil, class: nil, attribution: nil, align: ""

end
