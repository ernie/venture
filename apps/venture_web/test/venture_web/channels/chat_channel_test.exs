defmodule VentureWeb.ChatChannelTest do
  use VentureWeb.ChannelCase
  alias VentureWeb.ChatChannel

  @uuid "cfa88078-8653-11e5-9280-3c15c2d1f3ac"

  @moduletag name: "Ernie"

  defp push_message(socket, message) do
    push socket, "message", %{"content" => message}
  end

  defp subscribe(socket, nil) do
    case subscribe_and_join(socket, ChatChannel, "chat") do
      result = {:ok, _reply, _socket} -> result
      {:error, reply} -> {:error, reply, nil}
    end
  end

  defp subscribe(socket, name) do
    case subscribe_and_join(
      socket, ChatChannel, "chat", %{ "name" => name }
    ) do
      result = {:ok, _reply, _socket} -> result
      {:error, reply} -> {:error, reply, nil}
    end
  end

  setup context do
    socket = socket(VentureWeb.UserSocket, "user:#{@uuid}", %{uuid: @uuid})
    {status, reply, socket} = subscribe(socket, context[:name])
    case socket do
      nil -> nil
      _   -> on_exit(context, fn -> leave(socket) end)
    end
    {:ok, status: status, reply: reply, socket: socket}
  end

  @tag name: nil
  test "name can be nil", %{socket: socket} do
    assert socket.assigns.name == nil
  end

  @tag name: nil
  test "stores a 'nick' for nil-named users", %{} do
    [nick] = Venture.Nicks.all
    assert nick.id == "user:#{@uuid}"
    assert nick.name == nil
  end

  @tag name: nil
  test "doesn't crash on unknown events", %{socket: socket} do
    push socket, "gobbledygook", %{"some" => "data"}
    :timer.sleep(100) # We need to give the channel time to crash
  end

  @tag name: nil
  test "doesn't allow messages from unnamed users", %{socket: socket} do
    push_message socket, "message"
    assert_push "message", %{type: "error", content: "No nick"}
  end

  test "stores a nick for a named user", %{} do
    [nick] = Venture.Nicks.all
    assert nick.id == "user:#{@uuid}"
    assert nick.name == "Ernie"
  end

  test "allows messages from named users", %{socket: socket} do
    push_message socket, "message"
    assert_broadcast "message", %{content: "message", sender: "Ernie"}
  end

  test "disallows empty messages", %{socket: socket} do
    push_message socket, ""
    assert_push "message",
                %{
                  type: "error",
                  content: "Maybe you should try typing something?"
                }
  end

  test "disallows messages consisting only of whitespace", %{socket: socket} do
    push_message socket, "   "
    assert_push "message",
                %{
                  type: "error",
                  content: "Maybe you should try typing something?"
                }
  end

  test "disallows overly-long messages", %{socket: socket} do
    push_message socket, "This is a really long message that is over 140 characters long and it should result in an error because it is too long for a message, really, isn't it?"
    assert_push "message",
                %{
                  type: "error",
                  content: "If it's too long for a tweet, it's too long for chat."
                }
  end

  test "allows emotes from named users", %{socket: socket} do
    push_message socket, "/me emotes"
    assert_broadcast "message",
                     %{type: "emote", content: "emotes", sender: "Ernie"}
  end

  test "requires text for emotes", %{socket: socket} do
    push_message socket, "/me"
    assert_push "message",
                     %{type: "error", content: "/me requires text"}
  end

  test "disallows overly-long emotes", %{socket: socket} do
    push_message socket, "/me This is a really long emote that is over 140 characters long and it should result in an error because it is too long for an emote, really, isn't it?"
    assert_push "message",
                %{
                  type: "error",
                  content: "If it's too long for a tweet, it's too long for chat."
                }
  end

  test "sends help response to /help", %{socket: socket} do
    push_message socket, "/help"
    assert_push "message", %{content: "Available commands:" <> _more}
  end

  test "changes nick via /nick", %{socket: socket} do
    push_message socket, "/nick Bert"
    assert_push "nick", %{name: "Bert", prev: "Ernie"}
    push_message socket, "/nick Ernie"
    assert_push "nick", %{name: "Ernie", prev: "Bert"}
  end

  test "doesn't broadcast nick change if the same nick", %{socket: socket} do
    assert_receive %Phoenix.Socket.Broadcast{
      event: "nick", payload: %{name: "Ernie"}
    }
    push_message socket, "/nick Ernie"
    refute_receive %Phoenix.Socket.Broadcast{
      event: "nick", payload: %{name: "Ernie"}
    }
  end

  test "allows multi-word nicks", %{socket: socket} do
    push_message socket, "/nick Ernie Miller"
    assert_push "nick", %{name: "Ernie Miller", prev: "Ernie"}
  end

  test "requires nickname be between 1 and 16 bytes", %{socket: socket} do
    push_message socket, "/nick"
    assert_push "nick_error",
                %{
                  content: "Nickname must be between 1 and 16 bytes long.",
                  type: "error"
                }
    push_message socket, "/nick Ernie with the big name"
    assert_push "nick_error",
                %{
                  content: "Nickname must be between 1 and 16 bytes long.",
                  type: "error"
                }
  end

  test "doesn't allow duplicate nicks", %{socket: socket} do
    bert = socket(VentureWeb.UserSocket, "user:b-#{@uuid}", %{uuid: "b-#{@uuid}"})
    {:ok, _reply, bert} = subscribe(bert, "Bert")
    push_message socket, "/nick Bert"
    assert_push "nick_error",
                %{content: "'Bert' is already taken.", type: "error"}
    Process.unlink(bert.channel_pid)
    ref = leave(bert)
    assert_reply ref, :ok
  end

  test "allows private messages", %{socket: socket} do
    bert = socket(VentureWeb.UserSocket, "user:b-#{@uuid}", %{uuid: "b-#{@uuid}"})
    {:ok, _reply, bert} = subscribe(bert, "Bert")
    push_message socket, "/msg Bert hello"
    assert_push "message",
                %{
                  type: "priv_out",
                  content: "hello",
                  recipient: "Bert",
                  sender: "Ernie"
                }
    assert_push "message",
                %{
                  type: "priv_in",
                  content: "hello",
                  recipient: "Bert",
                  sender: "Ernie"
                }
    Process.unlink(bert.channel_pid)
    ref = leave(bert)
    assert_reply ref, :ok
  end

  test "disallows overly-long private messages", %{socket: socket} do
    bert = socket(VentureWeb.UserSocket, "user:b-#{@uuid}", %{uuid: "b-#{@uuid}"})
    {:ok, _reply, bert} = subscribe(bert, "Bert")
    push_message socket, "/msg Bert This is a really long message that is over 140 characters long and it should result in an error because it is too long for a message, really, isn't it?"
    assert_push "message",
                %{
                  type: "error",
                  content: "If it's too long for a tweet, it's too long for chat."
                }
    Process.unlink(bert.channel_pid)
    ref = leave(bert)
    assert_reply ref, :ok
  end


  test "allows private messages to multiword-name users", %{socket: socket} do
    bert = socket(VentureWeb.UserSocket, "user:b-#{@uuid}", %{uuid: "b-#{@uuid}"})
    {:ok, _reply, bert} = subscribe(bert, "Bert Myers")
    push_message socket, "/msg 'Bert Myers' hello"
    assert_push "message",
                %{
                  type: "priv_out",
                  content: "hello",
                  recipient: "Bert Myers",
                  sender: "Ernie"
                }
    assert_push "message",
                %{
                  type: "priv_in",
                  content: "hello",
                  recipient: "Bert Myers",
                  sender: "Ernie"
                }
    Process.unlink(bert.channel_pid)
    ref = leave(bert)
    assert_reply ref, :ok
  end

  test "errors on private messages to nonexistent users", %{socket: socket} do
    push_message socket, "/msg Bert hello"
    assert_push "message",
                %{type: "error", content: "No such user: Bert"}
  end

  test "lurks on /lurk", %{socket: socket} do
    push_message socket, "/lurk"
    assert_push "nick", %{name: nil, prev: "Ernie"}
  end

  test "errors on an unknown command", %{socket: socket} do
    push_message socket, "/frobulate"
    assert_push "message",
                %{type: "error", content: "Unknown command: frobulate"}
  end

  test "allows up to 5 actions in rapid succession", %{socket: socket} do
    push_message socket, "hello"
    push_message socket, "hello"
    push_message socket, "hello"
    push_message socket, "hello"
    push_message socket, "hello"
    refute_receive %Phoenix.Socket.Message{
      event: "message", payload: %{type: "error", content: "Slow down, friend."}
    }
  end

  test "throttles a 6th message after 5 rapid ones", %{socket: socket} do
    push_message socket, "hello"
    push_message socket, "hello"
    push_message socket, "hello"
    push_message socket, "hello"
    push_message socket, "hello"
    push_message socket, "hello"
    assert_push "message", %{type: "error", content: "Slow down, friend."}
  end

  test "broadcasts a leave event when client disconnects" do
    bert = socket(VentureWeb.UserSocket, "user:b-#{@uuid}", %{uuid: "b-#{@uuid}"})
    {:ok, _reply, bert} = subscribe(bert, "Bert")
    Process.unlink(bert.channel_pid)
    ref = leave(bert)
    assert_reply ref, :ok
    assert_broadcast "leave", %{name: "Bert"}
  end

end
