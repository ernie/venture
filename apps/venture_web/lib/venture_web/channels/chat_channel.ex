defmodule VentureWeb.ChatChannel do
  use VentureWeb, :channel

  alias Venture.Nicks
  alias VentureWeb.Presence

  @impl true
  def join("chat", %{"name" => name}, socket) do
    send self(), {:after_join, name}
    Nicks.put(socket, nil)
    { :ok, %{}, assign(socket, :activity, []) }
  end

  @impl true
  def join("chat", _auth_msg, socket) do
    send self(), {:after_join, nil}
    Nicks.put(socket, nil)
    { :ok, %{}, assign(socket, :activity, []) }
  end

  @impl true
  def handle_in("message", %{"content" => content}, socket) do
    handle_message(String.trim(content), socket)
  end

  @impl true
  def handle_in("nick", %{"name" => name}, socket = %{assigns: %{name: prev}})
      when name == prev
  do
    push socket, "nick_set", %{id: socket.id, name: name}
    {:noreply, socket}
  end

  @impl true
  def handle_in(
    "nick", %{"name" => name}, socket = %{assigns: %{name: prev}}
  ) do
    case throttle(socket) do
      {:ok, socket} ->
        case Nicks.put(socket, name) do
          { :ok, processed } -> push socket,
                                     "nick_set",
                                     %{id: socket.id, name: processed}
                                {:ok, _} = Presence.update(socket, socket.id, %{ id: socket.id, name: processed })
                                broadcast! socket,
                                           "nick",
                                           %{
                                             prev: prev,
                                             name: processed,
                                             id: socket.id
                                           }
                                { :noreply, assign(socket, :name, processed) }
           { :error, reason } -> push socket,
                                      "nick_error",
                                      %{type: "error", content: reason}
                                 {:noreply, socket}
        end
      {:throttle, socket} ->
        push socket, "message", %{type: "error", content: "Slow down, friend."}
        {:noreply, socket}
    end
  end

  @impl true
  def handle_in(_event, _msg, socket) do
    {:noreply, socket}
  end

  @impl true
  def handle_info({:after_join, nil}, socket) do
    {:ok, _} = Presence.track(socket, socket.id, %{ id: socket.id, name: nil })
    push(socket, "presence_state", Presence.list(socket))
    broadcast! socket, "join", %{name: nil, id: socket.id}
    welcome(socket, nil)
    {:noreply, assign(socket, :name, nil)}
  end

  @impl true
  def handle_info({:after_join, name}, socket) do
    case Nicks.put(socket, name) do
      { :ok, processed } -> push socket,
                                 "nick_set",
                                 %{id: socket.id, name: processed}
                            {:ok, _} =
                              Presence.track(socket, socket.id, %{ id: socket.id, name: processed })
                              push(socket, "presence_state", Presence.list(socket))
                            broadcast! socket,
                                       "nick",
                                       %{
                                         prev: nil,
                                         name: processed,
                                         id: socket.id
                                       }
                            welcome(socket, processed)
             { :noreply, assign(socket, :name, name) }
      { :error, reason } -> push socket,
                                 "nick_error",
                                 %{type: "error", content: reason}
                            {:ok, _} =
                              Presence.track(socket, socket.id, %{ id: socket.id, name: nil })
                              push(socket, "presence_state", Presence.list(socket))
                            # broadcast! socket,
                            #            "join", %{name: nil, id: socket.id}
                            welcome(socket, nil)
                            {:noreply, assign(socket, :name, nil)}
    end
  end

  defp handle_message(_content, socket = %{assigns: %{name: nil}}) do
    push socket, "message", %{type: "error", content: "No nick"}
    {:noreply, socket}
  end

  defp handle_message(content, socket = %{assigns: %{name: _name}})
       when byte_size(content) < 1 do
    push socket,
         "message",
         %{type: "error", content: "Maybe you should try typing something?"}
    {:noreply, socket}
  end

  defp handle_message("/" <> command, socket) do
    [command, arg] = case String.split(command, " ", parts: 2) do
      [c, a] -> [c, String.trim(a)]
      [c]    -> [c, ""]
    end
    process_command(command, arg, socket)
  end

  defp handle_message(content, socket) when byte_size(content) > 140 do
    push socket,
         "message",
         %{
           type: "error",
           content: "If it's too long for a tweet, it's too long for chat."
         }
    {:noreply, socket}
  end

  defp handle_message(content, socket = %{assigns: %{name: name}}) do
    case throttle(socket) do
      {:ok, socket} ->
        broadcast! socket, "message", %{sender: name, content: content}
        {:noreply, socket}
      {:throttle, socket} ->
        push socket, "message", %{type: "error", content: "Slow down, friend."}
        {:noreply, socket}
    end
  end

  defp process_command("me", arg, socket) when byte_size(arg) > 140 do
    push socket,
         "message",
         %{
           type: "error",
           content: "If it's too long for a tweet, it's too long for chat."
         }
    {:noreply, socket}
  end

  defp process_command("me", arg, socket = %{assigns: %{name: name}})
       when byte_size(arg) > 0
  do
    case throttle(socket) do
      {:ok, socket} ->
        broadcast! socket,
                   "message",
                   %{type: "emote", sender: name, content: arg}
        {:noreply, socket}
      {:throttle, socket} ->
        push socket, "message", %{type: "error", content: "Slow down, friend."}
        {:noreply, socket}
    end
  end

  defp process_command("me", _arg, socket) do
    push socket, "message", %{type: "error", content: "/me requires text"}
    {:noreply, socket}
  end

  defp process_command("msg", arg, socket) do
    case nick_and_message(arg) do
      [to, msg] -> msg(to, msg, socket)
      [_to]     ->
        push socket,
             "message",
             %{type: "error", content: "Did you mean to say something?"}
        {:noreply, socket}
    end
  end

  defp process_command("nick", name, socket) do
    handle_in("nick", %{"name" => name}, socket)
  end

  defp process_command("help", _arg, socket) do
    push socket,
         "message",
         %{
           type: "system",
           content: """
           Available commands:

           /help                  View this message.
           /me <emote>            Express yourself.
           /msg <nick> <message>  Private message. Use quotes if needed.
           /nick <new_nick>       Make yourself known. No quotes.
           /lurk                  Slip back into the shadows.
           """
         }
    {:noreply, socket}
  end

  defp process_command("lurk", _arg, socket) do
    handle_in("nick", %{"name" => nil}, socket)
  end

  defp process_command(cmd, _arg, socket) do
    push socket, "message", %{type: "error", content: "Unknown command: #{cmd}"}
    {:noreply, socket}
  end

  defp msg(_to, msg, socket) when byte_size(msg) > 140 do
    push socket,
         "message",
         %{
           type: "error",
           content: "If it's too long for a tweet, it's too long for chat."
         }
    {:noreply, socket}
  end

  defp msg(to, msg, socket = %{id: id, assigns: %{name: name}}) do
    case Nicks.socket(to) do
      nil ->
        push socket, "message", %{type: "error", content: "No such user: #{to}"}
      _to_socket = %{id: to_id} when to_id == id ->
        push socket, "message",
                     %{type: "error", content: "Talking to ourselves, are we?"}
      to_socket ->
        case throttle(socket) do
          {:ok, socket} ->
            push socket, "message",
                         %{
                           type: "priv_out", sender: name, recipient: to,
                           content: msg
                         }
            push to_socket, "message",
                            %{
                              type: "priv_in", sender: name, recipient: to,
                              content: msg
                            }
          {:throttle, socket} ->
            push socket, "message",
                         %{type: "error", content: "Slow down, friend."}
            {:noreply, socket}
        end
    end
    {:noreply, socket}
  end

  defp nick_and_message("\"" <> rest) do
    String.split(rest, ~r{"\s+}, parts: 2)
  end

  defp nick_and_message("'" <> rest) do
    String.split(rest, ~r{'\s+}, parts: 2)
  end

  defp nick_and_message(arg) do
    String.split(arg, " ", parts: 2)
  end

  defp welcome(socket, nil) do
    push socket,
         "message",
         %{
           type: "system",
           content: """
           Welcome! Set a nickname to get started.
           Once signed in, type /help for help.
           """
         }
  end

  defp welcome(socket, name) do
    push socket,
         "message",
         %{
           type: "system",
           content: """
           Welcome, #{name}! Type /help for help.
           """
         }
  end

  defp throttle(socket) do
    current = :erlang.system_time
    activity = Enum.filter(
      socket.assigns.activity,
      fn time -> time > current - 5000000000 end
    )
    case length(activity) >= 5 do
      true  -> {:throttle, assign(socket, :activity, activity)}
      false -> {:ok, assign(socket, :activity, [current | activity])}
    end
  end

  @impl true
  def terminate(_reason, %{id: id, assigns: %{name: name}}) do
    name = Nicks.delete(id)
    VentureWeb.Endpoint.broadcast!(
      "chat", "leave", %{id: id, name: name}
    )
    :ok
  end

end
