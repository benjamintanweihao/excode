defmodule Excode.PageController do
  use Excode.Web, :controller

  plug :action

  def index(conn, _params) do
    render conn, "index.html"
  end

  def game(conn, _params) do
    render conn, "game.html", js: "game"
  end

  def lobby(conn, _params) do
    render conn, "lobby.html", js: "lobby"
  end
end
