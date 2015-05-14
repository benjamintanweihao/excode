defmodule Excode.GameChannel do
  use Phoenix.Channel
  alias Excode.Game
  alias Excode.GamesServer
  alias Excode.PlayersServer

  @game_time_join_cutoff_ms 5000


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

    push socket, "ingame:ready:res", %{
      success: true,
      game:    game, 
      player:  player
    }
    {:noreply, socket}
  end

  def handle_in("ingame:complete", message, socket) do
    push socket, "ingame:complete:res", message
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

  def handle_in("ingame:update", message, socket) do
    game_id   = socket.assigns["game_id"]
    game      = GamesServer.get_game(game_id)
    game |> update_game_state |> GameServer.update_game

    # TODO: Maybe return just a subset of the game's attributes?
    broadcast! socket, "ingame:update:res", %{game: game}
    {:noreply, socket}
  end

  def terminate(socket, message) do
    socket
  end

  def update_game_state(%Game{numPlayers: 0} = game) do
    game = %{game | "isComplete" => true}
    game = %{game | "isViewable" => false}
    game = %{game | "isJoinable" => false}
    # TODO: Remove timeouts?
    game
  end

  # TODO: Check if we need to set other things or not
  def update_game_state(%Game{numPlayers: maxPlayers, maxPlayers: maxPlayers} = game) do
    %{game | "isJoinable" => false}
  end

  def update_game_state(%Game{gameType: "single", started: true} = game), do: game
  
  def update_game_state(%Game{gameType: "single", starting: true} = game) do
    setup_timing(game)
  end

  def update_game_state(%Game{gameType: "single", starting: false} = game) do
    game = %{game | "starting"  => true}
    # TODO
    # game.startTime = moment().add(GAME_SINGLE_PLAYER_WAIT_TIME, 'seconds').toDate();
    # game = %{game | "startTime" => false}
  end

  def update_game_state(%Game{gameType: "multi", started: true} = game), do: game

  def update_game_state(%Game{gameType: "multi", starting: true, numPlayers: n} = game) when n > 1 do
      game = %{game | "starting" => true}
      # TODO: game.startTime = moment().add(GAME_MULTI_PLAYER_WAIT_TIME, 'seconds').toDate();
      setup_timing(game)
      game
  end

  def update_game_state(%Game{gameType: "multi", starting: false, numPlayers: n} = game) when n < 2 do
      game = %{game | "starting"   => false}
      game = %{game | "startTime"  => nil}
      game = %{game | "isJoinable" => true}
      # TODO: gameTimeouts.remove(game.id);
  end

  def update_game_state(%Game{gameType: "multi", starting: false, numPlayers: n} = game) do
    setup_timing(game)
  end

  def setup_timing(%Game{isJoinable: true} = game) do
    if time_left(game) > @game_time_join_cutoff_ms do
      game = %{game | "isJoinable" => true}
      game |> update_game_state
    else
      game = %{game | "isJoinable" => false}
      game |> update_game_state
    end
  end
  
  def setup_timing(%Game{isJoinable: false} = game) do
    if time_left(game) > 0 do
      # TODO: Add 1 second before starting ...
      # game.startTime + 1 second
      game |> start_game |> update_game_state
      # TODO: What does this do?
      # game.startingPlayers = game.players.slice();
    else
      # NOTE: This doesn't make sense to me... 
      #       Why do we need this?
      game = %{game | "started"    => true}
      game = %{game | "status"     => "ingame"}
      game = %{game | "isJoinable" => false}
    end
  end

  def start_game(game) do
    game = %{game | "started"    => true}
    game = %{game | "status"     => "ingame"}
    game = %{game | "isJoinable" => false}
  end

  def end_game(game) do
    game = %{game | "isComplete" => true}
    game = %{game | "isJoinable" => false}
  end

  def time_left(game) do
    Timex.DateFormat.parse(game.startTime, "{RFC3339}")
    |> Timex.Date.diff(Timex.Date.now, :secs)
  end

end
