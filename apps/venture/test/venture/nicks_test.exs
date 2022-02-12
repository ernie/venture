defmodule Venture.NicksTest do
  use ExUnit.Case
  import Phoenix.ChannelTest

  alias Venture.Nicks

  @uuid "cfa88078-8653-11e5-9280-3c15c2d1f3ac"
  @endpoint VentureWeb.Endpoint

  setup context do
    Nicks.reset
    socket = socket(VentureWeb.UserSocket, "user:#{@uuid}", %{uuid: @uuid})
    on_exit(context, fn -> Nicks.reset end)
    {:ok, socket: socket}
  end

  test "puts a socket and name", %{socket: socket} do
    assert Nicks.put(socket, "Ernie") == {:ok, "Ernie"}
  end

  test "prevents assigning the same name to two sockets", %{socket: socket} do
    assert Nicks.put(socket, "Ernie") == {:ok, "Ernie"}
    second_socket = socket(VentureWeb.UserSocket, "user:another-uuid", %{uuid: "another-uuid"})
    assert Nicks.put(second_socket, "Ernie") ==
      {:error, "'Ernie' is already taken."}
  end

  test "retrieves socket by name", %{socket: socket} do
    Nicks.put(socket, "Ernie")
    assert Nicks.socket("Ernie") == socket
    assert Nicks.socket("Bob") == nil
  end

  test "allows removing nick for a given socket", %{socket: socket} do
    assert Nicks.put(socket, nil) == {:ok, nil}
  end

  test "allows deleting a given socket", %{socket: socket} do
    Nicks.put(socket, "Ernie")
    assert Nicks.delete(socket.id) == "Ernie"
    second_socket = socket(VentureWeb.UserSocket, "user:another-uuid", %{uuid: "another-uuid"})
    assert Nicks.put(second_socket, "Ernie") == {:ok, "Ernie"}
  end

  test "returns a full list of nicks via all", %{socket: socket} do
    assert Nicks.all == []
    Nicks.put(socket, "Ernie")
    [nick] = Nicks.all
    assert nick.id == socket.id
    assert nick.name == "Ernie"
  end

  test "resets the nick list via reset", %{socket: socket} do
    Nicks.put(socket, "Ernie")
    assert length(Nicks.all) == 1
    Nicks.reset
    assert length(Nicks.all) == 0

  end

end
