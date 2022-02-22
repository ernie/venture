defmodule Venture.Stories do
  use Venture.Slide

  def load(presentation_dir) do
    read_files(presentation_dir)
    |> expand_forks()
    |> expand_nexts()
  end

  defp read_files(presentation_dir) do
    stories_path = "#{presentation_dir}/stories"
    for path <- Path.wildcard("#{stories_path}/*.story"),
        content = process_file(path, stories_path),
        story_name = Path.basename(path, ".story"),
        into: %{}
    do
      { story_name, build_slides(content, story_name) }
    end
  end

  defp process_file(path, stories_dir) do
    do_process_file(path, stories_dir, [])
  end

  defp do_process_file(path, stories_dir, history) do
    story = Path.basename(path, ".story")
    case story in history do
      true  ->
        raise """

        Recursive include: #{story}
        Check includes in #{Enum.join(history, ", ")}
        """
      false ->
        {:ok, content} = File.read(path)
        Regex.replace(
          ~r/^\\{6,}\s*include\s+([^\s]+).*$/m,
          content,
          fn _, included ->
            "\\\\\\\\\\\\\n\n#{
              do_process_file(
                "#{stories_dir}/#{included}.story",
                stories_dir,
                [story | history]
              )
            }\n\n\\\\\\\\\\\\"
          end
        )
    end
  end

  defp expand_forks(original_stories) do
    for {name, stories} <- original_stories,
        into: %{}
    do
      {name, Enum.map(stories, &expand_fork(&1, original_stories))}
    end
  end

  defp expand_fork(%Fork{} = slide, stories) do
    %Fork{slide | paths: Enum.map(
      slide.paths, fn ref -> dereference(ref, stories) end
    )}
  end

  defp expand_fork(slide, _stories) do
    slide
  end

  defp expand_nexts(original_stories) do
    for {name, stories} <- original_stories,
        into: %{}
    do
      {name, Enum.map(stories, &expand_next(&1, original_stories))}
    end
  end

  defp expand_next(%{next: next} = slide, stories) when is_bitstring(next) do
    %{slide | next: dereference(next, stories)}
  end

  defp expand_next(%{
    location: %{story: story, index: index},
    next: nil} = slide, stories
  ) do
    next_slide = case Enum.fetch(stories[story], index + 1) do
      {:ok, slide} -> slide
      _ -> nil
    end
    %{slide | next: next_slide}
  end

  defp dereference(ref, stories) do
    [story, index] = case String.split(ref, ":", trim: true) do
                       [s, i] ->
                         {idx, _rem} = Integer.parse(i)
                         [s, idx]
                       [s] -> [s, 0]
                     end
    Enum.fetch!(stories[story], index)
  end

  # Slides are separated by a line consisting of at least six backslashes
  defp build_slides(content, key) do
    String.split(content, ~r/\s*?^\\{6,}\n\s*/m, trim: true)
    |> Enum.with_index()
    |> Enum.map(&build_slide(&1, key))
  end

  # A slide with YAML front matter
  defp build_slide({ << "---\n", data :: binary >>, index }, key) do
    [yaml, content] = case String.split(data, ~r{\s*?\n---+\n?\s*}, parts: 2) do
      [yaml, content] -> [yaml, String.trim(content, "\n")]
      [just_yaml] -> [just_yaml, ""]
    end
    meta = YamlElixir.read_from_string!(yaml)
           |> Enum.into(
                %{type: "slide", location: %{story: key, index: index}},
                fn { k, v } -> { String.to_atom(k), v } end
              )
    Slide.for(Map.put(meta, :content, content))
  end

  # A slide without YAML front matter
  defp build_slide({ content, index }, key) do
    Slide.for(%{
      type: "slide",
      location: %{story: key, index: index},
      content: String.trim(content, "\n")
    })
  end

end
