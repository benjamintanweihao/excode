defmodule Excode.GamesServer do
  @game_time_join_cutoff_ms 5000

  alias Excode.Game

  def start_link do
    Agent.start_link(fn -> HashDict.new end, name: __MODULE__) 
  end

  def get_game(game_id) do
    Agent.get(__MODULE__, fn(dict) ->
      dict |> HashDict.get(game_id)
    end)
  end

  def add_game(game) do
    Agent.update(__MODULE__, fn(dict) ->
      dict |> HashDict.put(game.id, game)
    end)
  end

  def update_game(game) do
    Agent.get_and_update(__MODULE__, fn(dict) ->
      new_dict = dict |> HashDict.put(game.id, game)
      {game, new_dict}
    end)
  end
  
  def remove_game(game_id) do
    Agent.update(__MODULE__, fn(dict) ->
      dict |> HashDict.delete(game_id)
    end)
  end

  def fetch_games do
    Agent.get(__MODULE__, fn(dict) ->
      dict |> HashDict.values
    end)
  end

  def add_player(game_id, player) do
    Agent.get_and_update(__MODULE__, fn(dict) ->
      game = HashDict.get(dict, game_id)
      game = %{game | players:    game.players ++ [player]} 
      game = %{game | numPlayers: game.numPlayers + 1} 
      game = update_game_state(game)

      dict = HashDict.put(dict, game.id, game)
      {game, dict}
    end)
  end

  # Private functions which take in the game directly
  # Compute the next game state when something interesting happens
  # defp update_game_state(%Game{numPlayers: 0} = game) do
  #   game = %{game | "isComplete" => true}
  #   game = %{game | "isViewable" => false}
  #   game = %{game | "isJoinable" => false}
  #   game
  # end

  # defp update_game_state(%Game{numPlayers: maxPlayers, maxPlayers: maxPlayers} = game) do
  #   %{game | "isJoinable" => false}
  # end

  # Nothing to update once game has started.
  defp update_game_state(%Game{started: true} = game) do
    game
  end
  
  # defp update_game_state(%Game{gameType: "single", starting: true} = game) do
  #   setup_timing(game)
  # end

  # defp update_game_state(%Game{gameType: "single", starting: false} = game) do
  #   game = %{game | "starting"  => true}
  #   # TODO
  #   # game.startTime = moment().add(GAME_SINGLE_PLAYER_WAIT_TIME, 'seconds').toDate();
  #   # game = %{game | "startTime" => false}
  # end

  defp update_game_state(%Game{gameType: "multi", numPlayers: n} = game) when n > 1 do
    game = %{game | starting: true}
    game = %{game | startTime: start_time}
    game
  end

  # defp update_game_state(%Game{gameType: "multi", numPlayers: n} = game) when n < 2 do
  #   game = %{game | "startTime"  => nil}
  #   game = %{game | "isJoinable" => true}
  #   game
  # end

  # TODO: Need this?
  # def update_game_state(%Game{gameType: "multi", starting: false} = game) do
  #   setup_timing(game)
  # end

  # def setup_timing(%Game{isJoinable: true} = game) do
  #   if time_left(game) > @game_time_join_cutoff_ms do
  #     game = %{game | "isJoinable" => true}
  #     game |> update_game_state
  #   else
  #     game = %{game | "isJoinable" => false}
  #     game |> update_game_state
  #   end
  #   game
  # end
  
  # def setup_timing(%Game{isJoinable: false} = game) do
  #   if time_left(game) > 0 do
  #     # TODO: Add 1 second before starting ...
  #     # game.startTime + 1 second
  #     game |> start_game |> update_game_state
  #     # TODO: What does this do?
  #     # game.startingPlayers = game.players.slice();
  #   else
  #     # NOTE: This doesn't make sense to me... 
  #     #       Why do we need this?
  #     game = %{game | "started"    => true}
  #     game = %{game | "status"     => "ingame"}
  #     game = %{game | "isJoinable" => false}
  #   end
  #   game
  # end

  def start_game(game) do
    game = %{game | "started"    => true}
    game = %{game | "status"     => "ingame"}
    game = %{game | "isJoinable" => false}
  end

  def end_game(game) do
    game = %{game | "isComplete" => true}
    game = %{game | "isJoinable" => false}
  end

  def time_left(_), do: 1000

  defp start_time do
    Timex.Time.now(:secs) + 20
  end

end
