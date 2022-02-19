defmodule VentureWeb.PresentationChannelTest do
  use VentureWeb.ChannelCase

  alias VentureWeb.PresentationChannel

  @uuid "cfa88078-8653-11e5-9280-3c15c2d1f3ac"

  @moduletag presenter: true

  defp subscribe(socket) do
    case subscribe_and_join(
      socket, PresentationChannel, "presentation"
    ) do
      result = {:ok, _reply, _socket} -> result
      {:error, reply} -> {:error, reply, nil}
    end
  end

  defp presenter_push(event, payload \\ %{}) do
    presenter = socket(
      VentureWeb.UserSocket, "user:p-#{@uuid}", %{uuid: "p-#{@uuid}", presenter: true}
    )
    {:ok, _reply, socket} = subscribe(presenter)
    push socket, event, payload
    Process.unlink socket.channel_pid
    ref = leave(socket)
    assert_reply ref, :ok
  end

  setup context do
    socket = socket(
      VentureWeb.UserSocket, "user:#{@uuid}", %{uuid: @uuid, presenter: context[:presenter]}
    )
    Venture.Presentation.reset
    Venture.Selections.reset([])
    {status, reply, socket} = subscribe(socket)
    {:ok, status: status, reply: reply, socket: socket}
  end

  @tag presenter: false
  test "doesn't crash on unknown events", %{socket: socket} do
    push socket, "gobbledygook", %{"some" => "data"}
    :timer.sleep(100) # We need to give the channel time to crash
  end

  @tag presenter: false
  test "receives slides without notes or next data" do
    presenter_push "next"
    assert_push "slide", %{slide: %Venture.Slide.Poll{}}
    refute_push "slide", %{slide: %{notes: _, next: _}}
  end

  @tag presenter: false
  test "does not receive connections" do
    Venture.Connections.connect(socket(VentureWeb.UserSocket))
    refute_receive %Phoenix.Socket.Message{event: "connections"}
  end

  @tag presenter: false
  test "does not advance slide on next", %{socket: socket} do
    push socket, "next"
    :timer.sleep(100)
    assert Venture.Presentation.current_slide.location ==
             %{story: "main", index: 0}
  end

  @tag presenter: false
  test "does not reverse slide on prev", %{socket: socket} do
    Venture.Presentation.next
    push socket, "prev"
    :timer.sleep(100)
    assert Venture.Presentation.current_slide.location ==
             %{story: "main", index: 1}
  end

  @tag presenter: false
  test "does not reset to first slide on reset", %{socket: socket} do
    Venture.Presentation.go("main:2")
    push socket, "reset"
    :timer.sleep(100)
    assert Venture.Presentation.current_slide.location ==
             %{story: "main", index: 2}
  end

  @tag presenter: false
  test "does nothing when selecting on a non-selection slide",
       %{socket: socket} do
    push socket, "select", %{"option" => "option1"}
    :timer.sleep(100)
    assert Venture.Selections.current == %{}
  end

  @tag presenter: false
  test "does nothing when selecting a non-existent option", %{socket: socket} do
    Venture.Presentation.go("main:2")
    push socket, "select", %{"option" => "nonexistent"}
    :timer.sleep(100)
    assert Venture.Selections.current == %{"path1:0" => 0, "path2:0" => 0}
  end

  @tag presenter: false
  test "receives selections on poll slide as attendee" do
    presenter_push "next"
    assert_push "slide", %{selections: %{"option 1" => 0, "option 2" => 0}}
  end

  @tag presenter: false
  test "receives selections on fork slide as attendee" do
    Venture.Presentation.go("main:1")
    presenter_push "next"
    assert_broadcast "slide", %{selections: %{"path1:0" => 0, "path2:0" => 0}}
  end

  @tag presenter: false
  test "increments count when selecting an option", %{socket: socket} do
    Venture.Presentation.go("main:2")
    push socket, "select", %{"option" => "path1:0"}
    :timer.sleep(100)
    assert Venture.Selections.current == %{"path1:0" => 1, "path2:0" => 0}
  end

  @tag presenter: nil
  test "does not authorize with no presenter assign",
       %{socket: socket, status: status, reply: reply} do
    assert socket == nil
    assert status == :error
    assert reply.reason == "unauthorized"
  end

  test "advances slide on next", %{socket: socket} do
    push socket, "next"
    assert_broadcast "slide", %{slide: %{location: %{story: "main", index: 1}}}
  end

  test "reverses slide on prev", %{socket: socket} do
    Venture.Presentation.next
    push socket, "prev"
    assert_broadcast "slide", %{slide: %{location: %{story: "main", index: 0}}}
  end

  test "resets to first slide on reset", %{socket: socket} do
    Venture.Presentation.go("main:2")
    push socket, "reset"
    assert_broadcast "slide", %{slide: %{location: %{story: "main", index: 0}}}
  end

  test "does nothing when selecting on a non-selection slide as presenter",
       %{socket: socket} do
    push socket, "select", %{"option" => "option1"}
    :timer.sleep(100)
    assert Venture.Selections.current == %{}
  end

  test "does nothing when selecting a non-existent option as presenter",
       %{socket: socket} do
    Venture.Presentation.go("main:2")
    push socket, "select", %{"option" => "nonexistent"}
    :timer.sleep(100)
    assert Venture.Selections.current == %{"path1:0" => 0, "path2:0" => 0}
  end

  test "receives selections on poll slide", %{socket: socket} do
    push socket, "next"
    assert_broadcast "slide", %{selections: %{"option 1" => 0, "option 2" => 0}}
  end

  test "receives selections on fork slide", %{socket: socket} do
    Venture.Presentation.go("main:1")
    push socket, "next"
    assert_broadcast "slide", %{selections: %{"path1:0" => 0, "path2:0" => 0}}
  end

  test "follows the path when selecting an option on fork", %{socket: socket} do
    Venture.Presentation.go("main:2")
    push socket, "select", %{"option" => "path1:0"}
    assert_broadcast "slide", %{slide: %{location: %{story: "path1", index: 0}}}
  end

  test "receives slides with notes and next data", %{socket: socket} do
    push socket, "next"
    assert_push "slide",
                %{
                  slide: %{
                    notes: "Here are some presenter notes for slide 2.",
                    next: %Venture.Slide.Fork{}
                  }
                }
  end

  test "receives connection counts", %{socket: socket} do
    Venture.Connections.connect(socket)
    assert_push "connections",
                %{presenters: _presenter_count, attendees: _attendee_count}
  end

end
