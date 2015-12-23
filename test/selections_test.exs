defmodule Venture.SelectionsTest do
  use ExUnit.Case

  alias Venture.Selections

  defp socket(id) do
    %{id: id}
  end

  setup context do
    Selections.reset(["option1", "option2"])
    on_exit(context, fn -> Selections.reset([]) end)
    {:ok, []}
  end

  test "returns current selections" do
    assert Selections.current == %{"option1" => 0, "option2" => 0}
  end

  test "allows selection of an option" do
    assert Selections.selection(socket("zomg"), "option1") ==
             {:ok, %{ "option1" => 1, "option2" => 0 }}
    assert Selections.current == %{"option1" => 1, "option2" => 0}
  end

  test "does nothing on a selection of invalid option" do
    assert Selections.selection(socket("zomg"), "option-none") ==
             {:ok, %{ "option1" => 0, "option2" => 0 }}
    assert Selections.current == %{"option1" => 0, "option2" => 0}
  end

  test "allows changing a selection" do
    assert Selections.selection(socket("zomg"), "option1") ==
             {:ok, %{ "option1" => 1, "option2" => 0 }}
    assert Selections.selection(socket("zomg"), "option2") ==
             {:ok, %{ "option1" => 0, "option2" => 1 }}
    assert Selections.current == %{"option1" => 0, "option2" => 1}
  end

  test "informs if no change was made on a second selection" do
    assert Selections.selection(socket("zomg"), "option1") ==
             {:ok, %{ "option1" => 1, "option2" => 0 }}
    assert Selections.selection(socket("zomg"), "option1") ==
             {:nochange, %{ "option1" => 1, "option2" => 0 }}
    assert Selections.current == %{"option1" => 1, "option2" => 0}
  end

  test "revokes a selection if socket deregisters" do
    assert Selections.selection(socket("zomg"), "option1") ==
             {:ok, %{ "option1" => 1, "option2" => 0 }}
    assert Selections.deregister(socket("zomg")) ==
             %{ "option1" => 0, "option2" => 0 }
    assert Selections.current == %{"option1" => 0, "option2" => 0}
  end

  test "resets selections to a new set of options" do
    assert Selections.reset(["option3", "option4"]) ==
             %{"option3" => 0, "option4" => 0}
    assert Selections.current == %{"option3" => 0, "option4" => 0}
  end

end
