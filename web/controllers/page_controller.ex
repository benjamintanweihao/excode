defmodule Excode.PageController do
  use Excode.Web, :controller

  plug :action

  def index(conn, _params) do
    render conn, "index.html"
  end

  def game(conn, params) do
    render conn, "game.html", js: "game", id: params["id"]
  end

  def lobby(conn, _params) do
    render conn, "lobby.html", js: "lobby"
  end
end
