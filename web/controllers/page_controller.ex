defmodule Excode.PageController do
  use Excode.Web, :controller

  plug :action

  def index(conn, _params) do
    render conn, "index.html"
  end

  def lobby(conn, _params) do
    render conn, "lobby.html"
  end
end
