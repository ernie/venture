defmodule Venture.DeckTest do
  use ExUnit.Case

  alias Venture.Deck

  test "slide_at? returns true if a slide exists at a location" do
    assert Deck.slide_at?(%{story: "main", index: 0})
  end

  test "slide_at? returns false if a slide does not exist at a location" do
    refute Deck.slide_at?(%{story: "nonexistent", index: 42})
  end

  test "slide_at returns a slide if it exists" do
    slide = Deck.slide_at(%{story: "main", index: 0})
    assert slide.content == "Slide 1"
  end

  test "slide_at returns nil if a slide does not exist" do
    slide = Deck.slide_at(%{story: "nonexistent", index: 42})
    assert slide == nil
  end

end
