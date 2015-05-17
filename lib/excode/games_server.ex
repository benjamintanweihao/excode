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

  def remove_player(game_id, player) do
    Agent.get_and_update(__MODULE__, fn(dict) ->
      game = HashDict.get(dict, game_id)

      if game do
        game = %{game | players:    List.delete(game.players, player)} 
        game = %{game | numPlayers: game.numPlayers - 1} 
        game = update_game_state(game)
        dict = HashDict.put(dict, game.id, game)
      end

      {game, dict}
    end)
  end

  defp update_game_state(%Game{numPlayers: maxPlayers, maxPlayers: maxPlayers} = game) do
    %{game | isJoinable: false}
  end

  defp update_game_state(%Game{started: true} = game) do
    game
  end
  
  defp update_game_state(%Game{numPlayers: 0} = game) do
    %{game | isJoinable: false,
             isComplete: true}
  end

  defp update_game_state(%Game{gameType: "single", starting: false} = game) do
    %{game | starting: true,
             started:  true,
             startTime: start_time}
  end

  defp update_game_state(%Game{gameType: "multi", numPlayers: n} = game) when n > 1 do
    %{game | starting:  true,
             startTime: start_time}
  end

  defp update_game_state(%Game{gameType: "multi", numPlayers: n} = game) when n < 2 do
    %{game | isJoinable: true,
             starting:   false,
             status:     "waiting"}
  end

  def start_game(game) do
    %{game | isJoinable: false,
             started:    true,
             status:     "ingame"}
  end

  def end_game(game) do
    %{game | isComplete: true,
             isJoinable: false}
  end

  def start_time do
    Timex.Time.now(:secs) + 5
  end

end
