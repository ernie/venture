defmodule VentureWeb.UserSocket do
  use Phoenix.Socket

  channel "presentation", VentureWeb.PresentationChannel
  channel "chat", VentureWeb.ChatChannel

  @impl true
  def connect(%{"key" => key}, socket, _connect_info) do
    if presenter_key?(key) do
      {
        :ok,
        socket
        |> assign(:uuid, UUID.uuid1())
        |> assign(:presenter, true)
      }
    else
      :error
    end
  end

  @impl true
  def connect(_params, socket, _connect_info) do
    {
      :ok,
      socket
      |> assign(:uuid, UUID.uuid1())
      |> assign(:presenter, false)
    }
  end

  @impl true
  def id(socket), do: "user:#{socket.assigns.uuid}"

  defp presenter_key?(key) do
    Application.get_env(:venture, :presenter_key) == key
  end
end
