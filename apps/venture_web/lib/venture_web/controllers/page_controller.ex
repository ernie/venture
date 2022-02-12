defmodule VentureWeb.PageController do
  use VentureWeb, :controller

  def index(conn, _params) do
    render(conn, "index.html")
  end
end
