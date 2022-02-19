defmodule VentureWeb.PresentationChannel do
  use VentureWeb, :channel
  use Venture.Slide

  intercept ["slide", "connections"]

  @impl true
  def join(
    "presentation",
    _auth_msg,
    socket = %{assigns: %{presenter: true}}
  ) do
    slide = Venture.Presentation.current_slide
    selections = Venture.Selections.current
    connections = Venture.Connections.connect(socket)
    {
      :ok,
      %{slide: Slide.with_presenter_data(slide), selections: selections, connections: connections},
      socket
    }
  end

  @impl true
  def join(
    "presentation",
    _auth_msg,
    socket = %{assigns: %{presenter: false}}
  ) do
    slide = Venture.Presentation.current_slide
    selections = Venture.Selections.current
    Venture.Connections.connect(socket)
    {
      :ok,
      %{slide: slide, selections: selections},
      socket
    }
  end

  @impl true
  def join("presentation", _auth_msg, _socket) do
    {:error, %{reason: "unauthorized"}}
  end

  @impl true
  def handle_in("next", _msg, socket = %{assigns: %{presenter: true}}) do
    case Venture.Presentation.next do
      nil -> nil
      slide -> broadcast_slide! slide
    end
    {:noreply, socket}
  end

  @impl true
  def handle_in("prev", _msg, socket = %{assigns: %{presenter: true}}) do
    case Venture.Presentation.prev do
      nil -> nil
      slide -> broadcast_slide! slide
    end
    {:noreply, socket}
  end

  @impl true
  def handle_in("reset", _msg, socket = %{assigns: %{presenter: true}}) do
    Venture.Deck.reload
    Venture.Presentation.reset
    broadcast_current_slide!()
    {:noreply, socket}
  end

  @impl true
  def handle_in("reload", _msg, socket = %{assigns: %{presenter: true}}) do
    Venture.Deck.reload
    Venture.Presentation.reset_selections
    broadcast_current_slide!()
    {:noreply, socket}
  end

  @impl true
  def handle_in("select", %{"option" => option}, socket) do
    handle_selection(Venture.Presentation.current_slide, option, socket)
  end

  @impl true
  def handle_in(_event, _msg, socket) do
    {:noreply, socket}
  end

  @impl true
  def handle_out("slide", msg, socket = %{assigns: %{presenter: true}}) do
    push(socket, "slide", %{ msg | slide: Slide.with_presenter_data(msg.slide) })
    {:noreply, socket}
  end

  @impl true
  def handle_out("slide", msg, socket = %{assigns: %{presenter: false}}) do
    push(socket, "slide", msg)
    {:noreply, socket}
  end

  @impl true
  def handle_out("connections", msg, socket = %{assigns: %{presenter: true}}) do
    push(socket, "connections", msg)
    {:noreply, socket}
  end

  @impl true
  def handle_out("connections", _msg, socket = %{assigns: %{presenter: false}}) do
    {:noreply, socket}
  end

  defp broadcast_slide!(%Fork{} = slide) do
    broadcast_slide_with_selections!(slide)
  end

  defp broadcast_slide!(%Poll{} = slide) do
    broadcast_slide_with_selections!(slide)
  end

  defp broadcast_slide!(slide) do
    VentureWeb.Endpoint.broadcast!(
      "presentation", "slide", %{slide: slide}
    )
  end

  defp broadcast_slide_with_selections!(slide) do
    selections = Venture.Selections.current
    VentureWeb.Endpoint.broadcast!(
      "presentation", "slide",
      %{slide: slide, selections: selections}
    )
  end

  defp broadcast_current_slide! do
    broadcast_slide! Venture.Presentation.current_slide
  end

  defp broadcast_selections!(selections) do
    VentureWeb.Endpoint.broadcast!(
      "presentation", "selections", selections
    )
  end

  defp handle_selection(
    %Fork{}, option, socket = %{assigns: %{presenter: true}}
  ) do
    Venture.Presentation.go(option)
    broadcast_current_slide!()
    {:noreply, socket}
  end

  defp handle_selection(%Fork{}, option, socket) do
    do_selection(option, socket)
  end

  defp handle_selection(%Poll{}, option, socket) do
    do_selection(option, socket)
  end

  defp handle_selection(_slide, _option, socket) do
    {:noreply, socket}
  end

  defp do_selection(option, socket) do
    case Venture.Selections.selection(socket, option) do
      {:nochange, selections} -> push socket, "selections", selections
      {:ok, selections} -> broadcast_selections! selections
    end
    {:noreply, socket}
  end

  @impl true
  def terminate(_reason, socket) do
    selections = Venture.Selections.deregister(socket)
    Venture.Connections.disconnect(socket)
    case Venture.Presentation.current_slide do
      %Fork{} -> broadcast_selections! selections
      %Poll{} -> broadcast_selections! selections
      _       -> nil
    end
    :ok
  end

end
