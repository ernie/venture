defmodule Venture.PresentationTest do
  use ExUnit.Case

  alias Venture.Presentation
  alias Venture.Deck

  setup context do
    Presentation.reset
    on_exit(context, fn -> Presentation.reset end)
    {:ok, []}
  end

  test "returns its current slide" do
    assert Presentation.current_slide ==
             Deck.slide_at(%{story: "main", index: 0})
  end

  test "advances to next slide" do
    assert Presentation.next == Deck.slide_at(%{story: "main", index: 1})
    assert Presentation.current_slide ==
             Deck.slide_at(%{story: "main", index: 1})
  end

  test "reverts to previous slide" do
    assert Presentation.next == Deck.slide_at(%{story: "main", index: 1})
    assert Presentation.prev == Deck.slide_at(%{story: "main", index: 0})
    assert Presentation.current_slide ==
             Deck.slide_at(%{story: "main", index: 0})
  end

  test "go goes to slide by location string" do
    assert Presentation.go("main:1") ==
             Deck.slide_at(%{story: "main", index: 1})
    assert Presentation.current_slide ==
             Deck.slide_at(%{story: "main", index: 1})
  end

  test "go defaults to index 0 when no index supplied" do
    assert Presentation.go("path1") ==
             Deck.slide_at(%{story: "path1", index: 0})
    assert Presentation.current_slide ==
             Deck.slide_at(%{story: "path1", index: 0})
  end

  test "go does not change slide if invalid location supplied" do
    assert Presentation.go("cromulent") ==
             Deck.slide_at(%{story: "main", index: 0})
    assert Presentation.current_slide ==
             Deck.slide_at(%{story: "main", index: 0})
  end

  test "saves presentation state on crash" do
    Presentation.next
    pid = Process.whereis(Presentation)
    Process.unlink(pid)
    Process.exit(pid, :normal)
    :timer.sleep(100)
    assert Presentation.current_slide ==
             Deck.slide_at(%{story: "main", index: 1})
  end

  test "reset resets presentation to first slide" do
    assert Presentation.next == Deck.slide_at(%{story: "main", index: 1})
    assert Presentation.reset == Deck.slide_at(%{story: "main", index: 0})
    assert Presentation.current_slide ==
             Deck.slide_at(%{story: "main", index: 0})
  end

  test "reset_selections resets selections to zero for current slide" do
    Presentation.go("main:2")
    Venture.Selections.selection(%{id: "socket-id"}, "path1:0")
    assert Venture.Selections.current == %{"path1:0" => 1, "path2:0" => 0}
    Presentation.reset_selections
    assert Venture.Selections.current == %{"path1:0" => 0, "path2:0" => 0}
  end

end
