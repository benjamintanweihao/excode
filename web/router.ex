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
    pipe_through :browser # Use the default browser stack

    get "/",      PageController, :index
    get "/game",  PageController, :game
    get "/lobby", PageController, :lobby
  end

  socket "/ws", Excode do
    channel "games:*", GameChannel
    channel "lobby",   LobbyChannel
    channel "lobby:*", LobbyChannel
  end

end
