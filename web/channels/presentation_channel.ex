defmodule Venture.PresentationChannel do
  use Phoenix.Channel
  use Venture.Slide

  def join(
    "presentation:presenter",
    _auth_msg,
    socket = %{assigns: %{presenter: true}}
  ) do
    slide = Venture.Presentation.current_slide
    selections = Venture.Selections.current
    connections = Venture.Connections.connect(socket)
    {
      :ok,
      %{slide: slide, selections: selections, connections: connections},
      socket
    }
  end

  def join(
    "presentation:attendee",
    _auth_msg,
    socket = %{assigns: %{presenter: false}}
  ) do
    slide = Venture.Presentation.current_slide
    selections = Venture.Selections.current
    Venture.Connections.connect(socket)
    {
      :ok,
      %{slide: strip_nonpresenter_data(slide), selections: selections},
      socket
    }
  end

  def join("presentation:" <> _any, _auth_msg, _socket) do
    {:error, %{reason: "unauthorized"}}
  end

  def handle_in("next", _msg, socket = %{assigns: %{presenter: true}}) do
    case Venture.Presentation.next do
      nil -> nil
      slide -> broadcast_slide! slide
    end
    {:noreply, socket}
  end

  def handle_in("prev", _msg, socket = %{assigns: %{presenter: true}}) do
    case Venture.Presentation.prev do
      nil -> nil
      slide -> broadcast_slide! slide
    end
    {:noreply, socket}
  end

  def handle_in("reset", _msg, socket = %{assigns: %{presenter: true}}) do
    Venture.Deck.reload
    Venture.Presentation.reset
    broadcast_current_slide!
    {:noreply, socket}
  end

  def handle_in("reload", _msg, socket = %{assigns: %{presenter: true}}) do
    Venture.Deck.reload
    Venture.Presentation.reset_selections
    broadcast_current_slide!
    {:noreply, socket}
  end

  def handle_in("select", %{"option" => option}, socket) do
    handle_selection(Venture.Presentation.current_slide, option, socket)
  end

  def handle_in(_event, _msg, socket) do
    {:noreply, socket}
  end

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

  defp strip_nonpresenter_data(slide = %Fork{}) do
    %Fork{ slide | next: nil, notes: nil, paths: Enum.map(slide.paths, &strip_nonpresenter_data/1) }
  end

  defp strip_nonpresenter_data(slide) do
    %{ slide | next: nil, notes: nil }
  end

  defp broadcast_slide!(%Fork{} = slide) do
    broadcast_slide_with_selections!(slide)
  end

  defp broadcast_slide!(%Poll{} = slide) do
    broadcast_slide_with_selections!(slide)
  end

  defp broadcast_slide!(slide) do
    Venture.Endpoint.broadcast!(
      "presentation:presenter", "slide", %{slide: slide}
    )
    Venture.Endpoint.broadcast!(
      "presentation:attendee", "slide", %{slide: strip_nonpresenter_data(slide)}
    )
  end

  defp broadcast_slide_with_selections!(slide) do
    selections = Venture.Selections.current
    Venture.Endpoint.broadcast!(
      "presentation:presenter", "slide",
      %{slide: slide, selections: selections}
    )
    Venture.Endpoint.broadcast!(
      "presentation:attendee", "slide",
      %{
        slide: strip_nonpresenter_data(slide),
        selections: selections
      }
    )
  end

  defp broadcast_current_slide! do
    broadcast_slide! Venture.Presentation.current_slide
  end

  defp broadcast_selections!(selections) do
    Venture.Endpoint.broadcast!(
      "presentation:presenter", "selections", selections
    )
    Venture.Endpoint.broadcast!(
      "presentation:attendee", "selections", selections
    )
  end

  defp handle_selection(
    %Fork{}, option, socket = %{assigns: %{presenter: true}}
  ) do
    Venture.Presentation.go(option)
    broadcast_current_slide!
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

end
