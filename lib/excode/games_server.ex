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
    # Agent.update(__MODULE__, &HashDict.put(&1, game.id, game))
    Agent.update(__MODULE__, fn(dict) ->
      dict |> HashDict.put(game.id, game)
    end)
  end
  
  def remove_game(game_id) do
    Agent.update(__MODULE__, fn(dict) ->
      dict |> HashDict.delete(game_id)
    end)
  end

  def fetch_games do
    Agent.get(__MODULE__, fn(dict) ->
      dict |> Enum.into([])
    end)
  end

end
