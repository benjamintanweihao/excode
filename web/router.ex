defmodule Excode.Router do
  use Excode.Web, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/", Excode do
    pipe_through :browser

    get "/",                                 PageController, :index
    get "/games/:game_id/player/:player_id", PageController, :game
  end

  socket "/ws", Excode do
    channel "games:*", GameChannel
    channel "lobby",   LobbyChannel
    channel "lobby:*", LobbyChannel
  end

end
