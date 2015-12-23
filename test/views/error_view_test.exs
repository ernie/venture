defmodule Venture.ErrorViewTest do
  use Venture.ConnCase, async: true

  import Phoenix.View

  test "renders 404.json" do
    assert render(Venture.ErrorView, "404.json", []) ==
           %{errors: %{detail: "Page not found"}}
  end

  test "render 500.json" do
    assert render(Venture.ErrorView, "500.json", []) ==
           %{errors: %{detail: "Server internal error"}}
  end

  test "render any other" do
    assert render(Venture.ErrorView, "505.json", []) ==
           %{errors: %{detail: "Server internal error"}}
  end

end
