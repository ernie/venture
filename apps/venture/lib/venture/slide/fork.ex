defmodule Venture.Slide.Fork do

  @derive {Jason.Encoder, except: [:next, :notes]}
  defstruct type: "fork", location: %{story: "", index: 0}, next: nil, content: "", notes: "",
            paths: [], background: nil, class: nil, attribution: nil, align: ""

end
