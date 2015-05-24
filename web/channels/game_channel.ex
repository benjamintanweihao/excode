defmodule Excode.GameChannel do
  use Phoenix.Channel
  alias Excode.GamesServer
  alias Excode.PlayersServer

  def join("games:" <> game_id, message, socket) do
    socket = assign(socket, "player_id", message["player_id"])
    socket = assign(socket, "game_id", game_id)

    {:ok, socket}
  end

  def handle_in("ingame:ready", _message, socket) do
    game_id   = socket.assigns["game_id"]
    player_id = socket.assigns["player_id"]

    game      = GamesServer.get_game(game_id)
    player    = PlayersServer.get_player(player_id)

    # TODO: Check that game and player are available

    push socket, "ingame:ready:res", %{
      success: !(game.isComplete || game.started || game.numPlayers < 1),
      game:    game, 
      player:  player
    }

    broadcast! socket, "ingame:update", %{
      game: game
    }

    {:noreply, socket}
  end

  def handle_in("ingame:started", _message, socket) do
    game_id = socket.assigns["game_id"]
    game    = game_id
                |> GamesServer.get_game
                |> GamesServer.start_game
                |> GamesServer.update_game

    broadcast! socket, "ingame:update", %{
      game: game
    }

    {:noreply, socket}
  end

  def handle_in("ingame:complete", message, socket) do
    game_id   = socket.assigns["game_id"]
    player_id = socket.assigns["player_id"]

    game   = GamesServer.get_game(game_id)
    player = PlayersServer.get_player(player_id)
    stats  = message["stats"]

    game = case game.winner do
      nil -> %{game | winner: player} |> GamesServer.update_game
      _ -> game
    end

    push socket, "ingame:complete:res", %{
      game:  game,
      stats: stats
    }

    {:noreply, socket}
  end

  def handle_in("ingame:advancecursor", message, socket) do
    broadcast! socket, "ingame:advancecursor", %{player_id: message["player_id"]}
    {:noreply, socket}
  end

  def handle_in("ingame:retreatcursor", message, socket) do
    broadcast! socket, "ingame:retreatcursor", %{player_id: message["player_id"]}
    {:noreply, socket}
  end

  def terminate(_reason, socket) do
    game_id   = socket.assigns["game_id"]
    player_id = socket.assigns["player_id"]

    player = PlayersServer.get_player(player_id)
    game   = game_id 
              |> GamesServer.remove_player(player)
              |> GamesServer.update_game

    if game.numPlayers == 0 do
      GamesServer.remove_game(game_id)
    end

    broadcast! socket, "ingame:update", %{
      game: game 
    }
  end

end
