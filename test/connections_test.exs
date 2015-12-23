defmodule Venture.ConnectionsTest do
  use ExUnit.Case
  use Phoenix.ChannelTest

  alias Venture.Connections

  @uuid "cfa88078-8653-11e5-9280-3c15c2d1f3ac"
  @endpoint Venture.Endpoint

  @token Application.get_env(:venture, :presenter_token)

  setup context do
    Connections.reset
    socket = socket(
      "user:#{@uuid}", %{uuid: @uuid, presenter: !!context[:presenter]}
    )
    on_exit(context, fn -> Connections.reset end)
    {:ok, socket: socket}
  end

  test "increments attendee count on non-presenter socket", %{socket: socket} do
    reply = Connections.connect(socket)
    assert reply.attendees == 1
    assert reply.presenters == 0
  end

  @tag presenter: true
  test "increments presenter count on presenter socket", %{socket: socket} do
    reply = Connections.connect(socket)
    assert reply.attendees == 0
    assert reply.presenters == 1
  end

  test "returns current counts on current" do
    assert Connections.current == %{ attendees: 0, presenters: 0 }
  end

  test "resets connection count on reset", %{socket: socket} do
    Connections.connect(socket)
    assert Connections.reset == :ok
    assert Connections.current == %{ attendees: 0, presenters: 0 }
  end

  test "decrements connection count on disconnect", %{socket: socket} do
    Connections.connect(socket)
    Connections.disconnect(socket)
    assert Connections.current == %{ attendees: 0, presenters: 0 }
  end

  @tag presenter: true
  test "broadcasts to presenters when connections change", %{socket: socket} do
    subscribe_and_join(
      socket, Venture.PresentationChannel, "presentation:presenter"
    )
    attendee = socket(
      "user:a-#{@uuid}", %{uuid: "a-#{@uuid}", presenter: false}
    )
    assert_broadcast "connections", %{ attendees: 0, presenters: 1 }
    Connections.connect(attendee)
    assert_broadcast "connections", %{ attendees: 1, presenters: 1 }
    Connections.disconnect(attendee)
    assert_broadcast "connections", %{ attendees: 0, presenters: 1 }
  end

end
