defmodule Venture.Slide.Poll do

  @derive {Jason.Encoder, except: [:next, :notes]}
  defstruct type: "poll", location: %{story: "", index: 0}, next: nil, content: "", notes: "",
            options: [], background: nil, class: nil, attribution: nil,
            align: ""

end
