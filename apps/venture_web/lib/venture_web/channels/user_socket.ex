defmodule VentureWeb.UserSocket do
  use Phoenix.Socket

  channel "presentation", VentureWeb.PresentationChannel
  channel "chat", VentureWeb.ChatChannel

  @impl true
  def connect(%{"key" => key}, socket, _connect_info) do
    cond do
      key == presenter_key() ->
        {
          :ok,
          set_presenter(socket, true)
        }
      key == attendee_key() ->
        {
           :ok,
           set_presenter(socket, false)
        }
      true -> :error
    end
  end

  @impl true
  def connect(_params, _socket, _connect_info) do
    :error
  end

  @impl true
  def id(socket), do: "user:#{socket.assigns.uuid}"

  defp presenter_key() do
    Application.get_env(:venture, :presenter_key)
  end

  defp attendee_key() do
    Application.get_env(:venture, :attendee_key)
  end

  defp set_presenter(socket, is_presenter) do
    socket
    |> assign(:uuid, UUID.uuid1())
    |> assign(:presenter, is_presenter)
  end

end
