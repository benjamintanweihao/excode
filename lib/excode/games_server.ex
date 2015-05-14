defmodule Excode.GamesServer do

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
    # TODO: Must make sure that this doesn't exceed the maxplayer count
    # TODO: Also, isJoinable etc
    Agent.get_and_update(__MODULE__, fn(dict) ->
      game = HashDict.get(dict, game_id)
      game = %{game | players: game.players ++ [player]} 
      game = %{game | numPlayers: game.numPlayers + 1} 
      dict = HashDict.put(dict, game.id, game)
      {game, dict}
    end)
  end

end
