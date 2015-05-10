defmodule Excode.GameChannel do
  use Phoenix.Channel
  alias Excode.GamesServer

  def join("games:" <> id, message, socket) do
    {:ok, socket}
  end

  def handle_in("ingame:ready", message, socket) do
    "games:" <> game_id = socket.topic
    game = GamesServer.get_game(game_id)

    push socket, "ingame:ready:res", %{
      success: true,
      game:    game
    }
    {:noreply, socket}
  end

  def handle_in("ingame:complete", message, socket) do
    push socket, "ingame:complete:res", message
    {:noreply, socket}
  end

  def handle_in("ingame:advancecursor", message, socket) do
    broadcast! socket, "ingame:advancecursor", %{player: message["player"]}
    {:noreply, socket}
  end

  def handle_in("ingame:retreatcursor", message, socket) do
    broadcast! socket, "ingame:retreatcursor", %{player: message["player"]}
    {:noreply, socket}
  end

  def terminate(socket, message) do
    socket
  end

end
