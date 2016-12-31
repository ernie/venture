defmodule Venture.Endpoint do
  use Phoenix.Endpoint, otp_app: :venture

  socket "/socket", Venture.UserSocket

  def redirect_index(conn = %Plug.Conn{path_info: []}, _opts) do
    %Plug.Conn{conn | path_info: ["index.html"]}
  end

  def redirect_index(conn, _opts) do
    conn
  end

  plug :redirect_index

  # Serve at "/" the static files from "priv/static" directory.
  #
  # You should set gzip to true if you are running phoenix.digest
  # when deploying your static files in production.
  plug Plug.Static,
    at: "/", from: :venture, gzip: false,
    only: ~w(css fonts images backgrounds js index.html favicon.ico robots.txt)

  # Code reloading can be explicitly enabled under the
  # :code_reloader configuration of your endpoint.
  if code_reloading? do
    plug Phoenix.CodeReloader
  end

  plug Plug.RequestId
  plug Plug.Logger

  plug Plug.Parsers,
    parsers: [:urlencoded, :multipart, :json],
    pass: ["*/*"],
    json_decoder: Poison

  plug Plug.MethodOverride
  plug Plug.Head

  plug Plug.Session,
    store: :cookie,
    key: "_venture_key",
    signing_salt: "LEvHMIbb"

  plug Venture.Router
end
