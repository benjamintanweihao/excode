defmodule Excode.PageController do
  use Excode.Web, :controller

  plug :action

  def index(conn, _params) do
    render conn, "index.html", js: "lobby"
  end

  def game(conn, params) do
    render conn, "game.html", js: "game", game_id: params["game_id"], player_id: params["player_id"]
  end

end
