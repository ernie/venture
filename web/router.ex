defmodule Venture.Router do
  use Venture.Web, :router

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/api", Venture do
    pipe_through :api
  end

end
