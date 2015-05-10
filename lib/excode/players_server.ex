defmodule Excode.PlayersServer do

  def start_link do
    Agent.start_link(fn -> HashDict.new end, name: __MODULE__) 
  end

  def get_player(player_id) do
    Agent.get(__MODULE__, fn(dict) ->
      dict |> HashDict.get(player_id)
    end)
  end

  def add_player(player) do
    Agent.update(__MODULE__, fn(dict) ->
      dict |> HashDict.put(player["id"], player)
    end)
  end
  
  def remove_player(player_id) do
    Agent.update(__MODULE__, fn(dict) ->
      dict |> HashDict.delete(player_id)
    end)
  end

end
