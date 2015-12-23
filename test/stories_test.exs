defmodule Venture.StoriesTest do
  use ExUnit.Case

  alias Venture.Stories

  @stories_dir Application.get_env(:venture, :stories)

  setup do
    stories = Stories.load(@stories_dir)
    {:ok, stories: stories}
  end

  test "loads a set of stories from a directory", %{stories: stories} do
    assert Enum.map(stories["main"], fn (slide) -> slide.content end) ==
             ["Slide 1", "Slide 2", "Slide 3"]
    assert Enum.map(stories["path1"], fn (slide) -> slide.content end) ==
             ["Welcome to Path 1"]
    assert Enum.map(stories["path2"], fn (slide) -> slide.content end) ==
             ["Welcome to Path 2", "Welcome to the Included Story"]
  end

  test "expands fork slides", %{stories: stories} do
    [_first, _second, fork] = stories["main"]
    assert %Venture.Slide.Fork{} = fork
    Enum.each(
      fork.paths,
      fn (slide) -> assert %Venture.Slide{} = slide end
    )
  end

  test "expands 'next' slides", %{stories: stories} do
    [first | _rest] = stories["main"]
    assert %Venture.Slide.Poll{location: %{story: "main", index: 1}} =
           first.next
    [path1] = stories["path1"]
    assert %Venture.Slide{location: %{story: "path2", index: 0}} = path1.next
  end

  test "includes stories via include directive", %{stories: stories} do
    [includer, included] = stories["path2"]
    assert includer.next == included
    assert included.location == %{story: "path2", index: 1}
  end

end
